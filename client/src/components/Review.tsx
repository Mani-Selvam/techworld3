import { motion } from "framer-motion";
import { MessageCircle, Star, ChevronRight, BookOpen } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import techaraVideo from "@assets/techara.mp4";

export default function StudentReviews() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const whatsappNumber = "+919345791995";
    const whatsappMessage = `Hi Sindhu 👋 I saw the amazing student reviews and I'm really interested in your Blockchain & Crypto courses! 💻✨ Could you share details about upcoming sessions, the free workshop, Internship, or Master Courses? 🚀`;

    const handleWhatsAppClick = () => {
        const url = `https://wa.me/${whatsappNumber.replace(/\s/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(url, "_blank");
    };

    const handleViewCourses = () => {
        window.open("https://techara.in/", "_blank");
    };

    const handleFullscreen = () => {
        const video = videoRef.current;
        if (!video) return;
        if (!isFullscreen) {
            if (video.requestFullscreen) video.requestFullscreen();
            else if ((video as any).webkitRequestFullscreen)
                (video as any).webkitRequestFullscreen();
            else if ((video as any).webkitEnterFullscreen)
                (video as any).webkitEnterFullscreen();
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            else if ((document as any).webkitExitFullscreen)
                (document as any).webkitExitFullscreen();
        }
    };

    useEffect(() => {
        const onChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", onChange);
        document.addEventListener("webkitfullscreenchange", onChange);
        return () => {
            document.removeEventListener("fullscreenchange", onChange);
            document.removeEventListener("webkitfullscreenchange", onChange);
        };
    }, []);

    return (
        <section
            style={{
                position: "relative",
                padding: "80px 0 100px",
                overflow: "hidden",
                background:
                    "linear-gradient(135deg, #0F0A1E 0%, #1A0F2E 40%, #0D1B2A 100%)",
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            }}>
            {/*
              ── Fullscreen CSS fix ──
              In normal view  → objectFit: cover  (fills box, no black bars)
              In fullscreen   → objectFit: contain (shows full 16:9 frame, no crop)
              background: #000 adds clean black letterbox bars if needed
            */}
            <style>{`
                #techara-video {
                    object-fit: cover;
                    background: #000;
                }
                #techara-video:-webkit-full-screen {
                    object-fit: contain;
                    width: 100vw;
                    height: 100vh;
                    background: #000;
                }
                #techara-video:fullscreen {
                    object-fit: contain;
                    width: 100vw;
                    height: 100vh;
                    background: #000;
                }
            `}</style>

            <div
                style={{
                    position: "relative",
                    zIndex: 10,
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "0 20px",
                }}>
                <motion.div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "40px",
                        alignItems: "center",
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "28px",
                        padding: "clamp(24px, 4vw, 48px)",
                    }}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}>
                    {/* ── Video Player ── */}
                    <div
                        style={{
                            position: "relative",
                            borderRadius: "16px",
                            overflow: "hidden",
                            border: "1px solid rgba(124,58,237,0.25)",
                            background: "#000",
                        }}>
                        <video
                            id="techara-video" // ← targeted by CSS above
                            ref={videoRef}
                            src={techaraVideo}
                            style={{
                                width: "100%",
                                aspectRatio: "16/9", // normal view container shape
                                display: "block",
                                borderRadius: "16px",
                            }}
                            controls
                            playsInline
                            preload="metadata"
                            onDoubleClick={handleFullscreen}
                        />
                    </div>

                    {/* ── CTA Copy ── */}
                    <div>
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                background: "rgba(245,158,11,0.12)",
                                border: "1px solid rgba(245,158,11,0.3)",
                                borderRadius: "999px",
                                padding: "5px 14px",
                                marginBottom: "20px",
                            }}>
                            <Star
                                style={{
                                    width: 13,
                                    height: 13,
                                    fill: "#F59E0B",
                                    color: "#F59E0B",
                                }}
                            />
                            <span
                                style={{
                                    fontSize: "12px",
                                    color: "#FCD34D",
                                    fontWeight: 600,
                                }}>
                                4.9 / 5 · 2,400+ reviews
                            </span>
                        </div>

                        <h3
                            style={{
                                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                                fontWeight: 800,
                                color: "#fff",
                                lineHeight: 1.25,
                                marginBottom: "14px",
                                letterSpacing: "-0.015em",
                            }}>
                            Ready to write your
                            <br />
                            <span
                                style={{
                                    background:
                                        "linear-gradient(90deg, #F59E0B, #EC4899)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}>
                                success story?
                            </span>
                        </h3>

                        <p
                            style={{
                                fontSize: "14px",
                                color: "rgba(255,255,255,0.5)",
                                lineHeight: 1.75,
                                marginBottom: "28px",
                            }}>
                            Join 2,400+ students who've transformed their
                            careers with Sindhu's blockchain & Web3 programs.
                            Start with a free workshop today.
                        </p>

                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "12px",
                            }}>
                            <motion.button
                                onClick={handleWhatsAppClick}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    background:
                                        "linear-gradient(135deg, #16A34A, #15803D)",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: "14px",
                                    padding: "13px 24px",
                                    borderRadius: "12px",
                                    border: "none",
                                    cursor: "pointer",
                                    boxShadow: "0 4px 24px rgba(22,163,74,0.3)",
                                }}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}>
                                <MessageCircle
                                    style={{ width: 17, height: 17 }}
                                />
                                Chat on WhatsApp
                                <ChevronRight
                                    style={{ width: 15, height: 15 }}
                                />
                            </motion.button>

                            <motion.button
                                onClick={handleViewCourses}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    background: "rgba(255,255,255,0.07)",
                                    color: "#fff",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    padding: "13px 24px",
                                    borderRadius: "12px",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    cursor: "pointer",
                                }}
                                whileHover={
                                    {
                                        scale: 1.04,
                                        background: "rgba(124,58,237,0.2)",
                                    } as any
                                }
                                whileTap={{ scale: 0.97 }}>
                                <BookOpen style={{ width: 17, height: 17 }} />
                                View Courses
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
