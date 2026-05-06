// pages/api/export/[type].ts
import { NextApiRequest, NextApiResponse } from "next";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { attendees, enrollments } from "../../../lib/db/schema";
import { Parser } from "json2csv";

const connectionString = process.env.NEON_DATABASE_URL;
if (!connectionString) {
    throw new Error("NEON_DATABASE_URL is not defined");
}

const client = postgres(connectionString);
const db = drizzle(client);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { type } = req.query;

        if (req.method !== "GET") {
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
            return;
        }

        let data;
        if (type === "attendees") {
            data = await db.select().from(attendees);
        } else if (type === "enrollments") {
            let query = db.select().from(enrollments);

            // Apply filters if provided
            const { role, ageGroup, mode, search } = req.query;
            if (role && role !== "All") {
                // @ts-ignore
                query = query.where(eq(enrollments.currentRole, role));
            }
            if (ageGroup && ageGroup !== "All") {
                // @ts-ignore
                query = query.where(eq(enrollments.ageGroup, ageGroup));
            }
            if (mode && mode !== "All") {
                // @ts-ignore
                query = query.where(eq(enrollments.preferredMode, mode));
            }
            if (search) {
                // @ts-ignore
                query = query.where(
                    or(
                        like(enrollments.fullName, `%${search}%`),
                        like(enrollments.email, `%${search}%`),
                        like(enrollments.city, `%${search}%`)
                    )
                );
            }

            data = await query;
        } else {
            res.status(400).json({ error: "Invalid export type" });
            return;
        }

        // Convert to CSV
        const parser = new Parser();
        const csv = parser.parse(data);

        // Set headers for CSV download
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
        res.status(500).json({ error: "Failed to export data" });
    }
}
