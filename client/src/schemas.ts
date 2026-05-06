import { z } from "zod";

export const insertAttendeeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email required"),
    mobile: z.string().min(10, "Valid mobile number required"),
    companyName: z.string().optional().or(z.literal("")),
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

export type InsertAttendee = z.infer<typeof insertAttendeeSchema>;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
