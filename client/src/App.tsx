import { Route, Router, Switch } from "wouter";
import { lazy, Suspense } from "react";
import React from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BubbleAnimation from "@/components/BubbleAnimation";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { usePageReady } from "@/hooks/usePageReady";

const Home = lazy(() => import("@/pages/home"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Enrollment = lazy(() => import("@/pages/enrollment"));
const Academy = lazy(() => import("@/pages/academy"));
const ProtectedDashboard = lazy(() => import("@/components/ProtectedDashboard"));

// Lightweight Loading Component - Optimized for performance
const LoadingSpinner = () => {
    const isReady = usePageReady();

    if (isReady) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-900/30 to-slate-950 z-50">
            <div className="flex flex-col items-center justify-center p-8">
                {/* Logo Circle with Icon */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="relative mb-12 w-28 h-28 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center shadow-2xl">
                    <BookOpen className="w-14 h-14 text-white" />
                </motion.div>

                {/* Text Content */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white mb-3">
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                            TechARA
                        </span>
                    </h1>
                    <p className="text-gray-300 text-base font-medium">
                        Loading your experience...
                    </p>
                </div>

                {/* Animated Dots */}
                <div className="flex gap-3 justify-center">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ y: [0, -12, 0] }}
                            transition={{
                                duration: 0.8,
                                delay: i * 0.15,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-3 h-3 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full shadow-lg"
                        />
                    ))}
                </div>

                {/* Progress Text */}
                <p className="text-xs text-gray-500 mt-10 tracking-wider uppercase">
                    Preparing everything...
                </p>
            </div>
        </div>
    );
};

function AppRouter() {
    return (
        <Router base="/">
            <Suspense fallback={<LoadingSpinner />}>
                <Switch>
                    <Route path="/" component={Home} />
                    <Route path="/enrollment" component={Enrollment} />
                    <Route path="/academy" component={Academy} />
                    <Route path="/dashboard" component={ProtectedDashboard} />
                    <Route path="*" component={NotFound} />
                </Switch>
            </Suspense>
        </Router>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <div className="relative">
                    <LoadingSpinner />
                    <BubbleAnimation />
                    <div className="relative z-10">
                        <Toaster />
                        <AppRouter />
                        {/* <ProtectedDashboard /> */}
                    </div>
                </div>
            </TooltipProvider>
        </QueryClientProvider>
    );
}

export default App;
