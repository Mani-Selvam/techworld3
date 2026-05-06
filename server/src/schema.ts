import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const attendees = pgTable("attendees", {
    id: text("id")
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    name: text("name").notNull(),
    email: text("email").notNull(),
    mobile: text("mobile").notNull(),
    companyName: text("company_name"),
    registeredAt: timestamp("registered_at")
        .notNull()
        .default(sql`now()`),
});

export const enrollments = pgTable("enrollments", {
    id: text("id")
        .primaryKey()
        .default(sql`gen_random_uuid()`),
    fullName: text("full_name").notNull(),
    mobile: text("mobile").notNull(),
    email: text("email").notNull(),
    city: text("city").notNull(),
    ageGroup: text("age_group").notNull(),
    currentRole: text("current_role").notNull(),
    blockchainCoding: text("blockchain_coding"),
    cryptoDefi: text("crypto_defi"),
    nftWeb3: text("nft_web3"),
    preferredMode: text("preferred_mode").notNull(),
    preferredTiming: text("preferred_timing").notNull(),
    hearAboutUs: text("hear_about_us").notNull(),
    whyLearn: text("why_learn").notNull(),
    enrolledAt: timestamp("enrolled_at")
        .notNull()
        .default(sql`now()`),
});

export const insertAttendeeSchema = createInsertSchema(attendees).omit({
    id: true,
    registeredAt: true,
});

export const insertEnrollmentSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    mobile: z.string().min(10, "Valid mobile number required"),
    email: z.string().email("Valid email required"),
    city: z.string().min(1, "City is required"),
    ageGroup: z.enum(["15-20", "21-25", "26-30", "31+"]),
    currentRole: z.enum([
        "Student",
        "Working Professional",
        "Business Owner",
        "Others",
    ]),
    blockchainCoding: z
        .enum(["Beginner", "Intermediate", "Advanced"])
        .optional()
        .or(z.literal("")),
    cryptoDefi: z
        .enum(["Beginner", "Intermediate", "Advanced"])
        .optional()
        .or(z.literal("")),
    nftWeb3: z
        .enum(["Beginner", "Intermediate", "Advanced"])
        .optional()
        .or(z.literal("")),
    preferredMode: z.enum(["Online", "Offline"]),
    preferredTiming: z.enum(["Morning", "Afternoon", "Evening"]),
    hearAboutUs: z.enum([
        "Instagram",
        "WhatsApp",
        "Friend",
        "College",
        "Other",
    ]),
    whyLearn: z.string().min(1, "Please tell us why you want to learn"),
});

export type Attendee = typeof attendees.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
