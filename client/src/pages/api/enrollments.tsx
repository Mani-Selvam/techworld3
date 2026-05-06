// pages/api/enrollments.ts
import { NextApiRequest, NextApiResponse } from "next";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { enrollments } from "../../../lib/db/schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
}

const client = postgres(connectionString);
const db = drizzle(client);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method === "GET") {
            const allEnrollments = await db.select().from(enrollments);
            res.status(200).json(allEnrollments);
        } else {
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error("Error fetching enrollments:", error);
        res.status(500).json({ error: "Failed to fetch enrollments" });
    }
}
