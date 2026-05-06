// client/src/components/Testimonials.tsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Person1 from "@assets/Review person 1.jpg";
import Person2 from "@assets/Review person 2.jpg";
import Person3 from "@assets/Review person 3.jpg";

// ✅ Computed ONCE at module load — never on every render
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

// ✅ Animation configs defined outside component — no re-creation on renders
const SLIDE_TRANSITION = isMobile
    ? { duration: 0 }
    : { duration: 0.4, ease: "easeOut" };

const CONTENT_TRANSITION = isMobile
    ? { duration: 0 }
    : { duration: 0.5, ease: "easeOut" };

const testimonials = [
    {
        id: 1,
        name: "Premnath S",
        position: "Lead Blockchain Developer",
        company: "TechCorp Solutions",
        avatar: Person1,
        rating: 5,
        content:
            "⭐ This is the best class I have attended! Everything you explained was so clear and easy to understand. 🙌 Thank you, mam!",
        highlight: "transformed my career",
        color: "from-purple-600 to-pink-600",
        colorVar: "#9333ea",
    },
    {
        id: 2,
        name: "GandhaMathi S",
        position: "Senior Crypto Analyst",
        company: "DeFi Labs",
        avatar: Person2,
        rating: 5,
        content:
            "🙌 Mam, you explained everything very humbly and clearly. ✅ The tasks were easy to handle, and you provided a lot of useful information. 📚 The sessions over the 5 days were very informative. We really appreciate your guidance. 🙏",
        highlight: "unmatched knowledge",
        color: "from-cyan-600 to-blue-600",
        colorVar: "#0891b2",
        featured: true,
    },
    {
        id: 3,
        name: "Sathiyasee M",
        position: "NFT Artist & Creator",
        company: "Creative Crypto",
        avatar: Person3,
        rating: 5,
        content:
            "🌟 You created a lot of awareness for us at the right time through this class. 🙌 I am very glad to be your student. Thank you so much, mam! 🙏",
        highlight: "opened up a whole new world",
        color: "from-amber-600 to-orange-600",
        colorVar: "#d97706",
    },
];

interface TestimonialSlideProps {
    testimonial: (typeof testimonials)[0];
}

