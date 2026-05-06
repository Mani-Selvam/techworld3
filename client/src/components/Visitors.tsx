import {
    MessageCircle,
    BookOpen,
    Zap,
    ChevronRight,
    GraduationCap,
    Maximize2,
    Minimize2,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

// ─── Device detection ─────────────────────────────────────────────────────────
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

// ─── Pre-computed particles — Math.random() in JSX re-runs every render ───────
const PARTICLES = isMobile
    ? []
    : Array.from({ length: 14 }, (_, i) => ({
          id: i,
          left: `${(i * 7.14).toFixed(1)}%`,
          top: `${((i * 11.73) % 100).toFixed(1)}%`,
          dur: `${3 + (i % 4)}s`,
          delay: `${((i * 0.3) % 2).toFixed(2)}s`,
      }));

// ─── Keyframes — injected once into <head> ────────────────────────────────────
const KEYFRAMES = `
  @keyframes peFloat   { 0%,100%{opacity:0;transform:translateY(0) scale(0)} 50%{opacity:.8;transform:translateY(-80px) scale(1)} }
  @keyframes peFadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes peSlideL  { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
  @keyframes peSlideR  { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
  @keyframes peGradient{ 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
`;
if (typeof document !== "undefined" && !document.getElementById("pe-kf")) {
    const s = document.createElement("style");
    s.id = "pe-kf";
    s.textContent = KEYFRAMES;
    document.head.appendChild(s);
}

// ─── WhatsApp URL (computed once) ─────────────────────────────────────────────
const WA_URL = `https://wa.me/+919345791995?text=${encodeURIComponent(
    "Hi Sindhu 👋  I'm really interested in learning about Blockchain and Crypto! 💻✨ I'd love to know more about your upcoming session and how I can join your Free workshop, Internship, or Master Courses. 🚀",
)}`;

export default function PassionateEducator() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoContainerRef = useRef<HTMLDivElement>(null);

    // ── Fullscreen toggle ─────────────────────────────────────────────────────
    const handleFullscreen = () => {
        const el = videoContainerRef.current;
        if (!el) return;

        if (!isFullscreen) {
            el.requestFullscreen?.() ?? (el as any).webkitRequestFullscreen?.();
            screen.orientation?.lock?.("landscape").catch(() => {});
        } else {
            document.exitFullscreen?.() ??
                (document as any).webkitExitFullscreen?.();
            screen.orientation?.unlock?.();
        }
    };

    // ── Fullscreen state sync — one unified handler ───────────────────────────
    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", handler);
        document.addEventListener("webkitfullscreenchange", handler);
        return () => {
            document.removeEventListener("fullscreenchange", handler);
            document.removeEventListener("webkitfullscreenchange", handler);
        };
    }, []);

    return (
        <section className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
            {/* ── Static particles — CSS only, pre-computed positions ────────── */}
            {PARTICLES.length > 0 && (
                <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    aria-hidden>
                    {PARTICLES.map((p) => (
                        <div
                            key={p.id}
                            className="absolute w-1 h-1 bg-purple-400 rounded-full"
                            style={{
                                left: p.left,
                                top: p.top,
                                animation: `peFloat ${p.dur} ease-in-out infinite ${p.delay}`,
                            }}
                        />
                    ))}
                </div>
            )}

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ── Header ───────────────────────────────────────────────────── */}
                <div
                    className="text-center mb-16"
                    style={{ animation: "peFadeUp 0.8s ease forwards" }}>
                    <a
                        href={WA_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 mb-6 hover:bg-purple-500/20 transition-colors duration-200">
                        <Zap className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-300 text-sm font-medium">
                            Meet Your Mentor
                        </span>
                    </a>

                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        <span
                            className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent inline-block"
                            style={{
                                backgroundSize: "300% 300%",
                                animation: "peGradient 6s ease infinite",
                            }}>
                            Passionate Blockchain
                        </span>
                        <br />
                        <span className="text-white">Educator</span>
                    </h2>

                    <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Transforming complex blockchain concepts into accessible
                        knowledge, empowering the next generation of Web3
                        innovators and leaders.
                    </p>
                </div>

                {/* ── Video + Info grid ────────────────────────────────────────── */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                    {/* Left — video with fullscreen */}
                    <div
                        className="relative"
                        style={{ animation: "peSlideL 0.8s ease .2s both" }}>
                        <div ref={videoContainerRef} className="relative group">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <div className="relative aspect-video bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/30">
                                    <iframe
                                        src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7172462144091832320?compact=1"
                                        height="399"
                                        width="100%"
                                        frameBorder="0"
                                        allowFullScreen
                                        title="Sindhu LinkedIn post"
                                        className="w-full h-full"
                                        loading="lazy"
                                    />
                                </div>
                                <button
                                    onClick={handleFullscreen}
                                    className="absolute bottom-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
                                    aria-label={
                                        isFullscreen
                                            ? "Exit fullscreen"
                                            : "Enter fullscreen"
                                    }>
                                    {isFullscreen ? (
                                        <Minimize2 className="w-5 h-5" />
                                    ) : (
                                        <Maximize2 className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right — text + CTAs */}
                    <div
                        className="space-y-8"
                        style={{ animation: "peSlideR 0.8s ease .4s both" }}>
                        <div className="space-y-4">
                            <p className="text-lg text-gray-300 leading-relaxed">
                                With over 6+ years of experience in blockchain
                                technology and education, I've dedicated my
                                career to demystifying the world of Web3 and
                                making it accessible to everyone.
                            </p>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                My mission is to bridge the gap between complex
                                blockchain concepts and practical applications,
                                helping students and professionals alike to
                                thrive in the decentralized economy.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            {/* WhatsApp CTA */}
                            <a
                                href={WA_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 hover:from-green-600 hover:to-green-700 transition-all duration-200 active:scale-95">
                                <MessageCircle className="w-5 h-5" />
                                <span>Chat on WhatsApp</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </a>

                            {/* View Courses CTA */}
                            <button
                                onClick={() =>
                                    window.open("https://techara.in/", "_blank")
                                }
                                className="group bg-white/10 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 hover:bg-purple-500/20 transition-colors duration-200 active:scale-95">
                                <BookOpen className="w-5 h-5" />
                                <span>View Courses</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Enroll CTA ────────────────────────────────────────────────── */}
                <div className="flex flex-col items-center">
                    <Link href="/enrollment" className="w-full max-w-md">
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-10 py-6 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl w-full flex justify-center items-center text-lg"
                            data-testid="button-enroll-now">
                            <GraduationCap className="w-6 h-6 mr-3" />
                            Enroll Now - Limited Seats
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
