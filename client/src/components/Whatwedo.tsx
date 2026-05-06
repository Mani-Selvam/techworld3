"use client";

import {
    GraduationCap,
    BookOpen,
    Briefcase,
    Building2,
    Globe,
    School,
    UserCheck,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Device detection — once, no resize listener ──────────────────────────────
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
const isTablet =
    typeof window !== "undefined" &&
    window.innerWidth >= 768 &&
    window.innerWidth < 1024;
const iconSize = isMobile ? 80 : isTablet ? 120 : 160;
const titleSize = isMobile ? "text-xl" : isTablet ? "text-2xl" : "text-3xl";
const descSize = isMobile ? "text-base" : isTablet ? "text-lg" : "text-xl";

// ─── Static course data ───────────────────────────────────────────────────────
const COURSES = [
    {
        title: "Master Blockchain Certification",
        description: "60-hour advanced hands-on program",
        icon: GraduationCap,
        colorKey: "indigo",
    },
    {
        title: "Blockchain & Fintech Education",
        description: "From basics to expert level",
        icon: BookOpen,
        colorKey: "pink",
    },
    {
        title: "Internships & Live Projects",
        description: "Real-world blockchain experience",
        icon: Briefcase,
        colorKey: "green",
    },
    {
        title: "Corporate & College Training",
        description: "Customized programs for institutions",
        icon: Building2,
        colorKey: "amber",
    },
    {
        title: "Web3 Awareness Programs",
        description: "Free workshops to spread knowledge",
        icon: Globe,
        colorKey: "indigo",
    },
    {
        title: "University Curriculum Development",
        description: "Full academic blockchain setup",
        icon: School,
        colorKey: "pink",
    },
    {
        title: "1-to-1 Mentorship",
        description: "Personalized career guidance",
        icon: UserCheck,
        colorKey: "green",
    },
] as const;

// ─── Color map — computed once, never recalculated ───────────────────────────
const COLOR_MAP: Record<
    string,
    { text: string; glow: string; ring: string; bar: string }
> = {
    indigo: {
        text: "text-indigo-400",
        glow: "rgba(99,102,241,.55)",
        ring: "border-indigo-400",
        bar: "from-indigo-500 to-purple-500",
    },
    pink: {
        text: "text-pink-400",
        glow: "rgba(236,72,153,.55)",
        ring: "border-pink-400",
        bar: "from-pink-500 to-rose-500",
    },
    green: {
        text: "text-green-400",
        glow: "rgba(34,197,94,.55)",
        ring: "border-green-400",
        bar: "from-green-500 to-emerald-500",
    },
    amber: {
        text: "text-amber-400",
        glow: "rgba(251,146,60,.55)",
        ring: "border-amber-400",
        bar: "from-amber-500 to-orange-500",
    },
};

// Pre-computed orbit angles for 8 particles — no Math.random() in render
const ORBIT_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

// Pre-computed floating dot positions (static, deterministic)
const FLOAT_DOTS = [
    { top: "20%", left: "10%", dur: "2.2s", delay: "0s" },
    { top: "30%", left: "80%", dur: "2.6s", delay: "0.3s" },
    { top: "60%", left: "15%", dur: "3.0s", delay: "0.6s" },
    { top: "70%", left: "75%", dur: "2.4s", delay: "0.9s" },
    { top: "45%", left: "90%", dur: "2.8s", delay: "0.4s" },
    { top: "80%", left: "40%", dur: "3.2s", delay: "0.2s" },
    { top: "25%", left: "55%", dur: "2.0s", delay: "0.7s" },
    { top: "55%", left: "30%", dur: "2.9s", delay: "1.0s" },
];

// Pre-computed background shapes (static positions)
const BG_SHAPES = !isMobile
    ? [
          { w: 60, h: 60, left: "8%", top: "15%", clip: 0, dur: "22s" },
          { w: 100, h: 100, left: "78%", top: "10%", clip: 1, dur: "28s" },
          { w: 50, h: 50, left: "45%", top: "70%", clip: 2, dur: "18s" },
          { w: 80, h: 80, left: "20%", top: "60%", clip: 0, dur: "25s" },
          { w: 70, h: 70, left: "85%", top: "55%", clip: 1, dur: "30s" },
          { w: 90, h: 90, left: "60%", top: "25%", clip: 2, dur: "20s" },
      ]
    : [];
const CLIPS = [
    "polygon(50% 0%,0% 100%,100% 100%)",
    "polygon(50% 0%,100% 50%,50% 100%,0% 50%)",
    "polygon(25% 0%,75% 0%,100% 50%,75% 100%,25% 100%,0% 50%)",
];

// ─── Keyframes injected once ──────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes ecGradient  { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes ecFadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ecFadeScale { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
  @keyframes ecOrbit     { from{transform:rotate(var(--a)) translateX(var(--r))} to{transform:rotate(calc(var(--a)+360deg)) translateX(var(--r))} }
  @keyframes ecIconRock  { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(4deg)} 75%{transform:rotate(-4deg)} }
  @keyframes ecRingGlow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ecPulseGlow { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:.8;transform:scale(1.2)} }
  @keyframes ecFloatDot  { 0%,100%{opacity:0;transform:translateY(0) scale(0)} 50%{opacity:.7;transform:translateY(-18px) scale(1)} }
  @keyframes ecShapeRot  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ecRadialPulse { 0%,100%{opacity:.04;transform:scale(1)} 50%{opacity:.1;transform:scale(1.1)} }
  @keyframes ecUnderline { from{transform:scaleX(0)} to{transform:scaleX(1)} }
