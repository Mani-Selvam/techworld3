import {
    Zap,
    Target,
    Briefcase,
    Code,
    Sparkles,
    ArrowRight,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

// ─── All static data outside component — never recreated on renders ───────────

const FEATURES = [
    {
        icon: <Zap className="w-8 h-8 text-white" />,
        title: "Core Highlights",
        description:
            "India's first all-in-one Web3 Academy with blockchain, crypto, NFT & coding under one roof. 70% practical training led by IIT & MSME-certified experts.",
        grad: "from-purple-500 to-pink-500",
        glow: "rgba(168,85,247,.4)",
    },
    {
        icon: <Target className="w-8 h-8 text-white" />,
        title: "Student-Centric",
        description:
            "Free weekly workshops, real-world project internships, master certifications, and 100% placement support with 1-to-1 mentorship.",
        grad: "from-blue-500 to-cyan-500",
        glow: "rgba(59,130,246,.4)",
    },
    {
        icon: <Briefcase className="w-8 h-8 text-white" />,
        title: "Industry Connect",
        description:
            "Corporate & college collaborations, expert trainers with 10+ years combined experience, and globally recognized certifications with internship letters.",
        grad: "from-green-500 to-emerald-500",
        glow: "rgba(34,197,94,.4)",
    },
    {
        icon: <Code className="w-8 h-8 text-white" />,
        title: "Learning Experience",
        description:
            "Hybrid online + offline classes, capstone projects, live blockchain demos, and an interactive peer community with gamified learning.",
        grad: "from-orange-500 to-red-500",
        glow: "rgba(249,115,22,.4)",
    },
] as const;

// SVG patterns — defined once, unique IDs to avoid cross-component conflicts
const BG_PATTERNS = [
    // dots
    <svg
        key="d"
        className="absolute inset-0 w-full h-full"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg">
        <pattern
            id="ft-dots"
            x="0"
            y="0"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse">
            <circle
                cx="10"
                cy="10"
                r="1"
                fill="currentColor"
                fillOpacity="0.1"
            />
        </pattern>
        <rect width="100%" height="100%" fill="url(#ft-dots)" />
    </svg>,
    // grid
    <svg
        key="g"
        className="absolute inset-0 w-full h-full"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg">
        <pattern
            id="ft-grid"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse">
            <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeOpacity="0.1"
            />
        </pattern>
        <rect width="100%" height="100%" fill="url(#ft-grid)" />
    </svg>,
    // zigzag
    <svg
        key="z"
        className="absolute inset-0 w-full h-full"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg">
        <pattern
            id="ft-zz"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse">
            <path
                d="M0,20 L10,10 L20,20 L30,10 L40,20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.1"
            />
        </pattern>
        <rect width="100%" height="100%" fill="url(#ft-zz)" />
    </svg>,
    // waves
    <svg
        key="w"
        className="absolute inset-0 w-full h-full"
        aria-hidden
        xmlns="http://www.w3.org/2000/svg">
        <pattern
            id="ft-waves"
            x="0"
            y="0"
            width="100"
            height="20"
            patternUnits="userSpaceOnUse">
            <path
                d="M0,10 Q25,0 50,10 T100,10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.1"
            />
        </pattern>
        <rect width="100%" height="100%" fill="url(#ft-waves)" />
    </svg>,
];

// ─── Keyframes — injected once ────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes ftFadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ftCardIn  { from{opacity:0;transform:translateY(50px) rotateY(-12deg)} to{opacity:1;transform:translateY(0) rotateY(0)} }
`;
if (typeof document !== "undefined" && !document.getElementById("ft-kf")) {
    const s = document.createElement("style");
    s.id = "ft-kf";
    s.textContent = KEYFRAMES;
    document.head.appendChild(s);
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({
    feature,
    index,
    visible,
}: {
    feature: (typeof FEATURES)[number];
    index: number;
    visible: boolean;
}) {
    return (
        <div
            className="relative group"
            style={{
                animation: visible
                    ? `ftCardIn 0.6s ease forwards ${index * 0.15}s`
                    : "none",
                opacity: visible ? undefined : 0,
            }}>
            {/* Glow border */}
            <div
                className={`absolute -inset-1 bg-gradient-to-r ${feature.grad} rounded-2xl blur opacity-25 group-hover:opacity-70 transition-opacity duration-300`}
            />

            {/* Card body */}
            <div className="relative h-full bg-slate-900/80 border border-white/10 rounded-2xl p-6 flex flex-col overflow-hidden">
                {/* SVG pattern */}
                <div className="absolute inset-0 text-white opacity-5 pointer-events-none">
                    {BG_PATTERNS[index]}
                </div>

                {/* Icon */}
                <div
                    className={`relative w-16 h-16 rounded-xl bg-gradient-to-r ${feature.grad} p-0.5 mb-6 flex-shrink-0`}>
                    <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center">
                        {feature.icon}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                    {feature.description}
                </p>
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Features() {
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    obs.disconnect();
                }
            },
            { threshold: 0.15 },
        );
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => obs.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="py-20 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 relative overflow-hidden"
            id="features">
            {/* Static ambient blobs — CSS pulse, no JS */}
            <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                aria-hidden>
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply blur-3xl opacity-10 animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply blur-3xl opacity-10 animate-pulse" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Title */}
                <div
                    className="text-center mb-16"
                    style={{
                        animation: visible
                            ? "ftFadeUp 0.6s ease forwards"
                            : "none",
                        opacity: visible ? undefined : 0,
                    }}>
                    <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-300 text-sm font-medium">
                            What Makes Us Special
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                            Academy Features
                        </span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Why learners choose our Web3 Academy
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {FEATURES.map((f, i) => (
                        <FeatureCard
                            key={f.title}
                            feature={f}
                            index={i}
                            visible={visible}
                        />
                    ))}
                </div>

                {/* CTA */}
                <div
                    className="mt-20 text-center"
                    style={{
                        animation: visible
                            ? "ftFadeUp 0.6s ease .5s forwards"
                            : "none",
                        opacity: visible ? undefined : 0,
                    }}>
                    <button
                        onClick={() =>
                            window.open("https://techara.in/", "_blank")
                        }
                        className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-6 py-3 hover:bg-white/20 transition-colors duration-200 cursor-pointer group active:scale-95">
                        <span className="text-white font-medium">
                            Explore all features
                        </span>
                        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                </div>
            </div>
        </section>
    );
}
