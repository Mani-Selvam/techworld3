import {
    attendees,
    enrollments,
    type Attendee,
    type Enrollment,
    type InsertAttendee,
    type InsertEnrollment,
} from "./schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface IStorage {
    createAttendee(attendee: InsertAttendee): Promise<Attendee>;
    getAttendees(): Promise<Attendee[]>;
    createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
    getEnrollments(): Promise<Enrollment[]>;
}

export class MemStorage implements IStorage {
    constructor(
        private attendees: Attendee[] = [],
        private enrollments: Enrollment[] = []
    ) {}

    async createAttendee(insertAttendee: InsertAttendee): Promise<Attendee> {
        const attendee: Attendee = {
            id: nanoid(),
            ...insertAttendee,
            companyName: insertAttendee.companyName || null,
            registeredAt: new Date(),
        };
        this.attendees.push(attendee);
        return attendee;
    }

    async getAttendees(): Promise<Attendee[]> {
        return [...this.attendees];
    }

    async createEnrollment(
        insertEnrollment: InsertEnrollment
    ): Promise<Enrollment> {
        const enrollment: Enrollment = {
            id: nanoid(),
            ...insertEnrollment,
            blockchainCoding: insertEnrollment.blockchainCoding || null,
            cryptoDefi: insertEnrollment.cryptoDefi || null,
            nftWeb3: insertEnrollment.nftWeb3 || null,
            enrolledAt: new Date(),
        };
        this.enrollments.push(enrollment);
        return enrollment;
    }

    async getEnrollments(): Promise<Enrollment[]> {
        return [...this.enrollments];
    }
}

export class DatabaseStorage implements IStorage {
    constructor(private db: any) {}

    async createAttendee(insertAttendee: InsertAttendee): Promise<Attendee> {
        try {
            console.log("💾 DatabaseStorage.createAttendee [START]:", JSON.stringify(insertAttendee));
            const inserted = await this.db.insert(attendees).values(insertAttendee).returning();
            console.log("✅ DatabaseStorage.createAttendee [SUCCESS]:", JSON.stringify(inserted));
            
            if (!inserted || inserted.length === 0) {
                console.error("❌ DatabaseStorage.createAttendee [EMPTY RESULT]");
                throw new Error("Database returned empty result after insert");
            }
            return inserted[0];
        } catch (error) {
            console.error("❌ DatabaseStorage.createAttendee [CRITICAL FAILURE]:", error);
            throw error;
        }
    }

    async getAttendees(): Promise<Attendee[]> {
        try {
            const result = await this.db.select().from(attendees);
            return result || [];
        } catch (error) {
            console.error("Error in getAttendees:", error);
            return [];
        }
    }

    async createEnrollment(
        insertEnrollment: InsertEnrollment
    ): Promise<Enrollment> {
        try {
            console.log("💾 DatabaseStorage.createEnrollment [START]:", JSON.stringify(insertEnrollment));
            const inserted = await this.db.insert(enrollments).values(insertEnrollment).returning();
            console.log("✅ DatabaseStorage.createEnrollment [SUCCESS]:", JSON.stringify(inserted));
            if (!inserted || inserted.length === 0) {
                console.error("❌ DatabaseStorage.createEnrollment [EMPTY RESULT]");
                throw new Error("Failed to insert enrollment - no result returned");
            }
            return inserted[0];
        } catch (error) {
            console.error("❌ DatabaseStorage.createEnrollment [CRITICAL FAILURE]:", error);
            throw error;
        }
    }

    async getEnrollments(): Promise<Enrollment[]> {
        try {
            const result = await this.db.select().from(enrollments);
            return result || [];
        } catch (error) {
            console.error("Error in getEnrollments:", error);
            return [];
        }
    }
}

let storageInstance: IStorage | null = null;
let isInitializing = false;

async function initializeStorage(): Promise<IStorage> {
    if (storageInstance) {
        return storageInstance;
    }

    if (isInitializing) {
        while (isInitializing) {
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
        return storageInstance!;
    }

    isInitializing = true;

    try {
        console.log("🔍 Environment variables check:");
        console.log("- DATABASE_URL exists:", !!process.env.DATABASE_URL);
        console.log(
            "- DATABASE_URL value:",
            process.env.DATABASE_URL
                ? process.env.DATABASE_URL.substring(0, 50) + "..."
                : "not found"
        );

        if (process.env.DATABASE_URL) {
            const { db } = await import("./db");
            storageInstance = new DatabaseStorage(db);
            console.log("✅ Using DatabaseStorage with Neon database:", process.env.DATABASE_URL.substring(0, 20));
        } else {
            storageInstance = new MemStorage();
            console.log("⚠️  Using MemStorage - DATABASE_URL not found");
        }
    } catch (error) {
        console.error("Failed to initialize database storage:", error);
        console.log("⚠️  Falling back to MemStorage");
        storageInstance = new MemStorage();
    } finally {
        isInitializing = false;
    }

    return storageInstance;
}

export const storage = new Proxy({} as IStorage, {
    get(target, prop) {
        return async (...args: any[]) => {
            const instance = await initializeStorage();
            return (instance as any)[prop](...args);
        };
    },
});
