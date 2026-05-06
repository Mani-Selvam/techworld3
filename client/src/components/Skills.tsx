"use client";

import {
    Cpu,
    Briefcase,
    GraduationCap,
    Code,
    Mic,
    BookOpen,
    Users,
    Megaphone,
    ClipboardCheck,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Device detection once ────────────────────────────────────────────────────
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

// ─── Static data ──────────────────────────────────────────────────────────────
const BENEFITS = [
    {
        name: "Blockchain Technology",
        description:
            "In-depth understanding of decentralized systems, consensus algorithms, and blockchain architecture.",
        icon: Cpu,
        color: "text-slate-400",
        bar: "bg-slate-400",
        value: 95,
    },
    {
        name: "Fintech Innovation",
        description:
            "Designing and implementing financial technology solutions powered by blockchain and automation.",
        icon: Briefcase,
        color: "text-orange-400",
        bar: "bg-orange-400",
        value: 90,
    },
    {
        name: "Crypto & Web3 Education",
        description:
            "Empowering students and entrepreneurs with real-world Web3, DeFi, and NFT knowledge.",
        icon: GraduationCap,
        color: "text-green-400",
        bar: "bg-green-400",
        value: 92,
    },
    {
        name: "Smart Contract Development",
        description:
            "Building secure and efficient smart contracts on Ethereum and EVM-compatible chains.",
        icon: Code,
        color: "text-purple-400",
        bar: "bg-purple-400",
        value: 85,
    },
    {
        name: "Public Speaking & Training",
        description:
            "Dynamic speaker experienced in simplifying complex blockchain concepts for diverse audiences.",
        icon: Mic,
        color: "text-red-400",
        bar: "bg-red-400",
        value: 98,
    },
    {
        name: "Curriculum Design & Mentorship",
        description:
            "Developing structured blockchain and fintech learning paths with continuous mentorship.",
        icon: BookOpen,
        color: "text-indigo-400",
        bar: "bg-indigo-400",
        value: 95,
    },
    {
        name: "Leadership & Team Building",
        description:
            "Leading multidisciplinary teams and fostering innovation in blockchain education and projects.",
        icon: Users,
        color: "text-yellow-400",
        bar: "bg-yellow-400",
        value: 93,
    },
    {
        name: "Digital Marketing for Web3",
        description:
            "Strategizing Web3 brand visibility through community building, social media, and token engagement.",
        icon: Megaphone,
        color: "text-pink-400",
        bar: "bg-pink-400",
        value: 88,
    },
    {
        name: "Project Management",
        description:
            "Managing blockchain-based projects from ideation to deployment with agile methodologies.",
        icon: ClipboardCheck,
        color: "text-teal-400",
        bar: "bg-teal-400",
        value: 90,
    },
    {
        name: "Women Empowerment in Tech",
        description:
            "Advocating inclusivity and empowering women to lead in blockchain and fintech domains.",
        icon: BookOpen,
        color: "text-rose-400",
        bar: "bg-rose-400",
        value: 100,
    },
] as const;

// Pre-computed particle positions — Math.random() in JSX re-runs every render
const PARTICLES = isMobile
    ? []
    : Array.from({ length: 12 }, (_, i) => ({
          id: i,
          left: `${(i * 8.33).toFixed(1)}%`,
          top: `${((i * 13.73) % 100).toFixed(1)}%`,
          delay: `${((i * 0.42) % 5).toFixed(2)}s`,
          duration: `${4 + (i % 4)}s`,
      }));

// Pre-computed line positions
const LINES = isMobile
    ? []
    : Array.from({ length: 8 }, (_, i) => ({
          id: i,
          width: `${60 + ((i * 7) % 40)}%`,
          left: `${(i * 12.5).toFixed(1)}%`,
          top: `${(i * 11.25).toFixed(1)}%`,
          rotate: `${i * 22.5}deg`,
          delay: `${((i * 0.6) % 5).toFixed(2)}s`,
          duration: `${5 + (i % 4)}s`,
      }));

// ─── Keyframes — injected once into <head> ────────────────────────────────────
const KEYFRAMES = `
  @keyframes bfGradient { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes bfFadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes bfSlideL   { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
  @keyframes bfSlideR   { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
  @keyframes bfPulse    { 0%,100%{opacity:.15} 50%{opacity:.45} }
  @keyframes bfLineFade { 0%,100%{opacity:0} 50%{opacity:.4} }
  @keyframes bfBar      { from{width:0} }
  @keyframes bfDotPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.4)} }
  @keyframes bfShake    { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(-5deg)} 75%{transform:rotate(5deg)} }
`;
if (typeof document !== "undefined" && !document.getElementById("bf-kf")) {
    const s = document.createElement("style");
    s.id = "bf-kf";
    s.textContent = KEYFRAMES;
    document.head.appendChild(s);
}

// ─── Progress bar — CSS width animation, triggered by IntersectionObserver ───
function ProgressBar({
    value,
    barColor,
    visible,
    delay,
}: {
    value: number;
    barColor: string;
    visible: boolean;
    delay: string;
}) {
    return (
        <div className="w-full h-2 md:h-2.5 bg-gray-700 rounded-full overflow-hidden">
            <div
                className={`h-full ${barColor} rounded-full`}
                style={{
                    width: visible ? `${value}%` : "0%",
                    transition: visible ? `width 1s ease ${delay}` : "none",
                }}
            />
        </div>
    );
}

// ─── Single skill card ────────────────────────────────────────────────────────
function SkillCard({
    benefit,
    index,
    isRight,
    sectionVisible,
    activeIndex,
}: {
    benefit: (typeof BENEFITS)[number];
    index: number;
    isRight: boolean;
    sectionVisible: boolean;
    activeIndex: number;
}) {
    const Icon = benefit.icon;
    const isActive = activeIndex === index;
    const animDelay = `${index * 0.08}s`;

    return (
        <div
            className={`relative ${isRight ? "md:pl-0 md:pr-16" : "md:pr-0 md:pl-16"}`}
            style={{
                animation: sectionVisible
                    ? `${isRight ? "bfSlideR" : "bfSlideL"} 0.5s ease forwards ${animDelay}`
                    : "none",
                opacity: sectionVisible ? undefined : 0,
            }}>
            {/* Timeline dot */}
            <div
                className={`
                    absolute hidden md:block
                    ${isRight ? "right-6" : "left-6"}
                    w-5 h-5 rounded-full border-2 z-10 bg-background
                    ${isActive ? "border-primary" : "border-border"}
                `}
                style={{
                    animation: isActive
                        ? "bfDotPulse 1.5s ease-in-out infinite"
                        : "none",
                    backgroundColor: isActive
                        ? "rgba(var(--primary-rgb, 139,92,246),.15)"
                        : undefined,
                }}
            />

            {/* Mobile dot */}
            <div
                className={`absolute left-6 w-4 h-4 rounded-full border-2 z-10 md:hidden ${isActive ? "border-primary" : "border-border"}`}
            />

            {/* Card content */}
            <div className={`ml-16 md:ml-0 ${isRight ? "md:text-right" : ""}`}>
                {/* Icon + name row */}
                <div
                    className={`flex ${isRight ? "md:justify-end" : ""} items-center mb-3`}>
                    <div
                        className={`
                            w-10 h-10 md:w-14 md:h-14 rounded-full bg-secondary/30 flex items-center justify-center flex-shrink-0
                            ${isRight ? "md:order-2 md:ml-3" : "md:mr-3"} mr-3
                            ${isActive ? "ring-2 ring-primary/50" : ""}
                        `}
                        style={{
                            animation: isActive
                                ? "bfShake 0.5s ease-in-out infinite"
                                : "none",
                        }}>
                        <Icon
                            className={`w-5 h-5 md:w-7 md:h-7 ${benefit.color}`}
                        />
                    </div>
                    <h3
                        className={`text-sm md:text-lg font-semibold ${benefit.color}`}>
                        {benefit.name}
                    </h3>
                </div>

                {/* Progress bar */}
                <div
                    className={`mb-3 ${isRight ? "md:ml-auto md:max-w-md" : ""}`}>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs md:text-sm text-muted-foreground">
                            Proficiency
                        </span>
                        <span
                            className={`text-xs md:text-sm font-bold ${benefit.color}`}>
                            {benefit.value}%
                        </span>
                    </div>
                    <ProgressBar
                        value={benefit.value}
                        barColor={benefit.bar}
                        visible={sectionVisible}
                        delay={animDelay}
                    />
                </div>

                {/* Description — shown when active, CSS transition only */}
                <div
                    className={`text-xs md:text-sm text-muted-foreground overflow-hidden ${isRight ? "md:ml-auto md:max-w-md" : ""}`}
                    style={{
                        maxHeight: isActive ? "80px" : "0px",
                        opacity: isActive ? 1 : 0,
                        transition: "max-height 0.35s ease, opacity 0.3s ease",
                    }}>
                    {benefit.description.substring(0, isMobile ? 80 : 150)}…
                </div>
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Benefits() {
    const [sectionVisible, setSectionVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const sectionRef = useRef<HTMLDivElement>(null);
    const sequenceRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const restartRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Auto-highlight sequence using a single interval ───────────────────────
    const startSequence = useCallback(() => {
        let i = 0;
        sequenceRef.current = setInterval(() => {
            setActiveIndex(i % BENEFITS.length);
            i++;
            if (i >= BENEFITS.length) {
                clearInterval(sequenceRef.current!);
                sequenceRef.current = null;
                setActiveIndex(-1);
                // Restart after 15s
                restartRef.current = setTimeout(startSequence, 15_000);
            }
        }, 800);
    }, []);

    const stopSequence = useCallback(() => {
        if (sequenceRef.current) {
            clearInterval(sequenceRef.current);
            sequenceRef.current = null;
        }
        if (restartRef.current) {
            clearTimeout(restartRef.current);
            restartRef.current = null;
        }
        setActiveIndex(-1);
    }, []);

    // ── IntersectionObserver ──────────────────────────────────────────────────
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setSectionVisible(true);
                    startSequence();
                } else {
                    stopSequence();
                }
            },
            { threshold: 0.2 },
        );

        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => {
            obs.disconnect();
            stopSequence();
        };
    }, [startSequence, stopSequence]);

    return (
        <section
            ref={sectionRef}
            className="py-12 md:py-20 bg-background relative overflow-hidden"
            id="benefits">
            {/* Static gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

            {/* Static particles — pre-computed, CSS-only pulse */}
            {PARTICLES.map((p) => (
                <div
                    key={p.id}
                    className="absolute w-1 h-1 bg-primary/20 rounded-full pointer-events-none"
                    style={{
                        left: p.left,
                        top: p.top,
                        animation: `bfPulse ${p.duration} ease-in-out infinite ${p.delay}`,
                    }}
                />
            ))}

            {/* Static background lines — CSS-only fade */}
            {LINES.map((l) => (
                <div
                    key={l.id}
                    className="absolute h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent pointer-events-none"
                    style={{
                        width: l.width,
                        left: l.left,
                        top: l.top,
                        transform: `rotate(${l.rotate})`,
                        animation: `bfLineFade ${l.duration} ease-in-out infinite ${l.delay}`,
                    }}
                />
            ))}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Title */}
                <div
                    className="text-center mb-8 md:mb-16"
                    style={{
                        animation: sectionVisible
                            ? "bfFadeUp 0.7s ease forwards"
                            : "none",
                        opacity: sectionVisible ? undefined : 0,
                    }}>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
                        <span
                            className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent inline-block"
                            style={{
                                backgroundSize: "300% 300%",
                                animation: "bfGradient 6s ease infinite",
                            }}>
                            Skills
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                        Transform Skills into the Future — The Techara Way 🚀
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative px-4 md:px-8 py-8 md:py-12">
                    {/* Timeline vertical line */}
                    <div className="absolute left-8 md:left-16 top-0 bottom-0 w-0.5 md:w-1 bg-gradient-to-b from-primary/50 via-primary/20 to-accent/50" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {BENEFITS.map((benefit, index) => (
                            <SkillCard
                                key={benefit.name}
                                benefit={benefit}
                                index={index}
                                isRight={index % 2 === 1}
                                sectionVisible={sectionVisible}
                                activeIndex={activeIndex}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
