import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAttendeeSchema, insertEnrollmentSchema } from "./schema";
import { fromZodError } from "zod-validation-error";
import { Parser } from "json2csv";
import crypto from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
    app.post("/api/register", async (req, res) => {
        try {
            const result = insertAttendeeSchema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: fromZodError(result.error).toString(),
                });
            }

            const attendee = await storage.createAttendee(result.data);

            res.status(201).json({
                success: true,
                message: "Registration successful!",
                attendee: {
                    id: attendee.id,
                    name: attendee.name,
                    email: attendee.email,
                },
            });
        } catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to register attendee",
            });
        }
    });

    app.get("/api/attendees", async (req, res) => {
        try {
            const attendees = await storage.getAttendees();
            res.json({ attendees });
        } catch (error) {
            console.error("Error fetching attendees:", error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to fetch attendees",
            });
        }
    });

    app.post("/api/enroll", async (req, res) => {
        try {
            const result = insertEnrollmentSchema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: fromZodError(result.error).toString(),
                });
            }

            const enrollment = await storage.createEnrollment(result.data);

            res.status(201).json({
                success: true,
                message: "Enrollment successful!",
                enrollment: {
                    id: enrollment.id,
                    fullName: enrollment.fullName,
                    email: enrollment.email,
                },
            });
        } catch (error) {
            console.error("Enrollment error:", error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to process enrollment",
            });
        }
    });

    app.get("/api/enrollments", async (req, res) => {
        try {
            const enrollments = await storage.getEnrollments();
            res.json({ enrollments });
        } catch (error) {
            console.error("Error fetching enrollments:", error);
            res.status(500).json({
                error: "Internal server error",
                message: "Failed to fetch enrollments",
            });
        }
    });

    app.get("/api/export/:type", async (req, res) => {
        try {
            const { type } = req.params;
            const { role, ageGroup, mode, search } = req.query;

            if (type !== "attendees" && type !== "enrollments") {
                return res.status(400).json({
                    error: "Invalid export type. Must be 'attendees' or 'enrollments'",
                });
            }

            let data: any[] = [];

            if (type === "attendees") {
                data = await storage.getAttendees();
            } else if (type === "enrollments") {
                let enrollments = await storage.getEnrollments();

                if (role && role !== "All") {
                    enrollments = enrollments.filter(
                        (e) => e.currentRole === role
                    );
                }
                if (ageGroup && ageGroup !== "All") {
                    enrollments = enrollments.filter(
                        (e) => e.ageGroup === ageGroup
                    );
                }
                if (mode && mode !== "All") {
                    enrollments = enrollments.filter(
                        (e) => e.preferredMode === mode
                    );
                }
                if (search) {
                    const searchTerm = String(search).toLowerCase();
                    enrollments = enrollments.filter(
                        (e) =>
                            (e.fullName &&
                                e.fullName
                                    .toLowerCase()
                                    .includes(searchTerm)) ||
                            (e.email &&
                                e.email.toLowerCase().includes(searchTerm)) ||
                            (e.city &&
                                e.city.toLowerCase().includes(searchTerm))
                    );
                }

                data = enrollments;
            }

            const parser = new Parser();
            const csv = parser.parse(data);

            res.setHeader("Content-Type", "text/csv");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${type}-export-${
                    new Date().toISOString().split("T")[0]
                }.csv"`
            );

            res.status(200).send(csv);
        } catch (error) {
            console.error("Error exporting data:", error);
            res.status(500).json({
                error: "Failed to export data",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            });
        }
    });

    app.get("/api/test-db", async (req, res) => {
        try {
            const { db } = await import("./db");
            const { sql } = await import("drizzle-orm");
            const result = await db.execute(sql`SELECT NOW() as current_time`);
            res.json({
                success: true,
                connection: "Database connected successfully",
                time:
                    result.rows && result.rows[0]
                        ? result.rows[0].current_time
                        : null,
            });
        } catch (error) {
            console.error("Database test error:", error);
            res.status(500).json({
                error: "Database connection failed",
                message:
                    error instanceof Error ? error.message : "Unknown error",
            });
        }
    });

    app.post("/api/razorpay/order", async (req, res) => {
        try {
            const keyId = process.env.RAZORPAY_KEY_ID;
            const keySecret = process.env.RAZORPAY_KEY_SECRET;

            if (!keyId || !keySecret) {
                return res.status(500).json({
                    error: "Razorpay not configured",
                    message:
                        "Missing RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET on server",
                });
            }

            const amount = Number(req.body?.amount);
            const currency =
                typeof req.body?.currency === "string"
                    ? req.body.currency
                    : "INR";
            const receipt =
                typeof req.body?.receipt === "string"
                    ? req.body.receipt
                    : `rcpt_${Date.now()}`;
            const notes =
                req.body?.notes && typeof req.body.notes === "object"
                    ? req.body.notes
                    : undefined;

            if (!Number.isFinite(amount) || amount <= 0) {
                return res.status(400).json({
                    error: "Validation failed",
                    message: "amount must be a positive number (in paise)",
                });
            }

            const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
            const rpRes = await fetch("https://api.razorpay.com/v1/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Basic ${auth}`,
                },
                body: JSON.stringify({
                    amount: Math.round(amount),
                    currency,
                    receipt,
                    notes,
                }),
            });

            const payloadText = await rpRes.text();
            let payload: any = null;
            try {
                payload = JSON.parse(payloadText);
            } catch {
                payload = { raw: payloadText };
            }

            if (!rpRes.ok) {
                return res.status(rpRes.status).json({
                    error: "Razorpay order failed",
                    status: rpRes.status,
                    details: payload,
                });
            }

            return res.json({
                orderId: payload.id,
                amount: payload.amount,
                currency: payload.currency,
                keyId,
            });
        } catch (error) {
            console.error("Razorpay order error:", error);
            return res.status(500).json({
                error: "Internal server error",
                message: "Failed to create Razorpay order",
            });
        }
    });

    app.post("/api/razorpay/verify", async (req, res) => {
        try {
            const keySecret = process.env.RAZORPAY_KEY_SECRET;
            if (!keySecret) {
                return res.status(500).json({
                    error: "Razorpay not configured",
                    message: "Missing RAZORPAY_KEY_SECRET on server",
                });
            }

            const orderId = String(req.body?.razorpay_order_id || "");
            const paymentId = String(req.body?.razorpay_payment_id || "");
            const signature = String(req.body?.razorpay_signature || "");

            if (!orderId || !paymentId || !signature) {
                return res.status(400).json({
                    error: "Validation failed",
                    message:
                        "razorpay_order_id, razorpay_payment_id, razorpay_signature are required",
                });
            }

            const expected = crypto
                .createHmac("sha256", keySecret)
                .update(`${orderId}|${paymentId}`)
                .digest("hex");

            if (expected !== signature) {
                return res.status(400).json({
                    ok: false,
                    error: "Signature mismatch",
                });
            }

            return res.json({ ok: true });
        } catch (error) {
            console.error("Razorpay verify error:", error);
            return res.status(500).json({
                error: "Internal server error",
                message: "Failed to verify Razorpay payment",
            });
        }
    });

    const httpServer = createServer(app);
    return httpServer;
}