`;
if (typeof document !== "undefined" && !document.getElementById("ec-kf")) {
    const s = document.createElement("style");
    s.id = "ec-kf";
    s.textContent = KEYFRAMES;
    document.head.appendChild(s);
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ExploreCourses() {
    const [activeIdx, setActiveIdx] = useState(0);
    const [fading, setFading] = useState(false);
    const touchStart = useRef<number | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const go = useCallback((next: number) => {
        setFading(true);
        setTimeout(() => {
            setActiveIdx(next);
            setFading(false);
        }, 280);
    }, []);

    const handlePrev = useCallback(() => {
        go((activeIdx - 1 + COURSES.length) % COURSES.length);
    }, [activeIdx, go]);

    const handleNext = useCallback(() => {
        go((activeIdx + 1) % COURSES.length);
    }, [activeIdx, go]);

    // ── Auto-rotate — stable interval, not recreated every index change ───────
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setActiveIdx((i) => (i + 1) % COURSES.length);
        }, 4000);
        return () => clearInterval(intervalRef.current!);
    }, []); // empty deps — never recreated

    // Touch swipe — refs instead of state (no re-renders on touch move)
    const onTouchStart = (e: React.TouchEvent) => {
        touchStart.current = e.targetTouches[0].clientX;
    };
    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStart.current === null) return;
        const dist = touchStart.current - e.changedTouches[0].clientX;
        if (Math.abs(dist) > 50) dist > 0 ? handleNext() : handlePrev();
        touchStart.current = null;
    };

    const course = COURSES[activeIdx];
    const color = COLOR_MAP[course.colorKey];
    const Icon = course.icon;
    const orbitR = `${iconSize + 32}px`;

    return (
        <section
            className="py-20 bg-background relative overflow-hidden min-h-screen"
            style={{ height: "90vh" }}
            id="courses">
            {/* ── Static radial background glow — CSS only ──────────────────── */}
            {!isMobile && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    aria-hidden>
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `radial-gradient(circle at 50% 50%, ${color.glow} 0%, transparent 50%)`,
                            animation: "ecRadialPulse 6s ease-in-out infinite",
                        }}
                    />

                    {/* Pre-computed rotating shapes */}
                    {BG_SHAPES.map((s, i) => (
                        <div
                            key={i}
                            className="absolute border border-current opacity-10"
                            style={{
                                width: s.w,
                                height: s.h,
                                left: s.left,
                                top: s.top,
                                color: color.glow,
                                clipPath: CLIPS[s.clip],
                                animation: `ecShapeRot ${s.dur} linear infinite`,
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col">
                {/* Title */}
                <div
                    className="text-center mb-8 md:mb-12"
                    style={{ animation: "ecFadeUp 0.7s ease forwards" }}>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
                        <span
                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent inline-block"
                            style={{
                                backgroundSize: "300% 300%",
                                animation: "ecGradient 6s ease infinite",
                            }}>
                            What We Do
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Transforming Learners into Leaders of the Web3
                        Revolution.
                    </p>
                </div>

                {/* Course display */}
                <div
                    className="flex-grow flex items-center justify-center relative"
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}>
                    {/* Nav buttons — desktop/tablet only */}
                    {!isMobile && (
                        <>
                            <button
                                onClick={handlePrev}
                                className="absolute left-0 z-20 p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-0 z-20 p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}

                    {/* Content — CSS fade/scale transition on index change */}
                    <div
                        className="flex flex-col items-center justify-center text-center relative"
                        style={{
                            opacity: fading ? 0 : 1,
                            transform: fading ? "scale(.88)" : "scale(1)",
                            transition:
                                "opacity .28s ease, transform .28s ease",
                            animation: fading
                                ? "none"
                                : "ecFadeScale .35s ease",
                        }}>
                        {/* Orbiting particles — CSS @keyframes, no Framer Motion */}
                        {ORBIT_ANGLES.map((angle, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 rounded-full pointer-events-none"
                                style={{
                                    backgroundColor: color.glow,
                                    boxShadow: `0 0 8px ${color.glow}`,
                                    // CSS custom props drive the keyframe
                                    ["--a" as string]: `${angle}deg`,
                                    ["--r" as string]: orbitR,
                                    animation: `ecOrbit ${3 + i * 0.4}s linear infinite`,
                                    animationDelay: `${i * 0.18}s`,
                                }}
                            />
                        ))}

                        {/* Icon */}
                        <div
                            className="relative flex items-center justify-center mb-8 flex-shrink-0"
                            style={{
                                width: iconSize,
                                height: iconSize,
                                animation: "ecIconRock 4s ease-in-out infinite",
                            }}>
                            {/* Rotating conic glow ring */}
                            {!isMobile && (
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: `conic-gradient(from 0deg, transparent, ${color.glow}, transparent)`,
                                        filter: "blur(2px)",
                                        animation:
                                            "ecRingGlow 8s linear infinite",
                                    }}
                                />
                            )}
                            {/* Inner radial glow */}
                            <div
                                className="absolute inset-2 rounded-full"
                                style={{
                                    background: `radial-gradient(circle, ${color.glow}, transparent)`,
                                    filter: "blur(8px)",
                                    animation:
                                        "ecPulseGlow 2s ease-in-out infinite",
                                }}
                            />
                            <Icon
                                size={iconSize / 2}
                                className={`${color.text} relative z-10`}
                                style={{
                                    filter: `drop-shadow(0 0 16px ${color.glow})`,
                                }}
                            />
                        </div>

                        {/* Title + animated underline */}
                        <div className="relative mb-4">
                            <h3
                                className={`font-bold ${titleSize} ${color.text}`}
                                style={{
                                    textShadow: `0 0 18px ${color.glow}`,
                                }}>
                                {course.title}
                            </h3>
                            <div
                                className="absolute -bottom-2 left-0 right-0 h-0.5 origin-center"
                                style={{
                                    background: `linear-gradient(90deg, transparent, ${color.glow}, transparent)`,
                                    animation: "ecUnderline .8s ease .2s both",
                                }}
                            />
                        </div>

                        {/* Description */}
                        <p
                            className={`${descSize} text-muted-foreground max-w-2xl mt-4`}>
                            {course.description}
                        </p>

                        {/* Pre-computed floating dots */}
                        {FLOAT_DOTS.map((d, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 rounded-full pointer-events-none"
                                style={{
                                    backgroundColor: color.glow,
                                    top: d.top,
                                    left: d.left,
                                    animation: `ecFloatDot ${d.dur} ease-in-out infinite ${d.delay}`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Dot indicators */}
                <div className="flex justify-center mt-8 gap-2">
                    {COURSES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => go(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                i === activeIdx
                                    ? "bg-gradient-to-r " +
                                      color.bar +
                                      (isMobile ? " w-8" : " w-12")
                                    : "w-2 bg-gray-500/50"
                            }`}
                            aria-label={`Go to course ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
