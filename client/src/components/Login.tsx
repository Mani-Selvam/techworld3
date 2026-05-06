// client/src/components/Login.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";

interface LoginProps {
    onLogin?: (success: boolean) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Debug: Check if onLogin is received
    React.useEffect(() => {
        console.log("Login component - onLogin prop:", onLogin);
        console.log("Type of onLogin:", typeof onLogin);
    }, [onLogin]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Check if onLogin function exists
        if (!onLogin || typeof onLogin !== "function") {
            console.error("onLogin is not a function or not provided");
            setError("System error: Login callback not available");
            setIsLoading(false);
            return;
        }

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Check credentials (admin/admin123)
        if (
            credentials.username === "admin" &&
            credentials.password === "admin123"
        ) {
            // Store session in localStorage
            localStorage.setItem("isAdminLoggedIn", "true");
            localStorage.setItem("loginTime", new Date().toISOString());

            console.log("Login successful, calling onLogin(true)");

            // Call the onLogin prop function passed from parent
            try {
                onLogin(true);
            } catch (error) {
                console.error("Error calling onLogin:", error);
                setError("Login successful but failed to redirect");
                setIsLoading(false);
            }
        } else {
            setError("Invalid username or password");
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(""); // Clear error on input change
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center p-4">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-20 left-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                />
            </div>

            {/* Login Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 shadow-2xl">
                    {/* Logo/Header */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Admin Login
                        </h1>
                        <p className="text-gray-400">
                            Enter your credentials to access the dashboard
                        </p>
                    </motion.div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="username"
                                    value={credentials.username}
                                    onChange={handleChange}
                                    placeholder="Enter your username"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </motion.div>

                        {/* Password Field */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </motion.div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-400" />
                                <span className="text-red-400 text-sm">
                                    {error}
                                </span>
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        />
                                        <span>Signing in...</span>
                                    </div>
                                ) : (
                                    "Sign In"
                                )}
                            </button>
                        </motion.div>
                    </form>

                    {/* Demo Credentials */}
                </div>
            </motion.div>
        </div>
    );
}
