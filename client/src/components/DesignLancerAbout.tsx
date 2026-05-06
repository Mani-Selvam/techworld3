import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from "react";
import sindhura from "@assets/Tech.jpg";
import { ResponsiveMedia } from "./ResponsiveMedia";
import {
    Award,
    Users,
    Sparkles,
    TrendingUp,
    CheckCircle,
    Star,
} from "lucide-react";

// ─── Device detection (once, outside component) ──────────────────────────────
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

// ─── Static data (outside component — never recreated) ───────────────────────
const ROLES = [
    "Indian",
    "Entrepreneur",
    "Web3 Passionator",
    "Blockchain Speaker",
    "Crypto Consultant",
    "NFT Consultant",
    "Blockchain Developer",
];

type StatItem = { label: string; value: string; icon: React.ReactNode };

const STATS: StatItem[] = [
    {
        label: "Learners Mentored",
        value: "10000+",
        icon: <Users className="w-5 h-5 md:w-6 md:h-6" />,
    },
    {
        label: "Years in IT",
        value: "10+",
        icon: <Award className="w-5 h-5 md:w-6 md:h-6" />,
    },
    {
        label: "Fintech & Blockchain",
        value: "6+",
        icon: <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />,
    },
];

// Pre-compute particle positions once — Math.random() inside JSX re-runs every render
const PARTICLES = Array.from({ length: isMobile ? 0 : 12 }, (_, i) => ({
    id: i,
    left: `${(i * 8.3) % 100}%`,
    top: `${(i * 13.7) % 100}%`,
    delay: `${(i * 0.4) % 5}s`,
    duration: `${3 + (i % 4)}s`,
}));

// ─── Inject keyframes once into <head> ───────────────────────────────────────
const KEYFRAMES = `
  @keyframes aboutFadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes aboutFloatBadge { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
  @keyframes aboutPulse    { 0%,100% { opacity:.3; } 50% { opacity:.6; } }
  @keyframes aboutGradient { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
`;
if (typeof document !== "undefined" && !document.getElementById("about-kf")) {
    const s = document.createElement("style");
    s.id = "about-kf";
    s.textContent = KEYFRAMES;
    document.head.appendChild(s);
}

