import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveMedia } from "@/components/ResponsiveMedia";
import { AcademyLabel } from "./AcademyLabel";

interface FloatingImage {
    src: string;
    alt: string;
    label: string;
    position: "top-right" | "top-left" | "bottom-left" | "bottom-right";
    size: { width: string; height: string };
    duration: number;
}

interface CarouselImage {
    src: string;
    label: string;
}

interface AcademyHeroGalleryProps {
    animationsEnabled: boolean;
    floatingImages: FloatingImage[];
    carouselImages: CarouselImage[];
    carouselIndex: number;
}

/**
 * Track whether viewport is below the `lg` breakpoint (1024px).
 * Used to switch the carousel between a horizontal slide (mobile/tablet,
 * where it's the only visible card) and a centered scale/fade (desktop,
 * where the floating cards surround it).
 */
function useIsCompactViewport(): boolean {
    const [isCompact, setIsCompact] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;
        return window.innerWidth < 1024;
    });

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 1023.98px)");
        const onChange = () => setIsCompact(mql.matches);
        onChange();
        mql.addEventListener?.("change", onChange);
        return () => mql.removeEventListener?.("change", onChange);
    }, []);

    return isCompact;
}

export function AcademyHeroGallery({
    animationsEnabled,
    floatingImages,
    carouselImages,
    carouselIndex,
}: AcademyHeroGalleryProps) {
    const isCompact = useIsCompactViewport();

    // Track the direction of the most recent index change so the slide
    // animation enters from the correct side (always left→right for auto-rotation).
    const prevIndexRef = useRef(carouselIndex);
    const [direction, setDirection] = useState<1 | -1>(1);
    useEffect(() => {
        const prev = prevIndexRef.current;
        if (carouselIndex !== prev) {
            const total = carouselImages.length;
            // wrap-aware direction: forward unless the user explicitly went back
            const forward = (carouselIndex - prev + total) % total <= total / 2;
            setDirection(forward ? 1 : -1);
            prevIndexRef.current = carouselIndex;
        }
    }, [carouselIndex, carouselImages.length]);
    const getPositionClasses = (position: string) => {
        const positions: Record<string, string> = {
            "top-right": "top-2 right-2",
            "top-left": "top-14 left-2",
            "bottom-left": "bottom-4 left-2",
            "bottom-right": "bottom-6 right-2",
        };
        return positions[position] || "";
    };

    // ✅ Fixed: safe fallback if parent passes out-of-range index
    const slide = carouselImages[carouselIndex] ?? carouselImages[0];

    return (
        <motion.div
            // ✅ Fixed: initial=false skips framer pipeline entirely when animations off
            initial={animationsEnabled ? { opacity: 0, x: 50 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={
                animationsEnabled
                    ? { duration: 0.8, delay: 0.3, ease: "easeOut" }
                    : { duration: 0 }
            }
            className="relative h-full min-h-96 lg:min-h-screen flex items-center justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg aspect-square">
                {/* ✅ Fixed: outer glow desktop-only + ease:"linear" for smooth constant rotation */}
                {animationsEnabled && (
                    <motion.div
                        className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-600/30 to-cyan-600/30 blur-xl hidden md:block"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                )}

                {/* Floating images — desktop only.
                    ✅ Render immediately so images appear on first paint.
                    The floating motion is gated on animationsEnabled, but the
                    images themselves are always present in the DOM. */}
                <div className="hidden md:block">
                    {floatingImages.map((img, idx) => (
                        <motion.div
                            key={idx}
                            className={`absolute ${getPositionClasses(img.position)} ${img.size.width} ${img.size.height} rounded-2xl overflow-hidden shadow-2xl border border-purple-500/20`}
                            animate={
                                animationsEnabled
                                    ? { y: [0, -15, 0], x: [0, 5, 0] }
                                    : undefined
                            }
                            transition={
                                animationsEnabled
                                    ? {
                                          duration: img.duration,
                                          repeat: Infinity,
                                          ease: "easeInOut",
                                      }
                                    : undefined
                            }>
                            <ResponsiveMedia
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-full object-cover"
                                // ✅ Above-the-fold hero images load eagerly
                                loading="eager"
                                fetchpriority="high"
                                decoding="async"
                            />
                            <AcademyLabel text={img.label} />
                        </motion.div>
                    ))}
                </div>

                {/* Center carousel */}
                {/* ✅ Fixed: added mode="wait" so exit and enter don't overlap */}
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={carouselIndex}
                        custom={direction}
                        className="absolute inset-0 flex items-center justify-center overflow-hidden"
                        initial={
                            animationsEnabled
                                ? isCompact
                                    ? { x: direction * 120, opacity: 0 }
                                    : { scale: 0.8, opacity: 0 }
                                : false
                        }
                        animate={{ x: 0, scale: 1, opacity: 1 }}
                        exit={
                            animationsEnabled
                                ? isCompact
                                    ? { x: direction * -120, opacity: 0 }
                                    : { scale: 0.8, opacity: 0 }
                                : undefined
                        }
                        transition={
                            animationsEnabled
                                ? isCompact
                                    ? {
                                          x: {
                                              duration: 0.55,
                                              ease: [0.4, 0, 0.2, 1],
                                          },
                                          opacity: { duration: 0.35 },
                                      }
                                    : { duration: 0.6, ease: "easeInOut" }
                                : { duration: 0 }
                        }>
                        <motion.div
                            className="w-40 sm:w-52 md:w-56 h-52 sm:h-64 md:h-72 rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/30 relative"
                            // ✅ Fixed: added repeat:Infinity so the pulse actually loops
                            animate={
                                animationsEnabled ? { scale: [1, 1.05, 1] } : {}
                            }
                            transition={
                                animationsEnabled
                                    ? {
                                          duration: 3.8,
                                          ease: "easeInOut",
                                          repeat: Infinity,
                                          repeatType: "mirror",
                                      }
                                    : {}
                            }>
                            <ResponsiveMedia
                                src={slide.src}
                                alt={slide.label}
                                className="w-full h-full object-cover"
                                // ✅ Hero carousel — every slide loads eagerly so
                                //    the next rotation never shows a blank tile
                                loading="eager"
                                fetchpriority="high"
                                decoding="async"
                            />
                            <AcademyLabel text={slide.label} />
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
