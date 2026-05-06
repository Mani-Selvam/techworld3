import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SectionBubbles from "@/components/SectionBubbles";
import { ScrollReveal } from "@/components/ScrollReveal";
import LimitedOfferBanner from "@/components/LimitedOfferBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ArrowLeft,
    GraduationCap,
    Users,
    Code,
    TrendingUp,
    Trophy,
    Briefcase,
    Rocket,
    Star,
    Target,
    Zap,
} from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEnrollmentSchema, type InsertEnrollment } from "../schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, getApiBase } from "@/lib/queryClient";
import { Link } from "wouter";

function EnrollmentPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 🌟 NEW: step state
    // 1=Personal, 2=Courses, 3=Preferences

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, []);

    const form = useForm<InsertEnrollment>({
        resolver: zodResolver(insertEnrollmentSchema),
        defaultValues: {
            fullName: "",
            mobile: "",
            email: "",
            city: "",
            ageGroup: undefined,
            currentRole: undefined,
            blockchainCoding: undefined,
            cryptoDefi: undefined,
            nftWeb3: undefined,
            preferredMode: undefined,
            preferredTiming: undefined,
            hearAboutUs: undefined,
            whyLearn: "",
        },
    });

    const enrollmentMutation = useMutation({
        mutationFn: async (data: InsertEnrollment) => {
            const response = await fetch(`${getApiBase()}/api/enroll`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Enrollment failed");
            }
            return response.json();
        },
        onSuccess: () => {
            toast({
                title: "Enrollment Successful!",
                description:
                    "Thank you for enrolling. We'll contact you soon with course details.",
            });
            form.reset();
            queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
            setStep(1); // reset to first step
        },
        onError: (error: any) => {
            toast({
                title: "Enrollment Failed",
                description:
                    error.message || "Something went wrong. Please try again.",
                variant: "destructive",
            });
        },
    });

    const onSubmit = async (data: InsertEnrollment) => {
        setIsSubmitting(true);
        try {
            await enrollmentMutation.mutateAsync(data);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 🌟 step navigation handlers
    const [step, setStep] = useState(1);

    const nextStep = () => setStep((s) => Math.min(s + 1, 3));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-foreground overflow-hidden scrollbar-none">
            <Navigation />

            {/* 🔥 Limited Offer Banner */}
            <LimitedOfferBanner onCtaClick={() => {}} />

            {/* Modern Enrollment Form Section */}
            <ScrollReveal variant="fade-up" duration={800} delay={300}>
                <section
                    className="py-12 md:py-20 lg:py-24 relative"
                    id="enrollment-form">
                    {/* Background Effects */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-20 left-10 w-32 h-32 md:w-64 md:h-64 rounded-full bg-gradient-to-r from-purple-500/10 to-transparent animate-spin-slow"></div>
                        <div className="absolute bottom-10 right-20 w-24 h-24 md:w-48 md:h-48 rounded-full bg-gradient-to-r from-cyan-500/10 to-transparent animate-pulse"></div>
                        <div className="absolute top-1/2 left-1/4 w-20 h-20 md:w-40 md:h-40 rounded-full bg-gradient-to-r from-pink-500/10 to-transparent animate-pulse"></div>
                    </div>

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="glass-card-strong rounded-3xl overflow-hidden modern-glow-purple shadow-2xl">
                            {/* Header Section */}
                            <div className="text-center p-8 md:p-12 bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-indigo-900/40 backdrop-blur-sm">
                                <div
                                    className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 neon-ring"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    }}>
                                    <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-white" />
                                </div>
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
                                    <span
                                        className="bg-clip-text text-transparent"
                                        style={{
                                            backgroundImage:
                                                "linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                                        }}>
                                        Secure Your Future Today
                                    </span>
                                </h2>
                                <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                                    Join the next generation of Web3 innovators.
                                    Limited seats available for our upcoming
                                    batch.
                                </p>
                            </div>

                            {/* Progress Indicator */}
                            <div className="px-6 md:px-8 pt-6 md:pt-8">
                                <div className="flex items-center justify-between mb-6 md:mb-8">
                                    <div className="flex items-center">
                                        <div
                                            className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                                                step >= 1
                                                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                                                    : "bg-gray-700"
                                            }`}>
                                            <span className="text-white text-sm md:text-base font-semibold">
                                                1
                                            </span>
                                        </div>
                                        <span
                                            className={`ml-2 md:ml-3 text-sm md:text-base font-medium ${
                                                step >= 1
                                                    ? "text-purple-300"
                                                    : "text-gray-500"
                                            }`}>
                                            Personal
                                        </span>
                                    </div>
                                    <div
                                        className={`flex-1 h-1 mx-2 md:mx-4 ${
                                            step >= 2
                                                ? "bg-gradient-to-r from-purple-600 to-pink-600"
                                                : "bg-gray-700"
                                        }`}></div>
                                    <div className="flex items-center">
                                        <div
                                            className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                                                step >= 2
                                                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                                                    : "bg-gray-700"
                                            }`}>
                                            <span className="text-white text-sm md:text-base font-semibold">
                                                2
                                            </span>
                                        </div>
                                        <span
                                            className={`ml-2 md:ml-3 text-sm md:text-base font-medium ${
                                                step >= 2
                                                    ? "text-purple-300"
                                                    : "text-gray-500"
                                            }`}>
                                            Courses
                                        </span>
                                    </div>
                                    <div
                                        className={`flex-1 h-1 mx-2 md:mx-4 ${
                                            step >= 3
                                                ? "bg-gradient-to-r from-purple-600 to-pink-600"
                                                : "bg-gray-700"
                                        }`}></div>
                                    <div className="flex items-center">
                                        <div
                                            className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                                                step >= 3
                                                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                                                    : "bg-gray-700"
                                            }`}>
                                            <span className="text-white text-sm md:text-base font-semibold">
                                                3
                                            </span>
                                        </div>
                                        <span
                                            className={`ml-2 md:ml-3 text-sm md:text-base font-medium ${
                                                step >= 3
                                                    ? "text-purple-300"
                                                    : "text-gray-500"
                                            }`}>
                                            Preferences
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 lg:p-12">
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-6 md:space-y-8">
                                        {/* =================== STEP 1 =================== */}
                                        {step === 1 && (
                                            <div className="space-y-4 md:space-y-6">
                                                <h3 className="text-lg md:text-xl font-semibold text-purple-300 flex items-center">
                                                    <Users className="w-5 h-5 mr-2" />
                                                    Personal Information
                                                </h3>

                                                {/* Full Name */}
                                                <FormField
                                                    control={form.control}
                                                    name="fullName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-gray-200 text-sm md:text-base">
                                                                Full Name *
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    placeholder="Enter your full name"
                                                                    className="
                                                                        bg-white/10 
                                                                        text-white 
                                                                        placeholder-gray-400 
                                                                        border border-white/20 
                                                                        rounded-lg 
                                                                        focus:border-purple-500 
                                                                        focus:ring-2 focus:ring-purple-500/50
                                                                        focus:bg-white/15
                                                                        transition-all duration-200
                                                                        py-3 px-4
                                                                    "
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Mobile & Email */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                    {/* Mobile */}
                                                    <FormField
                                                        control={form.control}
                                                        name="mobile"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-gray-200 text-sm md:text-base">
                                                                    Mobile
                                                                    Number
                                                                    (WhatsApp
                                                                    Preferred) *
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="+1 234 567 8900"
                                                                        data-testid="input-mobile"
                                                                        className="bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:bg-white/15 transition-all duration-200 py-3 px-4"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    {/* Email */}
                                                    <FormField
                                                        control={form.control}
                                                        name="email"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-gray-200 text-sm md:text-base">
                                                                    Email ID *
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        type="email"
                                                                        placeholder="your.email@example.com"
                                                                        data-testid="input-email"
                                                                        className="bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:bg-white/15 transition-all duration-200 py-3 px-4"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                {/* City & Age */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                    <FormField
                                                        control={form.control}
                                                        name="city"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-gray-200 text-sm md:text-base">
                                                                    City /
                                                                    Location *
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="Enter your city"
                                                                        data-testid="input-city"
                                                                        className="bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:bg-white/15 transition-all duration-200 py-3 px-4"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="ageGroup"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-gray-200 text-sm md:text-base">
                                                                    Age Group *
                                                                </FormLabel>
                                                                <Select
                                                                    onValueChange={
                                                                        field.onChange
                                                                    }
                                                                    defaultValue={
                                                                        field.value
                                                                    }>
                                                                    <FormControl>
                                                                        <SelectTrigger
                                                                            data-testid="select-agegroup"
                                                                            className="bg-white/10 text-white border border-white/20 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:bg-white/15 transition-all duration-200 py-3 px-4">
                                                                            <SelectValue placeholder="Select age group" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent className="bg-slate-800 border border-white/20">
                                                                        <SelectItem
                                                                            value="15-20"
                                                                            className="text-white hover:bg-purple-600/20">
                                                                            15-20
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="21-25"
                                                                            className="text-white hover:bg-purple-600/20">
                                                                            21-25
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="26-30"
                                                                            className="text-white hover:bg-purple-600/20">
                                                                            26-30
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="31+"
                                                                            className="text-white hover:bg-purple-600/20">
                                                                            31+
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                {/* Current Role */}
                                                <FormField
                                                    control={form.control}
                                                    name="currentRole"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-gray-200 text-sm md:text-base">
                                                                Current Role *
                                                            </FormLabel>
                                                            <Select
                                                                onValueChange={
                                                                    field.onChange
                                                                }
                                                                defaultValue={
                                                                    field.value
                                                                }>
                                                                <FormControl>
                                                                    <SelectTrigger
                                                                        data-testid="select-currentrole"
                                                                        className="bg-white/10 text-white border border-white/20 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:bg-white/15 transition-all duration-200 py-3 px-4">
                                                                        <SelectValue placeholder="Select your current role" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="bg-slate-800 border border-white/20">
                                                                    <SelectItem
                                                                        value="Student"
                                                                        className="text-white hover:bg-purple-600/20">
                                                                        Student
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value="Working Professional"
                                                                        className="text-white hover:bg-purple-600/20">
                                                                        Working
                                                                        Professional
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value="Business Owner"
                                                                        className="text-white hover:bg-purple-600/20">
                                                                        Business
                                                                        Owner
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value="Others"
                                                                        className="text-white hover:bg-purple-600/20">
                                                                        Others
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        )}

                                        {/* =================== STEP 2 =================== */}
                                        {step === 2 && (
                                            <div className="space-y-4 md:space-y-6">
                                                <h3 className="text-lg md:text-xl font-semibold text-purple-300 flex items-center">
                                                    <Code className="w-5 h-5 mr-2" />
                                                    Interested Courses
                                                </h3>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                                    {/* Blockchain */}
                                                    <FormField
                                                        control={form.control}
                                                        name="blockchainCoding"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-gray-200 text-sm md:text-base">
                                                                    Blockchain
                                                                    Coding
                                                                </FormLabel>
                                                                <Select
                                                                    onValueChange={
                                                                        field.onChange
                                                                    }
                                                                    defaultValue={
                                                                        field.value
                                                                    }>
                                                                    <FormControl>
                                                                        <SelectTrigger className="bg-white/10 text-white border border-white/20 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:bg-white/15 transition-all duration-200 py-3 px-4">
                                                                            <SelectValue placeholder="Select level" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent className="bg-slate-800 border border-white/20">
                                                                        <SelectItem
                                                                            value="Beginner"
                                                                            className="text-white hover:bg-purple-600/20">
                                                                            Beginner
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="Intermediate"
                                                                            className="text-white hover:bg-purple-600/20">
                                                                            Intermediate
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="Advanced"
                                                                            className="text-white hover:bg-purple-600/20">
                                                                            Advanced
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    {/* Crypto */}
                                                    <FormField
                                                        control={form.control}
                                                        name="cryptoDefi"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-gray-200 text-sm md:text-base">
                                                                    Crypto &
                                                                    DeFi
                                                                </FormLabel>
                                                                <Select
                                                                    onValueChange={
                                                                        field.onChange
                                                                    }
                                                                    defaultValue={
                                                                        field.value
                                                                    }>
                                                                    <FormControl>
                                                                        <SelectTrigger className="bg-white/10 text-white border border-white/20 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:bg-white/15 transition-all duration-200 py-3 px-4">
                                                                            <SelectValue placeholder="Select level" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent className="bg-slate-800 border border-white/20">
                                                                        <SelectItem
                                                                            value="Beginner"
                                                                            className="text-white hover:bg-purple-600/20">
                                                                            Beginner
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="Intermediate"
                                                                            className="text-white hover:bg-purple-600/20">
                                                                            Intermediate
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="Advanced"
                                                                            className="text-white hover:bg-purple-600/20">
                                                                            Advanced
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    {/* NFT */}
                                                    <FormField
                                                        control={form.control}
                                                        name="nftWeb3"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-gray-200 text-sm md:text-base">
                                                                    NFT & Web3
                                                                    Business
                                                                </FormLabel>
                                                                <Select
                                                                    onValueChange={
                                                                        field.onChange
                                                                    }
                                                                    defaultValue={
                                                                        field.value
                                                                    }>
                                                                    <FormControl>
                                                                        <SelectTrigger className="bg-white/10 text-white border border-white/20 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:bg-white/15 transition-all duration-200 py-3 px-4">
                                                                            <SelectValue placeholder="Select level" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent className="bg-slate-800 border border-white/20">
                                                                        <SelectItem
                                                                            value="Beginner"
                                                                            className="text-white hover:bg-purple-600/20">
                                                                            Beginner
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="Intermediate"
                                                                            className="text-white hover:bg-purple-600/20">
                                                                            Intermediate
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="Advanced"
                                                                            className="text-white hover:bg-purple-600/20">
                                                                            Advanced
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* =================== STEP 3 =================== */}
                                        {step === 3 && (
                                            <div className="space-y-4 md:space-y-6">
                                                <h3 className="text-lg md:text-xl font-semibold text-purple-300 flex items-center">
                                                    <Target className="w-5 h-5 mr-2" />
                                                    Preferences
                                                </h3>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                    <FormField
                                                        control={form.control}
                                                        name="preferredMode"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-gray-200 text-sm md:text-base">
                                                                    Preferred
                                                                    Mode *
                                                                </FormLabel>
                                                                <Select
                                                                    onValueChange={
                                                                        field.onChange
                                                                    }
                                                                    defaultValue={
                                                                        field.value
                                                                    }>
                                                                    <FormControl>
                                                                        <SelectTrigger className="bg-white/10 text-white border border-white/20 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:bg-white/15 transition-all duration-200 py-3 px-4">
                                                                            <SelectValue placeholder="Select mode" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent className="bg-slate-800 border border-white/20">
                                                                        <SelectItem
                                                                            value="Online"
                                                                            className="text-white hover:bg-purple-600/20">
                                                                            Online
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="Offline"
                                                                            className="text-white hover:bg-purple-600/20">
                                                                            Offline
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name="preferredTiming"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-gray-200 text-sm md:text-base">
                                                                    Preferred
                                                                    Batch Timing
                                                                    *
                                                                </FormLabel>
                                                                <Select
                                                                    onValueChange={
                                                                        field.onChange
                                                                    }
                                                                    defaultValue={
                                                                        field.value
                                                                    }>
                                                                    <FormControl>
                                                                        <SelectTrigger className="bg-white/10 text-white border border-white/20 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:bg-white/15 transition-all duration-200 py-3 px-4">
                                                                            <SelectValue placeholder="Select timing" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent className="bg-slate-800 border border-white/20">
                                                                        <SelectItem
                                                                            value="Morning"
                                                                            className="text-white hover:bg-purple-600/20">
                                                                            Morning
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="Afternoon"
                                                                            className="text-white hover:bg-purple-600/20">
                                                                            Afternoon
                                                                        </SelectItem>
                                                                        <SelectItem
                                                                            value="Evening"
                                                                            className="text-white hover:bg-purple-600/20">
                                                                            Evening
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name="hearAboutUs"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-gray-200 text-sm md:text-base">
                                                                How did you hear
                                                                about us? *
                                                            </FormLabel>
                                                            <Select
                                                                onValueChange={
                                                                    field.onChange
                                                                }
                                                                defaultValue={
                                                                    field.value
                                                                }>
                                                                <FormControl>
                                                                    <SelectTrigger className="bg-white/10 text-white border border-white/20 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:bg-white/15 transition-all duration-200 py-3 px-4">
                                                                        <SelectValue placeholder="Select source" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent className="bg-slate-800 border border-white/20">
                                                                    <SelectItem
                                                                        value="Instagram"
                                                                        className="text-white hover:bg-purple-600/20">
                                                                        Instagram
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value="WhatsApp"
                                                                        className="text-white hover:bg-purple-600/20">
                                                                        WhatsApp
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value="Friend"
                                                                        className="text-white hover:bg-purple-600/20">
                                                                        Friend
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value="College"
                                                                        className="text-white hover:bg-purple-600/20">
                                                                        College
                                                                    </SelectItem>
                                                                    <SelectItem
                                                                        value="Other"
                                                                        className="text-white hover:bg-purple-600/20">
                                                                        Other
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="whyLearn"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-gray-200 text-sm md:text-base">
                                                                Why do you want
                                                                to learn this? *
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    {...field}
                                                                    placeholder="Tell us about your motivation and goals..."
                                                                    data-testid="textarea-whylearn"
                                                                    className="bg-white/10 text-white placeholder-gray-400 border border-white/20 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 focus:bg-white/15 transition-all duration-200 min-h-24 py-3 px-4 resize-none"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        )}

                                        {/* ---- Navigation Buttons ---- */}
                                        <div className="flex justify-between pt-6 md:pt-8">
                                            {step > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={prevStep}
                                                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-200 py-2 px-4 md:py-3 md:px-6">
                                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                                    Back
                                                </Button>
                                            )}
                                            {step < 3 && (
                                                <Button
                                                    type="button"
                                                    className="ml-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 md:py-3 md:px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                                                    onClick={nextStep}>
                                                    Next
                                                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                                                </Button>
                                            )}
                                            {step === 3 && (
                                                <Button
                                                    type="submit"
                                                    className="ml-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center"
                                                    disabled={isSubmitting}
                                                    data-testid="button-submit">
                                                    {isSubmitting ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Enrolling...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Enroll Now - Secure
                                                            Your Spot
                                                            <Rocket className="w-4 h-4 ml-2" />
                                                        </>
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        </div>
                    </div>
                </section>
            </ScrollReveal>
            <Footer />
        </div>
    );
}
export default EnrollmentPage;
