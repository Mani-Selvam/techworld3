// src/components/RegistrationPopup.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    User,
    Mail,
    Phone,
    Building2,
    CheckCircle,
    X,
    Sparkles,
    Loader2,
    MessageCircle,
    GraduationCap,
} from "lucide-react";
import { getApiBase } from "@/lib/queryClient";
import {
    openPaymentSuccessWhatsApp,
    openInquiryWhatsApp,
} from "@/lib/whatsapp";

declare global {
    interface Window {
        Razorpay?: any;
    }
}

async function loadScript(src: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) return resolve();

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () =>
            reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
    });
}

// Registration form schema
const registrationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
    companyName: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

type RegistrationPopupProps = {
    isOpen: boolean;
    onClose: () => void;
    mode?: "register" | "pay_only";
    payAmountPaise?: number;
};

export default function RegistrationPopup({
    isOpen,
    onClose,
    mode = "register",
    payAmountPaise = 19900,
}: RegistrationPopupProps) {
    const [showThankYou, setShowThankYou] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const [error, setError] = useState("");
    const [registeredData, setRegisteredData] =
        useState<RegistrationFormData | null>(null);
    const [selectedProgram, setSelectedProgram] = useState<
        "workshop" | "internship" | "master"
    >("workshop");

    const form = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            name: "",
            email: "",
            mobile: "",
            companyName: "",
        },
    });

    const openWhatsApp = (paymentDetails?: {
        orderId: string;
        amount: number;
    }) => {
        const whatsappNumber =
            import.meta.env.VITE_WHATSAPP_NUMBER || "+919345791995";

        // 🎉 If payment details are available, send payment success message
        if (paymentDetails && paymentDetails.amount > 0) {
            openPaymentSuccessWhatsApp(whatsappNumber, {
                orderId: paymentDetails.orderId,
                amount: paymentDetails.amount,
                customerName: form.getValues("name"),
                courseName: selectedProgram,
            });
        } else {
            // Otherwise send inquiry message
            openInquiryWhatsApp(
                whatsappNumber,
                form.getValues("name") || "there",
                selectedProgram,
            );
        }
    };

    const getProgramAmountPaise = () => {
        if (mode === "pay_only") return payAmountPaise;
        // Adjust these amounts as needed (paise)
        if (selectedProgram === "internship") return 49900; // ₹499
        if (selectedProgram === "master") return 199900; // ₹1999
        return 0; // workshop (free)
    };

    const handlePayNow = async () => {
        setError("");
        setIsPaying(true);

        try {
            const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
            if (!keyId) {
                throw new Error(
                    "Missing VITE_RAZORPAY_KEY_ID in client env (client/.env)",
                );
            }

            const amount = getProgramAmountPaise();
            if (amount <= 0) {
                openWhatsApp();
                return;
            }

            const apiBase = getApiBase();
            const candidate = registeredData ?? form.getValues();
            const canPrefill =
                mode === "pay_only"
                    ? false
                    : registeredData
                      ? true
                      : await form.trigger();
            const prefillData = canPrefill ? candidate : null;
            if (!registeredData && prefillData) {
                setRegisteredData(prefillData);
            }

            await loadScript("https://checkout.razorpay.com/v1/checkout.js");
            if (!window.Razorpay) {
                throw new Error("Razorpay Checkout failed to load");
            }

            const orderRes = await fetch(`${apiBase}/api/razorpay/order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount,
                    currency: "INR",
                    receipt: `reg_${Date.now()}`,
                    notes: prefillData
                        ? {
                              name: prefillData.name,
                              email: prefillData.email,
                              mobile: prefillData.mobile,
                              program: selectedProgram,
                          }
                        : { program: selectedProgram },
                }),
            });

            const orderJson = await orderRes.json().catch(() => ({}));
            if (!orderRes.ok) {
                const details =
                    typeof orderJson?.details === "string"
                        ? orderJson.details
                        : orderJson?.details
                          ? JSON.stringify(orderJson.details)
                          : "";
                throw new Error(
                    orderJson?.message ||
                        orderJson?.error ||
                        details ||
                        "Failed to create Razorpay order",
                );
            }

            const rp = new window.Razorpay({
                key: orderJson.keyId || keyId,
                amount: orderJson.amount,
                currency: orderJson.currency || "INR",
                name: "TechAra Academy",
                description:
                    selectedProgram === "internship"
                        ? "Internship Program"
                        : "Master Course",
                order_id: orderJson.orderId,
                prefill: prefillData
                    ? {
                          name: prefillData.name,
                          email: prefillData.email,
                          contact: prefillData.mobile,
                      }
                    : undefined,
                notes: prefillData
                    ? {
                          name: prefillData.name,
                          email: prefillData.email,
                          mobile: prefillData.mobile,
                          program: selectedProgram,
                      }
                    : { program: selectedProgram },
                theme: { color: "#8B5CF6" },
                handler: async (response: any) => {
                    try {
                        const verifyRes = await fetch(
                            `${apiBase}/api/razorpay/verify`,
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(response),
                            },
                        );
                        const verifyJson = await verifyRes
                            .json()
                            .catch(() => ({}));
                        if (!verifyRes.ok || !verifyJson?.ok) {
                            throw new Error("Payment verification failed");
                        }

                        // ✅ Payment success: send WhatsApp message with payment details
                        openWhatsApp({
                            orderId: response.razorpay_order_id,
                            amount: amount,
                        });
                        handleClose();
                    } catch (e) {
                        console.error("Verify error:", e);
                        setError(
                            "Payment succeeded, but verification failed. Please contact support.",
                        );
                    }
                },
            });

            rp.open();
        } catch (e) {
            console.error("Payment error:", e);
            setError(e instanceof Error ? e.message : "Payment failed");
        } finally {
            setIsPaying(false);
        }
    };

    const onSubmit = async (data: RegistrationFormData) => {
        setIsSubmitting(true);
        setError("");

        try {
            // Submit registration data to your backend
            const apiBase = getApiBase();
            const url = `${apiBase}/api/register`;
            console.log("Registration API URL:", url);
            console.log("Registration data:", data);

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            console.log("Registration response status:", response.status);
            console.log("Response headers:", {
                contentType: response.headers.get("content-type"),
                contentLength: response.headers.get("content-length"),
            });

            const responseText = await response.text();
            console.log("Response text:", responseText);

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error("JSON parse error:", parseError);
                throw new Error(
                    `Server error: ${response.status} - ${responseText || "No response"}`,
                );
            }

            console.log("Registration result:", result);

            if (!response.ok) {
                setError(
                    result.details ||
                        result.message ||
                        `Registration failed: ${response.status}`,
                );
                setIsSubmitting(false);
                return; // Stop execution here
            }

            // Also send data to n8n webhook for email
            fetch("https://brotechapp.app.n8n.cloud/webhook/TechAra", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }).catch((err) => console.error("n8n error:", err));

            // Registration successful
            setIsSubmitting(false);
            setShowThankYou(true);
            setError(""); // Clear any previous errors

            setRegisteredData(data);
        } catch (error) {
            console.error("Registration error:", error);
            console.error(
                "Error details:",
                error instanceof Error ? error.message : String(error),
            );
            setIsSubmitting(false);
            setError(
                error instanceof Error
                    ? error.message
                    : "Registration failed. Please try again.",
            );
        }
    };

    const handleClose = () => {
        if (!isSubmitting && !isPaying) {
            onClose();
            if (showThankYou) {
                setShowThankYou(false);
                form.reset();
                setError("");
                setRegisteredData(null);
                setSelectedProgram("workshop");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleClose}
            />

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-lg transform transition-all duration-300 scale-100">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-3xl blur-3xl"></div>

                    {/* Modal Content */}
                    <div className="relative bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 border border-purple-500/20 rounded-3xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="relative p-6 pb-0">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                        <GraduationCap className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">
                                            Join TechAra Academy
                                        </h3>
                                        <p className="text-purple-300 text-sm">
                                            Start your Web3 journey today
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                                    disabled={isSubmitting}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {!showThankYou ? (
                            <div className="p-6 pt-0">
                                {mode === "pay_only" ? (
                                    <div className="space-y-4">
                                        {error && (
                                            <div className="mb-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                                <p className="text-red-400 text-sm">
                                                    {error}
                                                </p>
                                            </div>
                                        )}

                                        <div className="bg-white/10 border border-purple-500/20 rounded-xl p-4">
                                            <p className="text-white font-semibold">
                                                Pay ₹199
                                            </p>
                                            <p className="text-purple-300/80 text-sm mt-1">
                                                Click Pay Now to open Razorpay
                                                checkout.
                                            </p>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={handleClose}
                                                disabled={isPaying}
                                                className="flex-1 bg-white/10 border-purple-500/30 text-purple-300 hover:bg-white/20 hover:text-white transition-all duration-300">
                                                Cancel
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={handlePayNow}
                                                disabled={isPaying}
                                                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium transition-all duration-300 transform hover:scale-105">
                                                {isPaying ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Opening...
                                                    </>
                                                ) : (
                                                    "Pay Now"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Error Message */}
                                        {error && (
                                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                                <p className="text-red-400 text-sm">
                                                    {error}
                                                </p>
                                            </div>
                                        )}

                                        <Form {...form}>
                                            <form
                                                onSubmit={form.handleSubmit(
                                                    onSubmit,
                                                )}
                                                className="space-y-5">
                                                <FormField
                                                    control={form.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-purple-300 text-sm font-medium flex items-center gap-2">
                                                                <User className="w-4 h-4" />
                                                                Full Name
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Enter your full name"
                                                                    {...field}
                                                                    data-testid="input-name"
                                                                    className="bg-white/10 border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-400 focus:ring-purple-400/20"
                                                                />
                                                            </FormControl>
                                                            <FormMessage className="text-red-400" />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-purple-300 text-sm font-medium flex items-center gap-2">
                                                                <Mail className="w-4 h-4" />
                                                                Email Address
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="email"
                                                                    placeholder="your.email@example.com"
                                                                    {...field}
                                                                    data-testid="input-email"
                                                                    className="bg-white/10 border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-400 focus:ring-purple-400/20"
                                                                />
                                                            </FormControl>
                                                            <FormMessage className="text-red-400" />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="mobile"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-purple-300 text-sm font-medium flex items-center gap-2">
                                                                <Phone className="w-4 h-4" />
                                                                Mobile Number
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="tel"
                                                                    placeholder="+91 98765 43210"
                                                                    {...field}
                                                                    data-testid="input-mobile"
                                                                    className="bg-white/10 border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-400 focus:ring-purple-400/20"
                                                                />
                                                            </FormControl>
                                                            <FormMessage className="text-red-400" />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="companyName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-purple-300 text-sm font-medium flex items-center gap-2">
                                                                <Building2 className="w-4 h-4" />
                                                                Company Name
                                                                <span className="text-purple-400/60 text-xs">
                                                                    (Optional)
                                                                </span>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Your company name"
                                                                    {...field}
                                                                    data-testid="input-company"
                                                                    className="bg-white/10 border-purple-500/30 text-white placeholder-purple-300/50 focus:border-purple-400 focus:ring-purple-400/20"
                                                                />
                                                            </FormControl>
                                                            <FormMessage className="text-red-400" />
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="pt-2">
                                                    <p className="text-purple-300 text-sm font-medium mb-2">
                                                        Choose program
                                                    </p>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() =>
                                                                setSelectedProgram(
                                                                    "workshop",
                                                                )
                                                            }
                                                            disabled={
                                                                isSubmitting ||
                                                                isPaying
                                                            }
                                                            className={`bg-white/10 border-purple-500/30 text-purple-200 hover:bg-white/20 ${
                                                                selectedProgram ===
                                                                "workshop"
                                                                    ? "ring-2 ring-purple-400/40"
                                                                    : ""
                                                            }`}>
                                                            Free Workshop
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() =>
                                                                setSelectedProgram(
                                                                    "internship",
                                                                )
                                                            }
                                                            disabled={
                                                                isSubmitting ||
                                                                isPaying
                                                            }
                                                            className={`bg-white/10 border-purple-500/30 text-purple-200 hover:bg-white/20 ${
                                                                selectedProgram ===
                                                                "internship"
                                                                    ? "ring-2 ring-purple-400/40"
                                                                    : ""
                                                            }`}>
                                                            Internship (₹499)
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() =>
                                                                setSelectedProgram(
                                                                    "master",
                                                                )
                                                            }
                                                            disabled={
                                                                isSubmitting ||
                                                                isPaying
                                                            }
                                                            className={`bg-white/10 border-purple-500/30 text-purple-200 hover:bg-white/20 ${
                                                                selectedProgram ===
                                                                "master"
                                                                    ? "ring-2 ring-purple-400/40"
                                                                    : ""
                                                            }`}>
                                                            Master Course
                                                            (₹1999)
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-3 pt-4">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={handleClose}
                                                        disabled={
                                                            isSubmitting ||
                                                            isPaying
                                                        }
                                                        className="flex-1 bg-white/10 border-purple-500/30 text-purple-300 hover:bg-white/20 hover:text-white transition-all duration-300">
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={handlePayNow}
                                                        disabled={
                                                            isSubmitting ||
                                                            isPaying
                                                        }
                                                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium transition-all duration-300 transform hover:scale-105">
                                                        {isPaying ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                Opening...
                                                            </>
                                                        ) : (
                                                            "Pay Now"
                                                        )}
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all duration-300 transform hover:scale-105">
                                                        {isSubmitting ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                Submitting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Sparkles className="w-4 h-4 mr-2" />
                                                                Register Now
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </form>
                                        </Form>

                                        {/* Footer Note */}
                                        <div className="mt-6 text-center">
                                            <p className="text-purple-300/60 text-xs">
                                                By registering, you'll receive a
                                                WhatsApp message with next steps
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            /* Thank You Screen */
                            <div className="p-8 text-center">
                                <div className="mb-6">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center animate-pulse">
                                        <CheckCircle className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        Registration Successful! 🎉
                                    </h3>
                                    <p className="text-purple-300 mb-6">
                                        Thank you for joining TechAra Academy!
                                        We're excited to have you on board.
                                    </p>

                                    <div className="bg-white/10 border border-purple-500/20 rounded-xl p-4 mb-6">
                                        <div className="flex items-center justify-center gap-2 text-purple-300">
                                            <MessageCircle className="w-5 h-5" />
                                            <span className="text-sm">
                                                Choose your next step
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <p className="text-red-400 text-sm">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-2 mb-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setSelectedProgram("workshop")
                                        }
                                        disabled={isPaying}
                                        className={`bg-white/10 border-purple-500/30 text-purple-200 hover:bg-white/20 ${
                                            selectedProgram === "workshop"
                                                ? "ring-2 ring-purple-400/40"
                                                : ""
                                        }`}>
                                        Free Workshop
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setSelectedProgram("internship")
                                        }
                                        disabled={isPaying}
                                        className={`bg-white/10 border-purple-500/30 text-purple-200 hover:bg-white/20 ${
                                            selectedProgram === "internship"
                                                ? "ring-2 ring-purple-400/40"
                                                : ""
                                        }`}>
                                        Internship (₹499)
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setSelectedProgram("master")
                                        }
                                        disabled={isPaying}
                                        className={`bg-white/10 border-purple-500/30 text-purple-200 hover:bg-white/20 ${
                                            selectedProgram === "master"
                                                ? "ring-2 ring-purple-400/40"
                                                : ""
                                        }`}>
                                        Master Course (₹1999)
                                    </Button>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Button
                                        type="button"
                                        onClick={handlePayNow}
                                        disabled={isPaying}
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium transition-all duration-300">
                                        {isPaying ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Opening payment...
                                            </>
                                        ) : (
                                            "Pay Now"
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={openWhatsApp}
                                        disabled={isPaying}
                                        className="bg-white/10 border-purple-500/30 text-purple-200 hover:bg-white/20">
                                        Message on WhatsApp
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleClose}
                                        disabled={isPaying}
                                        className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-medium transition-all duration-300">
                                        Close
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
