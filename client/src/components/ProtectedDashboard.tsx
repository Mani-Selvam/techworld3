// client/src/components/ProtectedDashboard.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut, RefreshCw, AlertCircle } from "lucide-react";
import Dashboard from "./Dashboard";
import Login from "./Login";

export default function ProtectedDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = () => {
            console.log("Checking authentication...");
            const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
            const loginTime = localStorage.getItem("loginTime");

            console.log("isLoggedIn:", isLoggedIn);
            console.log("loginTime:", loginTime);

            if (isLoggedIn === "true" && loginTime) {
                const loginDate = new Date(loginTime);
                const now = new Date();
                const hoursDiff =
                    (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

                console.log("hoursDiff:", hoursDiff);

                // Auto-logout after 24 hours
                if (hoursDiff < 24) {
                    console.log("User is authenticated");
                    setIsAuthenticated(true);
                } else {
                    console.log("Session expired, logging out");
                    handleLogout();
                }
            } else {
                console.log("User not authenticated");
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogin = (success: boolean) => {
        console.log("handleLogin called with:", success);
        setIsAuthenticated(success);
    };

    const handleLogout = () => {
        console.log("Logging out...");
        localStorage.removeItem("isAdminLoggedIn");
        localStorage.removeItem("loginTime");
        setIsAuthenticated(false);
        window.location.replace("/");
    };

    // Show loading while checking auth
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    // Show login if not authenticated
    if (!isAuthenticated) {
        console.log("Rendering Login component with handleLogin prop");
        return <Login onLogin={handleLogin} />;
    }

    // Show dashboard if authenticated
    return (
        <div className="relative">
            {/* Logout Button */}
            <div className="fixed top-4 right-32 z-[100]">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    data-testid="button-logout"
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 backdrop-blur-sm rounded-lg text-red-300 hover:bg-red-500/30 transition-all shadow-lg">
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                </motion.button>
            </div>

            {/* Session Expiry Warning */}
            <SessionWarning onLogout={handleLogout} />

            {/* Dashboard */}
            <Dashboard />
        </div>
    );
}

// Session Warning Component
function SessionWarning({ onLogout }: { onLogout: () => void }) {
    const [showWarning, setShowWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const checkSession = () => {
            const loginTime = localStorage.getItem("loginTime");
            if (!loginTime) return;

            const loginDate = new Date(loginTime);
            const now = new Date();
            const hoursDiff =
                (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);
            const timeUntilExpiry = 24 - hoursDiff;

            if (timeUntilExpiry <= 1) {
                setShowWarning(true);
                const minutes = Math.floor((timeUntilExpiry * 60) % 60);
                setTimeLeft(`${minutes} minutes`);
            } else {
                setShowWarning(false);
            }
        };

        const interval = setInterval(checkSession, 60000); // Check every minute
        checkSession();

        return () => clearInterval(interval);
    }, []);

    if (!showWarning) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
            <div className="flex items-center space-x-3 px-6 py-3 bg-yellow-500/20 border border-yellow-500/30 backdrop-blur-sm rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-300 text-sm">
                    Session expires in {timeLeft}
                </span>
                <button
                    onClick={onLogout}
                    className="text-xs px-3 py-1 bg-yellow-500/30 rounded hover:bg-yellow-500/40 transition-colors">
                    Logout Now
                </button>
            </div>
        </motion.div>
    );
}
