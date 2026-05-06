// src/components/CountdownTimer.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Clock,
    Calendar,
    Users,
    Sparkles,
    Zap,
    // ✅ Removed unused ArrowRight import
} from "lucide-react";
import { GraduationCap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAnimationDefer } from "@/hooks/useAnimationDefer";

// ✅ Computed once at module level — no resize listener, no re-renders
const isMobileView = typeof window !== "undefined" && window.innerWidth < 768;

// ✅ Single source of truth — change this one constant to switch session day
// 5 = Friday, 6 = Saturday
const SESSION_DAY = 5; // Friday
const SESSION_HOUR = 19; // 7:00 PM
const SESSION_DURATION_MIN = 90;
const SESSION_DAY_LABEL = "Every Friday"; // shown in the UI card

const getNextSessionStart = (): Date => {
    const now = new Date();
    const day = now.getDay();

    // ✅ Fixed: correct formula — days until SESSION_DAY
    const daysUntil = (SESSION_DAY - day + 7) % 7;

    const sessionStart = new Date(now);
    sessionStart.setDate(now.getDate() + daysUntil);
    sessionStart.setHours(SESSION_HOUR, 0, 0, 0);

    const sessionEnd = new Date(sessionStart);
    sessionEnd.setMinutes(sessionStart.getMinutes() + SESSION_DURATION_MIN);

    // ✅ Fixed: if today is the session day but session already ended, go next week
    if (now >= sessionEnd) {
        sessionStart.setDate(sessionStart.getDate() + 7);
    }

    return sessionStart;
};

export default function CountdownTimer({
    onRegisterClick,
}: {
    onRegisterClick?: () => void;
}) {
    const animationsEnabled = useAnimationDefer(2000);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        // ✅ Fixed: targetDate computed once, updated cleanly inside interval
        let targetDate = getNextSessionStart();

        const timer = setInterval(() => {
            const now = Date.now();
            let distance = targetDate.getTime() - now;

            // Session passed → get next occurrence
            if (distance <= 0) {
                targetDate = getNextSessionStart();
                distance = targetDate.getTime() - now;
            }

            const safe = Math.max(distance, 0);
            setTimeLeft({
                days: Math.floor(safe / (1000 * 60 * 60 * 24)),
                hours: Math.floor(
                    (safe % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
                ),
                minutes: Math.floor((safe % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((safe % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const timeUnits = [
        {
            value: timeLeft.days,
            label: "Days",
            icon: Calendar,
            color: "from-purple-500 to-pink-500",
        },
        {
            value: timeLeft.hours,
            label: "Hours",
            icon: Clock,
            color: "from-blue-500 to-cyan-500",
        },
        {
            value: timeLeft.minutes,
            label: "Minutes",
            icon: Zap,
            color: "from-green-500 to-emerald-500",
        },
        {
            value: timeLeft.seconds,
            label: "Seconds",
            icon: Sparkles,
            color: "from-orange-500 to-red-500",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    return (
        <div className="relative mb-16">
            {/* Background effects — desktop only, no JS state needed */}
            {!isMobileView && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5" />
                </div>
            )}

            <div className="relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={animationsEnabled ? "hidden" : "visible"}
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}>
                    <motion.div
                        className="inline-flex items-center gap-2 bg-purple-500/10 backdrop-blur-sm border border-purple-500/30 rounded-full px-4 py-2 mb-6"
                        variants={itemVariants}>
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-300 text-sm font-medium">
                            Next Session
                        </span>
                    </motion.div>

                    <motion.h2
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                        variants={itemVariants}>
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                            Event Starts In
                        </span>
                    </motion.h2>

                    <motion.p
                        className="text-xl text-gray-300 max-w-2xl mx-auto"
                        variants={itemVariants}>
                        {/* ✅ Fixed: now uses SESSION_DAY_LABEL — consistent with timer logic */}
                        Join our exclusive Web3 workshop{" "}
                        {SESSION_DAY_LABEL.toLowerCase()} at 7:00 PM
                    </motion.p>
                </motion.div>

                {/* Countdown */}
                <motion.div
                    className="max-w-5xl mx-auto"
                    initial={animationsEnabled ? "hidden" : "visible"}
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}>
                    <div className="bg-gradient-to-br from-slate-900/80 via-purple-900/20 to-slate-900/80 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 md:p-12 shadow-2xl">
                        {/* Timer units */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                            {timeUnits.map((unit) => {
                                const IconComponent = unit.icon;
                                return (
                                    <motion.div
                                        key={unit.label}
                                        className="relative group"
                                        variants={itemVariants}
                                        whileHover={{
                                            scale: 1.05,
                                            transition: { duration: 0.2 },
                                        }}>
                                        <div
                                            className={`absolute -inset-1 bg-gradient-to-r ${unit.color} rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300`}
                                        />

                                        <div className="relative bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
                                            <div className="flex justify-center mb-3">
                                                {/* ✅ Fixed: p-2 on inner div, p-0.5 on gradient wrapper only */}
                                                <div
                                                    className={`rounded-lg bg-gradient-to-r ${unit.color} p-0.5`}>
                                                    <div className="bg-slate-900 rounded-lg p-2 flex items-center justify-center">
                                                        <IconComponent className="w-5 h-5 text-white" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div
                                                className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r ${unit.color} bg-clip-text text-transparent`}
                                                data-testid={`countdown-${unit.label.toLowerCase()}`}>
                                                {unit.value
                                                    .toString()
                                                    .padStart(2, "0")}
                                            </div>

                                            <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                                                {unit.label}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Event detail cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <motion.div
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
                                variants={itemVariants}>
                                <Calendar className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                                {/* ✅ Fixed: now driven by SESSION_DAY_LABEL constant */}
                                <div className="text-white font-semibold">
                                    {SESSION_DAY_LABEL}
                                </div>
                                <div className="text-gray-400 text-sm">
                                    Weekly Session
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
                                variants={itemVariants}>
                                <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                <div className="text-white font-semibold">
                                    19:00 – 20:30 IST
                                </div>
                                <div className="text-gray-400 text-sm">
                                    90 Minutes
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
                                variants={itemVariants}>
                                <Users className="w-6 h-6 text-green-400 mx-auto mb-2" />
                                <div className="text-white font-semibold">
                                    Limited Seats
                                </div>
                                <div className="text-gray-400 text-sm">
                                    First Come, First Serve
                                </div>
                            </motion.div>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col items-center space-y-4">
                            <Link href="/enrollment">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 sm:px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto max-w-xs mx-auto flex justify-center items-center"
                                    data-testid="button-enroll-now">
                                    <GraduationCap className="w-5 h-5 mr-2" />
                                    Enroll Now - Limited Seats
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Footer info */}
                <motion.div
                    className="mt-8 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.5 }}>
                    <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300 text-sm">
                            Join 500+ learners already benefiting from our Web3
                            courses
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
