import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import SectionBubbles from "@/components/SectionBubbles";

// Detect once outside component — zero re-render cost
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

// ─── Keyframes (injected once at module level, not per render) ──────────────
const KEYFRAMES = `
  @keyframes pulseText {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  @keyframes gradientMove {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;

// Inject once into <head> at module load — never re-injected on re-renders
if (typeof document !== "undefined" && !document.getElementById("stats-kf")) {
    const style = document.createElement("style");
    style.id = "stats-kf";
    style.textContent = KEYFRAMES;
    document.head.appendChild(style);
}

// ─── Counter — only animates when element enters viewport ───────────────────
interface CounterProps {
    end: number;
    duration: number;
    suffix: string;
    color: string;
    label: string;
    testId: string;
}

function Counter({
    end,
    duration,
    suffix,
    color,
    label,
    testId,
}: CounterProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const started = useRef(false);

    const runCounter = useCallback(() => {
        if (started.current) return;
        started.current = true;

        // On mobile, skip animation and jump straight to final value
        if (isMobile) {
            setCount(end);
            return;
        }

        let startTime: number;
        let raf: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                raf = requestAnimationFrame(animate);
            }
        };

        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, [end, duration]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    runCounter();
                    observer.disconnect(); // fire once only
                }
            },
            { threshold: 0.3 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [runCounter]);

    return (
        <div ref={ref} className="space-y-2">
            <h3
                className={`text-4xl md:text-5xl font-bold ${color}`}
                data-testid={testId}>
                {count}
                {suffix}
            </h3>
            <p className="text-muted-foreground text-lg">{label}</p>
        </div>
    );
}

// ─── Stats data (outside component — not recreated on renders) ──────────────
const STATS = [
    {
        end: 15000,
        duration: 2500,
        suffix: "+",
        color: "text-primary",
        label: "attendees",
        testId: "counter-attendees",
    },
    {
        end: 200,
        duration: 2000,
        suffix: "+",
        color: "text-accent",
        label: "speakers",
        testId: "counter-speakers",
    },
    {
        end: 130,
        duration: 2000,
        suffix: "+",
        color: "text-primary",
        label: "countries",
        testId: "counter-countries",
    },
    {
        end: 200,
        duration: 1500,
        suffix: "+",
        color: "text-accent",
        label: "Booths",
        testId: "counter-booths",
    },
] as const;

// ─── Main component ──────────────────────────────────────────────────────────
export default function Statistics() {
    return (
        <section className="py-16" id="statistics">
            {/* Academy banner */}
            <ScrollReveal variant="scale-up" duration={1000} delay={100}>
                <section className="relative bg-secondary/30" id="academy">
                    {/* Bubbles only on non-mobile */}
                    {!isMobile && <SectionBubbles count={5} />}

                    <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10 p-4">
                        <h2 className="text-2xl md:text-5xl lg:text-4xl font-bold leading-tight">
                            <span
                                className="inline-block p-4"
                                style={{
                                    animation: isMobile
                                        ? "none"
                                        : "pulseText 2s ease-in-out infinite",
                                }}>
                                The World's Leading All-in-One Web3 Academy
                            </span>
                            <br />
                            <span
                                className="inline-block text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
                                style={{
                                    animation: isMobile
                                        ? "none"
                                        : "gradientMove 4s ease infinite",
                                    backgroundSize: "200% 200%",
                                }}>
                                TechARA
                            </span>
                        </h2>
                    </div>
                </section>
            </ScrollReveal>

            <br />

            {/* Stats grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {STATS.map((stat) => (
                        <Counter key={stat.testId} {...stat} />
                    ))}
                </div>

                {/* Footer line */}
                <div className="text-center mt-12">
                    <div className="inline-flex items-center space-x-4 text-muted-foreground">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary" />
                        <span
                            className="text-sm"
                            data-testid="text-established">
                            Established in 2017
                        </span>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary" />
                    </div>
                </div>
            </div>
        </section>
    );
}