// ✅ Stars rendered as static CSS — no 5× spring animations
const StarRating = ({ count }: { count: number }) => (
    <div className="flex justify-center lg:justify-start mb-3 md:mb-4 gap-0.5">
        {Array.from({ length: count }).map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
    </div>
);

const TestimonialSlide = ({ testimonial }: TestimonialSlideProps) => {
    const parts = useMemo(
        () => testimonial.content.split(testimonial.highlight),
        [testimonial],
    );

    return (
        <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Quote icon — static on mobile, animated on desktop */}
                {isMobile ? (
                    <div className="absolute top-4 left-4">
                        <Quote className="w-8 h-8 text-white opacity-20" />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, rotate: -180 }}
                        animate={{ opacity: 0.2, rotate: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="absolute top-10 left-10">
                        <Quote className="w-16 h-16 text-white" />
                    </motion.div>
                )}

                <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-12 items-center">
                    {/* Image section */}
                    <motion.div
                        initial={isMobile ? false : { opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, ...CONTENT_TRANSITION }}
                        className="relative w-full lg:w-1/2 h-[40vh] md:h-[45vh] lg:h-[55vh] flex items-center justify-center">
                        {/* Decorative blobs — hidden on mobile (pure CSS, no JS) */}
                        <div
                            className={`absolute -top-4 -right-4 md:-top-8 md:-right-8 w-16 h-16 md:w-32 md:h-32 bg-gradient-to-br ${testimonial.color} rounded-full blur-xl opacity-30 hidden md:block`}
                        />
                        <div
                            className={`absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 w-14 h-14 md:w-24 md:h-24 bg-gradient-to-br ${testimonial.color} rounded-full blur-lg opacity-20 hidden md:block`}
                        />

                        {/* ✅ Profile image — lazy load on non-active images */}
                        <div className="relative">
                            <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                width={400}
                                height={500}
                                loading="eager"
                                decoding="async"
                                className="h-[30vh] md:h-[35vh] lg:h-[45vh] w-auto rounded-2xl shadow-2xl object-cover"
                            />

                            {testimonial.featured && (
                                <div className="absolute -bottom-3 md:-bottom-4 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-2 py-1 md:px-4 md:py-2 shadow-xl flex items-center gap-1">
                                        <Star className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                        <span className="text-white font-bold text-xs md:text-sm">
                                            Featured
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Content section */}
                    <motion.div
                        initial={isMobile ? false : { opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, ...CONTENT_TRANSITION }}
                        className="w-full lg:w-1/2 flex flex-col justify-center h-[30vh] md:h-[35vh] lg:h-[45vh] text-center lg:text-left px-4">
                        {/* ✅ Stars — pure CSS, no framer springs */}
                        <StarRating count={testimonial.rating} />

                        {/* Testimonial text */}
                        <blockquote className="text-sm md:text-base lg:text-lg font-light text-white mb-3 md:mb-4 leading-relaxed">
                            {parts.map((part, i) => (
                                <span key={i}>
                                    {part}
                                    {i < parts.length - 1 && (
                                        <span
                                            className={`font-semibold text-transparent bg-clip-text bg-gradient-to-r ${testimonial.color}`}>
                                            {testimonial.highlight}
                                        </span>
                                    )}
                                </span>
                            ))}
                        </blockquote>

                        {/* Author */}
                        <div className="mb-3 md:mb-4">
                            <h3 className="text-base md:text-lg lg:text-xl font-bold text-white mb-1">
                                {testimonial.name}
                            </h3>
                        </div>

                        {/* ✅ Progress bar — pure CSS animation, no framer infinite loop */}
                        <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                                className={`h-full bg-gradient-to-r ${testimonial.color} rounded-full`}
                                style={{
                                    animation: "progressBar 6s linear forwards",
                                    animationPlayState: "running",
                                }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ✅ Extracted to reusable fn so handlePrev/Next can reset the timer
    const resetInterval = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 6000);
    };

    useEffect(() => {
        resetInterval();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? testimonials.length - 1 : prev - 1,
        );
        resetInterval();
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        resetInterval();
    };

    return (
        <>
            {/* ✅ CSS keyframe — defined once, reused by all slides */}
            <style>{`
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>

            <section className="relative h-[90vh] bg-black overflow-hidden">
                {/* Animated background — desktop only, no mobile cost */}
                <div className="absolute inset-0 overflow-hidden hidden md:block">
                    <motion.div
                        animate={{ x: [0, 50, 0], y: [0, -25, 0] }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute top-0 left-0 w-64 h-64 lg:w-96 lg:h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5"
                    />
                    <motion.div
                        animate={{ x: [0, -50, 0], y: [0, 25, 0] }}
                        transition={{
                            duration: 30,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute bottom-0 right-0 w-64 h-64 lg:w-96 lg:h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5"
                    />
                </div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10 text-center pt-6 md:pt-8 pb-2 md:pb-4 px-4">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
                        What Our{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            Students
                        </span>{" "}
                        Say
                    </h2>
                    <div className="w-16 md:w-20 lg:w-24 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
                </motion.div>

                {/* Slides — ✅ only ONE slide in DOM at a time */}
                <div className="relative h-[calc(90vh-12rem)] md:h-[calc(90vh-10rem)]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={SLIDE_TRANSITION}
                            className="absolute inset-0">
                            <TestimonialSlide
                                testimonial={testimonials[currentIndex]}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex flex-col items-center justify-center space-y-3 z-20 px-4">
                    <div className="flex items-center space-x-3 md:space-x-4">
                        <button
                            onClick={handlePrev}
                            aria-label="Previous testimonial"
                            className="p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors active:scale-95">
                            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </button>

                        <div className="flex space-x-1.5 md:space-x-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentIndex(index);
                                        resetInterval();
                                    }}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                    className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                                        index === currentIndex
                                            ? "w-6 md:w-8 bg-gradient-to-r from-purple-500 to-pink-500"
                                            : "w-1.5 md:w-2 bg-gray-600"
                                    }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            aria-label="Next testimonial"
                            className="p-2 md:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors active:scale-95">
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}
