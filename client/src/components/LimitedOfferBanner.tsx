import { motion } from "framer-motion";
import { Zap, AlertCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import RegistrationPopup from "./RegistrationPopup";

interface LimitedOfferBannerProps {
    onCtaClick?: () => void;
}

export default function LimitedOfferBanner({
    onCtaClick,
}: LimitedOfferBannerProps) {
    const [blinkIntensity, setBlinkIntensity] = useState(1);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Get payment amounts from env
    const payAmountPaise = Number(
        import.meta.env.VITE_RAZORPAY_PAY_AMOUNT_PAISE,
    );
    const oldPayAmountPaise = Number(
        import.meta.env.VITE_RAZORPAY_PAY_OLD_AMOUNT_PAISE,
    );
    const safePayAmountPaise = Number.isFinite(payAmountPaise)
        ? payAmountPaise
        : 19900;
    const safeOldPayAmountPaise = Number.isFinite(oldPayAmountPaise)
        ? oldPayAmountPaise
        : 99900;

    // Blinking animation effect
    useEffect(() => {
        const interval = setInterval(() => {
            setBlinkIntensity((prev) => (prev === 1 ? 0.5 : 1));
        }, 600);
        return () => clearInterval(interval);
    }, []);

    const handlePayNowClick = () => {
        onCtaClick?.();
        setIsPopupOpen(true);
    };

    const closeRegistrationForm = () => {
        setIsPopupOpen(false);
    };

    return (
        <>
            <div className="relative w-full bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 overflow-hidden shadow-2xl">
                {/* Animated background shine effect */}
                <motion.div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background:
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    }}
                    animate={{ x: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Content wrapper */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 items-center">
                        {/* Left: Text Section */}
                        <div className="space-y-2">
                            {/* High Demand - Blinking */}
                            <motion.div
                                animate={{ opacity: blinkIntensity }}
                                transition={{ duration: 0.6 }}
                                className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-yellow-300 animate-pulse" />
                                <span className="text-base md:text-lg font-bold text-white uppercase tracking-wider">
                                    🔥 High Demand
                                </span>
                            </motion.div>

                            {/* Limited Offer - Large & Bold */}
                            <motion.h2
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="text-2xl md:text-4xl lg:text-5xl font-black text-white uppercase leading-tight drop-shadow-lg">
                                Limited
                                <br />
                                <span className="text-yellow-300">Offer</span>
                            </motion.h2>

                            {/* Secure your seat - Improved with icon */}
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="flex items-center gap-2 text-sm md:text-base text-white font-semibold">
                                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                                Secure your seat before slots close
                            </motion.div>
                        </div>

                        {/* Middle: Price Section */}
                        <div className="flex flex-col items-center justify-center space-y-3">
                            {/* Original Price - Crossed Out */}
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg md:text-2xl font-bold text-white/60 line-through">
                                        ₹999
                                    </span>
                                    <span className="bg-yellow-300 text-red-600 px-2 py-1 rounded-full text-xs md:text-sm font-bold">
                                        -80%
                                    </span>
                                </div>
                            </motion.div>

                            {/* Discount Price - Blinking & Large */}
                            <motion.div
                                animate={{
                                    opacity: blinkIntensity,
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    opacity: { duration: 0.6 },
                                    scale: { duration: 0.8, repeat: Infinity },
                                }}
                                className="text-center">
                                <p className="text-xs md:text-sm text-white/80 font-medium">
                                    Today's Price
                                </p>
                                <p className="text-5xl md:text-6xl lg:text-7xl font-black text-yellow-300 drop-shadow-lg">
                                    ₹199
                                </p>
                            </motion.div>

                            {/* Savings Amount */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}>
                                <p className="text-center text-xs md:text-sm text-yellow-200 font-bold">
                                    Save ₹800 on enrollment!
                                </p>
                            </motion.div>
                        </div>

                        {/* Right: CTA Button */}
                        <div className="flex flex-col items-center justify-center space-y-3">
                            {/* Main Button - Blinking glow */}
                            <motion.button
                                onClick={handlePayNowClick}
                                animate={{
                                    boxShadow: [
                                        "0 0 20px rgba(255, 193, 7, 0.4)",
                                        "0 0 40px rgba(255, 193, 7, 0.8)",
                                        "0 0 20px rgba(255, 193, 7, 0.4)",
                                    ],
                                }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative px-6 md:px-10 py-4 md:py-5 bg-gradient-to-r from-yellow-300 to-yellow-400 text-red-700 font-black text-lg md:text-2xl rounded-2xl md:rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 uppercase tracking-wider">
                                <div className="flex items-center justify-center gap-2">
                                    <Zap className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                                    <span>Pay Now</span>
                                    <Zap className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                                </div>

                                {/* Pulse ring effect */}
                                <motion.div
                                    animate={{
                                        boxShadow: [
                                            "0 0 0 0 rgba(255, 193, 7, 0.7)",
                                            "0 0 0 20px rgba(255, 193, 7, 0)",
                                        ],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                    }}
                                    className="absolute inset-0 rounded-2xl md:rounded-3xl"
                                />
                            </motion.button>

                            {/* Secondary text */}
                            <motion.p
                                animate={{ opacity: blinkIntensity }}
                                transition={{ duration: 0.6 }}
                                className="text-xs md:text-sm text-yellow-200 font-bold text-center">
                                Limited Slots • Only ₹199
                            </motion.p>

                            {/* Urgency badge */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [-5, 0, 5, 0],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="bg-yellow-300 text-red-700 px-4 py-2 rounded-full text-xs md:text-sm font-black uppercase">
                                ⏰ 99 Seats Left
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Bottom animated stripe */}
                <motion.div
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-50"
                />
            </div>

            {/* Registration Popup - Opens Razorpay */}
            <RegistrationPopup
                isOpen={isPopupOpen}
                onClose={closeRegistrationForm}
                mode="pay_only"
                payAmountPaise={safePayAmountPaise}
            />
        </>
    );
}
