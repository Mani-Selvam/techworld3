// pages/api/attendees.ts
import { NextApiRequest, NextApiResponse } from "next";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { attendees } from "../../../lib/db/schema";
import dotenv from "dotenv";
const envPath = join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

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
            const allAttendees = await db.select().from(attendees);
            res.status(200).json(allAttendees);
        } else {
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error("Error fetching attendees:", error);
        res.status(500).json({ error: "Failed to fetch attendees" });
    }
}
