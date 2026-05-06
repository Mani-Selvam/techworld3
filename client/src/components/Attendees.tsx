import {
    TrendingUp,
    BarChart3,
    Users,
    Code,
    Pickaxe,
    Settings,
    Rocket,
    MoreHorizontal,
    Sparkles,
    ArrowUp,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

// ─── Static data — outside component, never recreated ────────────────────────
const DEMOGRAPHICS = [
    {
        pct: 83,
        category: "Crypto traders",
        description: "Professional traders and investors",
        icon: BarChart3,
        grad: "from-purple-500 to-pink-500",
        stroke: "#a855f7",
    },
    {
        pct: 80,
        category: "Students",
        description: "University and college students",
        icon: Pickaxe,
        grad: "from-blue-500 to-cyan-500",
        stroke: "#3b82f6",
    },
    {
        pct: 70,
        category: "Developers",
        description: "Software developers and engineers",
        icon: Code,
        grad: "from-green-500 to-emerald-500",
        stroke: "#22c55e",
    },
    {
        pct: 67,
        category: "Investors/Funds",
        description: "Institutional and retail investors",
        icon: TrendingUp,
        grad: "from-orange-500 to-red-500",
        stroke: "#f97316",
    },
    {
        pct: 47,
        category: "Entrepreneurs",
        description: "Business owners and founders",
        icon: Users,
        grad: "from-indigo-500 to-purple-500",
        stroke: "#6366f1",
    },
    {
        pct: 24,
        category: "Startups",
        description: "Early-stage companies",
        icon: Rocket,
        grad: "from-pink-500 to-rose-500",
        stroke: "#ec4899",
    },
    {
        pct: 26,
        category: "Service providers",
        description: "Consultants and service companies",
        icon: Settings,
        grad: "from-cyan-500 to-blue-500",
        stroke: "#06b6d4",
    },
    {
        pct: 4,
        category: "Others",
        description: "Various other professionals",
        icon: MoreHorizontal,
        grad: "from-gray-500 to-slate-500",
        stroke: "#6b7280",
    },
] as const;

// SVG ring circumference for r=36: 2π×36 ≈ 226.2
const CIRC = 226.2;

// ─── Keyframes — injected once ────────────────────────────────────────────────
const KEYFRAMES = `
  @keyframes adFadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes adCardIn  { from{opacity:0;transform:translateY(28px) scale(.92)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes adRing    { from{stroke-dashoffset:var(--circ)} to{stroke-dashoffset:var(--offset)} }
`;
if (typeof document !== "undefined" && !document.getElementById("ad-kf")) {
    const s = document.createElement("style");
    s.id = "ad-kf";
    s.textContent = KEYFRAMES;
    document.head.appendChild(s);
}

// ─── Single card ──────────────────────────────────────────────────────────────
function DemoCard({
    demo,
    index,
    visible,
}: {
    demo: (typeof DEMOGRAPHICS)[number];
    index: number;
    visible: boolean;
}) {
    const Icon = demo.icon;
    const offset = CIRC - (demo.pct / 100) * CIRC;

    return (
        <div
            className="group relative"
            style={{
                animation: visible
                    ? `adCardIn 0.5s ease forwards ${index * 0.08}s`
                    : "none",
                opacity: visible ? undefined : 0,
            }}>
            {/* Glow border */}
            <div
                className={`absolute -inset-1 bg-gradient-to-r ${demo.grad} rounded-2xl blur opacity-25 group-hover:opacity-70 transition-opacity duration-300`}
            />

            {/* Card body */}
            <div className="relative h-full bg-slate-900/80 border border-white/10 rounded-2xl p-6 flex flex-col overflow-hidden">
                {/* Subtle gradient wash */}
                <div
                    className={`absolute inset-0 opacity-5 bg-gradient-to-br ${demo.grad} pointer-events-none`}
                />

                {/* Progress ring — CSS-animated stroke, correct SVG approach */}
                <div className="relative mb-4 flex justify-center">
                    <div className="relative w-20 h-20">
                        <svg
                            className="w-20 h-20 -rotate-90"
                            viewBox="0 0 80 80">
                            {/* Track */}
                            <circle
                                cx="40"
                                cy="40"
                                r="36"
                                fill="none"
                                stroke="#334155"
                                strokeWidth="4"
                            />
                            {/* Progress — CSS animation via custom props */}
                            <circle
                                cx="40"
                                cy="40"
                                r="36"
                                fill="none"
                                stroke={demo.stroke}
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray={CIRC}
                                style={{
                                    // CSS custom props for the keyframe
                                    ["--circ" as string]: `${CIRC}`,
                                    ["--offset" as string]: `${offset}`,
                                    strokeDashoffset: visible ? offset : CIRC,
                                    transition: visible
                                        ? `stroke-dashoffset 1s ease ${index * 0.08 + 0.2}s`
                                        : "none",
                                }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold text-white">
                                {demo.pct}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div
                        className={`bg-gradient-to-r ${demo.grad} p-0.5 rounded-xl`}>
                        <div className="bg-slate-900 rounded-xl p-3 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-white text-center mb-2">
                    {demo.category}
                </h3>
                <p className="text-gray-400 text-sm text-center mb-4 flex-grow">
                    {demo.description}
                </p>

                <div className="flex items-center justify-center text-green-400 text-sm">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span>Growing segment</span>
                </div>
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AttendeesDemographics() {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    obs.disconnect();
                }
            },
            { threshold: 0.1 },
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={ref} className="relative py-16">
            {/* Static ambient blobs */}
            <div
                className="absolute inset-0 overflow-hidden hidden md:block pointer-events-none"
                aria-hidden>
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply blur-3xl opacity-5" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply blur-3xl opacity-5" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
                {/* Title */}
                <div
                    className="text-center mb-16"
                    style={{
                        animation: visible
                            ? "adFadeUp 0.6s ease forwards"
                            : "none",
                        opacity: visible ? undefined : 0,
                    }}>
                    <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-300 text-sm font-medium">
                            Who Attends
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                            Our Community
                        </span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        A diverse group of professionals passionate about Web3
                        technology
                    </p>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {DEMOGRAPHICS.map((demo, i) => (
                        <DemoCard
                            key={demo.category}
                            demo={demo}
                            index={i}
                            visible={visible}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