// ─── Animated counter (viewport-aware, RAF-based) ────────────────────────────
function useCounter(target: number, duration: number, enabled: boolean) {
    const [value, setValue] = useState(0);
    const done = useRef(false);

    useEffect(() => {
        if (!enabled || done.current) return;
        done.current = true;

        if (isMobile) {
            setValue(target);
            return;
        }

        let start: number, raf: number;
        const tick = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            setValue(Math.floor(p * target));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [enabled, target, duration]);

    return value;
}

// ─── Single stat card ─────────────────────────────────────────────────────────
function StatCard({
    stat,
    index,
    visible,
}: {
    stat: StatItem;
    index: number;
    visible: boolean;
}) {
    const numeric = useMemo(
        () => parseInt(stat.value.match(/\d+/)?.[0] ?? "0"),
        [stat.value],
    );
    const suffix = useMemo(() => stat.value.replace(/\d+/, ""), [stat.value]);
    const count = useCounter(numeric, 1800 + index * 200, visible);

    return (
        <div
            className="text-center"
            style={{
                animation: visible
                    ? `aboutFadeUp 0.6s ease forwards ${index * 0.18}s`
                    : "none",
                opacity: visible ? undefined : 0,
            }}>
            <div className="p-3 md:p-6">
                <div className="flex justify-center mb-2 md:mb-4">
                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
                        <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-purple-400">
                            {stat.icon}
                        </div>
                    </div>
                </div>
                <div className="text-xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1 md:mb-2">
                    {count}
                    {count >= numeric ? suffix : ""}
                </div>
                <div className="text-gray-300 font-medium text-xs md:text-sm">
                    {stat.label}
                </div>
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AboutSection() {
    const [roleIndex, setRoleIndex] = useState(0);
    const [roleVisible, setRoleVisible] = useState(true);
    const [topVisible, setTopVisible] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);

    const topRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    // ── Role cycling — no setTimeout inside setInterval ──────────────────────
    useEffect(() => {
        const id = setInterval(() => {
            setRoleVisible(false);
            // Single nested timeout is unavoidable for fade-out; keep it minimal
            const t = setTimeout(() => {
                setRoleIndex((i) => (i + 1) % ROLES.length);
                setRoleVisible(true);
            }, 400);
            return () => clearTimeout(t);
        }, 3000);
        return () => clearInterval(id);
    }, []);

    // ── IntersectionObserver — one instance for both refs ─────────────────────
    useEffect(() => {
        const cb: IntersectionObserverCallback = (entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                if (e.target === topRef.current) setTopVisible(true);
                if (e.target === statsRef.current) setStatsVisible(true);
            });
        };
        const obs = new IntersectionObserver(cb, { threshold: 0.2 });
        if (topRef.current) obs.observe(topRef.current);
        if (statsRef.current) obs.observe(statsRef.current);
        return () => obs.disconnect();
    }, []);

    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white min-h-screen">
            {/* ── Static background (no mouse tracking, no JS parallax) ──────── */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                {/* Static orbs — CSS only, no JS state */}
                <div
                    className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/20 blur-3xl"
                    style={{ animation: "aboutPulse 6s ease-in-out infinite" }}
                />
                <div
                    className="absolute top-10 right-0 h-72 w-72 rounded-full bg-gradient-to-r from-indigo-500/30 to-blue-500/20 blur-3xl"
                    style={{
                        animation: "aboutPulse 6s ease-in-out infinite 1s",
                    }}
                />

                {/* Grid — CSS background, zero JS */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-50" />
            </div>

            {/* ── Top content section ──────────────────────────────────────────── */}
            <div
                ref={topRef}
                className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20"
                style={{
                    opacity: topVisible ? 1 : 0,
                    transform: topVisible ? "none" : "translateY(20px)",
                    transition: "opacity 0.8s ease, transform 0.8s ease",
                }}>
                {/* Section header */}
                <div
                    className="text-center mb-16"
                    style={{
                        animation: topVisible
                            ? "aboutFadeUp 0.6s ease forwards"
                            : "none",
                        opacity: topVisible ? undefined : 0,
                    }}>
                    <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-300 text-sm font-medium">
                            About Me
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span
                            className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
                            style={{
                                backgroundSize: "200% 200%",
                                animation: "aboutGradient 6s ease infinite",
                            }}>
                            Meet Your Mentor
                        </span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Transforming complex blockchain concepts into accessible
                        knowledge
                    </p>
                </div>

                {/* Two-column grid */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Image column */}
                    <div
                        className="order-1 lg:order-2"
                        style={{
                            animation: topVisible
                                ? "aboutFadeUp 0.8s ease forwards 0.2s"
                                : "none",
                            opacity: topVisible ? undefined : 0,
                        }}>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20" />
                            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30">
                                <ResponsiveMedia
                                    src={sindhura}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                                    loading="lazy"
                                    alt="Sindhu - Web3 Expert"
                                    className="w-full h-auto object-cover"
                                    data-testid="img-sindhu-about"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                            </div>

                            {/* Floating badges — CSS animation only, no framer-motion */}
                            <div
                                className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full shadow-lg"
                                style={{
                                    animation:
                                        "aboutFloatBadge 3s ease-in-out infinite",
                                }}>
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                                    <span className="font-semibold text-sm">
                                        Top Rated
                                    </span>
                                </div>
                            </div>
                            <div
                                className="absolute -bottom-4 -left-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg"
                                style={{
                                    animation:
                                        "aboutFloatBadge 3s ease-in-out infinite 1s",
                                }}>
                                <div className="flex items-center gap-2">
                                    <Award className="w-4 h-4" />
                                    <span className="font-semibold text-sm">
                                        Expert Certified
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Text column */}
                    <div
                        className="space-y-6 order-2 lg:order-1"
                        style={{
                            animation: topVisible
                                ? "aboutFadeUp 0.8s ease forwards 0.35s"
                                : "none",
                            opacity: topVisible ? undefined : 0,
                        }}>
                        {/* Cycling role */}
                        <div className="mb-6">
                            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2">
                                I Am An{" "}
                                <span
                                    className="inline-block min-h-[1.2em]"
                                    style={{
                                        background:
                                            "linear-gradient(to right, #ec4899, #8b5cf6)",
                                        WebkitBackgroundClip: "text",
                                        backgroundClip: "text",
                                        color: "transparent",
                                        opacity: roleVisible ? 1 : 0,
                                        transform: roleVisible
                                            ? "translateY(0)"
                                            : "translateY(-8px)",
                                        transition:
                                            "opacity 0.4s ease, transform 0.4s ease",
                                    }}>
                                    {ROLES[roleIndex]}
                                </span>
                            </h2>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-2 h-2 bg-pink-400 rounded-full"
                                    style={{
                                        animation:
                                            "aboutPulse 2s ease-in-out infinite",
                                    }}
                                />
                                <p className="text-lg text-gray-300">
                                    Empowering Minds. Elevating Futures.
                                    Building India's Web3 Generation.
                                </p>
                            </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-4">
                            <p className="text-gray-300 leading-relaxed">
                                I'm{" "}
                                <span className="text-purple-400 font-semibold">
                                    M. Sindhu Harisakthi
                                </span>{" "}
                                — Blockchain & Fintech Educator, Founder of{" "}
                                <span className="text-purple-400 font-semibold">
                                    Techara Academy
                                </span>
                                , and a lifelong believer in the power of
                                transformation through technology.
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                With over{" "}
                                <span className="text-purple-400 font-semibold">
                                    10 years in IT
                                </span>{" "}
                                and{" "}
                                <span className="text-purple-400 font-semibold">
                                    6+ years in Fintech & Blockchain education
                                </span>
                                , I help learners and entrepreneurs turn complex
                                technologies into simple, life-changing
                                opportunities. As an{" "}
                                <span className="text-purple-400 font-semibold">
                                    IIT Kanpur PG Blockchain Certified
                                </span>{" "}
                                and{" "}
                                <span className="text-purple-400 font-semibold">
                                    MSME-Certified Trainer
                                </span>
                                , I've mentored thousands to bridge the gap
                                between knowledge and innovation.
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                Passion drives me — to educate, empower, and
                                elevate India's Web3 generation. Through
                                Techara, I make Blockchain and Fintech education
                                accessible, practical, and transformational for
                                everyone — from students to entrepreneurs. The
                                future belongs to those who{" "}
                                <span className="text-purple-400 font-semibold">
                                    learn, unlearn, and lead with purpose
                                </span>
                                .
                            </p>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-3 pt-4">
                            {[
                                {
                                    color: "purple",
                                    label: "IIT Kanpur Certified",
                                },
                                { color: "pink", label: "MSME Trainer" },
                                {
                                    color: "indigo",
                                    label: "10+ Years Experience",
                                },
                            ].map(({ color, label }) => (
                                <div
                                    key={label}
                                    className={`flex items-center gap-2 bg-${color}-500/10 border border-${color}-500/30 rounded-full px-4 py-2`}>
                                    <CheckCircle
                                        className={`w-4 h-4 text-${color}-400`}
                                    />
                                    <span
                                        className={`text-sm text-${color}-300`}>
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stats section ────────────────────────────────────────────────── */}
            <div
                ref={statsRef}
                className="relative border-t border-white/10 bg-gradient-to-b from-transparent to-slate-950/50"
                style={{
                    opacity: statsVisible ? 1 : 0,
                    transform: statsVisible ? "none" : "translateY(20px)",
                    transition: "opacity 0.8s ease, transform 0.8s ease",
                }}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                                Impact & Achievements
                            </span>
                        </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-2 md:gap-8">
                        {STATS.map((stat, i) => (
                            <StatCard
                                key={stat.label}
                                stat={stat}
                                index={i}
                                visible={statsVisible}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Static particles (pre-computed, CSS only) ─────────────────── */}
            {PARTICLES.length > 0 && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    aria-hidden>
                    {PARTICLES.map((p) => (
                        <div
                            key={p.id}
                            className="absolute w-1 h-1 bg-white rounded-full"
                            style={{
                                left: p.left,
                                top: p.top,
                                opacity: 0.25,
                                animation: `aboutPulse ${p.duration} ease-in-out infinite ${p.delay}`,
                            }}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
