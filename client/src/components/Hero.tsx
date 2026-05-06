import sindhuraImage from "@assets/hero-sindhu.webp";
import profileAvatars from "@assets/Group 58_1758098717538.png";
import redCircle from "@assets/hero-circle.webp";
import { ResponsiveMedia } from "./ResponsiveMedia";
import { useEffect, useState } from "react";
import SectionBubbles from "./SectionBubbles";
import OrbitIcons from "./OrbitIcons";
import { MessageCircle, Sparkles, Star, Users } from "lucide-react";
import { useAnimationDefer } from "@/hooks/useAnimationDefer";

export default function Hero() {
    const [isVisible, setIsVisible] = useState(true);
    const animationsEnabled = useAnimationDefer(1500);

    useEffect(() => {
        // Content visible immediately for better FCP/LCP
        setIsVisible(true);
    }, []);

    const openRegistrationForm = () => {
        // Scroll to attendees section and directly show the form
        setTimeout(() => {
            const attendeesSection = document.getElementById("attendees");
            if (attendeesSection) {
                attendeesSection.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });

                // Directly set showForm to true in the Attendees component using custom event
                const event = new CustomEvent("openRegistrationForm");
                document.dispatchEvent(event);
            }
        }, 300);
    };

    const handleBookDemo = () => {
        const whatsappNumber = "+919345791995";
        const whatsappMessage = `Hi Sindhu 👋  I'm really interested in learning about Blockchain and Crypto! 💻✨ I'd love to know more about your upcoming session and how I can join your Free workshop, Internship, or Master Courses. 🚀`;

        const url = `https://wa.me/${whatsappNumber.replace(
            /\s/g,
            "",
        )}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(url, "_blank");
    };

    return (
        <section className="relative min-h-screen pt-12 sm:pt-16 md:pt-20 overflow-hidden">
            {/* Black Background with gradient overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background:
                        "linear-gradient(135deg, #000000 0%, #1a0033 50%, #000000 100%)",
                }}
            />

            {/* Animated Bubbles - Skip on mobile */}
            {animationsEnabled && (
                <SectionBubbles count={5} className="z-[1]" />
            )}

            {/* Main Content Container */}
            <div className="relative z-10 w-full h-full">
                <div className="text-center pt-7 sm:pt-4 pb-4 sm:pb-8 px-2 sm:px-4">
                    <h1
                        className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight max-w-4xl lg:max-w-5xl mx-auto opacity-100 translate-y-0"
                        data-testid="text-main-title"
                        style={{
                            animation: animationsEnabled
                                ? "float 3s ease-in-out infinite"
                                : "none",
                        }}>
                        <span
                            className="inline-block transition-transform duration-700 delay-300 transform hover:scale-105"
                            style={{
                                animation: animationsEnabled
                                    ? "pulseText 2s ease-in-out infinite"
                                    : "none",
                            }}>
                            Empowering India's Web3 Future
                        </span>
                        <br />
                        <span
                            className="inline-block text-sm sm:text-base md:text-lg lg:text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 transition-all duration-700 delay-500 transform hover:scale-105"
                            style={{
                                animation: animationsEnabled
                                    ? "gradientMove 4s ease infinite"
                                    : "none",
                                backgroundSize: "200% 200%",
                            }}>
                            Er. SH — Blockchain & Fintech Innovator, Educator,
                            Visionary
                        </span>

                        {/* Inline keyframes */}
                        <style>
                            {`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulseText {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes gradientMove {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}
                        </style>
                    </h1>
                </div>

                {/* Main Layout - Desktop */}
                <div className="hidden lg:block relative">
                    <div className="flex items-center justify-center min-h-[450px] relative">
                        {/* Central Sindhu Circle */}
                        <div className="relative">
                            {/* Red Circle Background */}
                            <div className="w-[320px] h-[320px] md:w-[380px] md:h-[340px] lg:w-[400px] lg:h-[400px] xl:w-[430px] xl:h-[420px] 2xl:w-[450px] 2xl:h-[450px] rounded-full relative mx-auto -translate-x-20 -translate-y-10 opacity-100 scale-100">
                                <ResponsiveMedia
                                    src={redCircle}
                                    sizes="(max-width: 768px) 320px, (max-width: 1024px) 400px, 450px"
                                    alt="Hero background circle"
                                    width={450}
                                    height={450}
                                    className="w-full h-full object-cover"
                                    loading="eager"
                                    decoding="async"
                                />

                                {/* Sindhu Image - Positioned in center of red circle */}
                                <div className="absolute top-[40px] left-[10px] right-[40px] bottom-[40px] md:top-[50px] md:left-[10px] md:right-[50px] md:bottom-[50px] lg:top-[60px] lg:left-[60px] lg:right-[60px] lg:bottom-[60px] rounded-full overflow-hidden translate-x-20 opacity-100 rotate-0">
                                    <ResponsiveMedia
                                        src={sindhuraImage}
                                        sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 400px"
                                        loading="eager"
                                        fetchpriority="high"
                                        decoding="async"
                                        width={400}
                                        height={400}
                                        alt="Sindhu - Web3 Expert"
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                        placeholder="shimmer"
                                        data-testid="img-sindhu-hero"
                                    />
                                </div>
                                {animationsEnabled && <OrbitIcons />}
                            </div>

                            {/* Sparkle Icons - Top Right of Circle */}
                            <div
                                className={`absolute -top-4 -right-60 md:-right-80 text-yellow-400 transition-all duration-1000 delay-700 hidden md:block ${
                                    isVisible ? "opacity-100" : "opacity-0"
                                }`}>
                                <div className="text-xl md:text-2xl mb-2">
                                    <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
                                </div>
                                <div className="text-base md:text-lg ml-8">
                                    <Star className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                            </div>
                        </div>

                        {/* Quote Text Box - Right Side */}
                        <div
                            className={`absolute top-1/1 -translate-y-1/2 right-4 md:right-10 lg:right-20 w-64 md:w-72 lg:w-80 max-w-sm transition-all duration-1000 transform ${
                                isVisible
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 translate-x-20"
                            }`}>
                            <div className="backdrop-blur-sm rounded-2xl p-4 md:p-6 bg-gradient-to-br from-purple-900/40 to-black/60 hover:from-purple-800/50 hover:to-black/70 transition-all duration-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-purple-500/20">
                                <p className="text-white text-xs md:text-sm leading-relaxed mb-4">
                                    Building the future, one block at a time -
                                    that's the spirit of Web3_Sindhu.
                                </p>
                                <button
                                    // onClick={handleBookDemo}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 
             rounded-full font-semibold hover:from-blue-600 hover:to-blue-700 
             hover:scale-105 transition-all duration-300 shadow-lg w-full flex items-center justify-center gap-2">
                                    <MessageCircle className="w-4 h-4" />
                                    Techara
                                </button>
                            </div>
                        </div>

                        {/* Profile Avatars - Bottom Left */}
                        <div
                            className={`absolute bottom-0 left-2 md:left-4 lg:left-8 xl:left-16 transition-all duration-1000 delay-500 transform ${
                                isVisible
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-10"
                            }`}>
                            <div className="flex items-center gap-3 mb-4">
                                <ResponsiveMedia
                                    src={profileAvatars}
                                    alt="Profile Avatars"
                                    className="h-10 md:h-12 w-auto object-contain hover:scale-110 transition-transform duration-300"
                                    loading="lazy"
                                    data-testid="img-profile-avatars"
                                />
                            </div>
                            <div className="max-w-xs mb-8">
                                <h3 className="text-white font-semibold text-sm md:text-base mb-2">
                                    Sindhu turns technology into inspiration
                                </h3>
                                <a
                                    href="https://www.instagram.com/web3_sindhu?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-400 hover:text-purple-300 transition-colors underline text-xs md:text-sm cursor-pointer flex items-center gap-1"
                                    data-testid="button-see-story">
                                    <Users className="w-3 h-3" />
                                    See Story
                                </a>
                            </div>
                        </div>

                        {/* 500+ Reviews Badge - Bottom Right */}
                        <div
                            className={`absolute bottom-10 right-2 md:right-4 lg:right-8 xl:right-56 transition-all duration-1000 delay-700 transform ${
                                isVisible
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-10"
                            }`}>
                            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-4 md:px-6 py-2 md:py-3 shadow-xl hover:shadow-purple-500/30 hover:scale-110 transition-all duration-300">
                                <div className="text-center">
                                    <div className="text-white font-bold text-base md:text-lg flex items-center justify-center gap-1">
                                        <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-300 text-yellow-300" />
                                        500+
                                    </div>
                                    <div className="text-white text-xs md:text-xs">
                                        Positive Reviews
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tablet Layout */}
                <div className="hidden md:block lg:hidden px-4">
                    {/* Central Sindhu Circle for Tablet */}
                    <div className="flex justify-center mt-8 mb-8">
                        <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 -translate-x-10 opacity-100 scale-100">
                            <ResponsiveMedia
                                src={redCircle}
                                sizes="(max-width: 640px) 256px, 320px"
                                alt=""
                                width={320}
                                height={320}
                                className="w-full h-full object-cover animate-pulse-slow"
                                loading="eager"
                                decoding="async"
                            />

                            {/* Sindhu Image for Tablet */}
                            <div className="absolute top-12 left-12 right-12 bottom-12 rounded-full overflow-hidden translate-x-10 opacity-100 rotate-0">
                                <ResponsiveMedia
                                    src={sindhuraImage}
                                    sizes="(max-width: 640px) 200px, 280px"
                                    alt="Sindhu - Web3 Expert"
                                    width={320}
                                    height={320}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                    loading="eager"
                                    fetchpriority="high"
                                    decoding="async"
                                    placeholder="shimmer"
                                    data-testid="img-sindhu-hero-tablet"
                                />
                            </div>

                            {/* Sparkle for Tablet */}
                            <div className="absolute -top-2 -right-2 text-yellow-400">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <OrbitIcons />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Quote Section for Tablet */}
                        <div
                            className={`bg-black/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 bg-gradient-to-br from-purple-900/40 to-black/60 transition-all duration-1000 transform ${
                                isVisible
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-10"
                            } shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-purple-500/20`}>
                            <p className="text-white text-sm md:text-base leading-relaxed mb-4 md:mb-6">
                                Building the future, one block at a time -
                                that's the spirit of Web3_Sindhu.
                            </p>
                            <button
                                onClick={handleBookDemo}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 
             rounded-full font-semibold hover:from-blue-600 hover:to-blue-700 
             hover:scale-105 transition-all duration-300 shadow-lg w-full flex items-center justify-center gap-2"
                                data-testid="button-book-demo-hero-tablet">
                                <MessageCircle className="w-4 h-4" />
                                Techara
                            </button>
                        </div>

                        {/* Profile Avatars for Tablet */}
                        <div
                            className={`bg-black/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 bg-gradient-to-br from-purple-900/40 to-black/60 transition-all duration-1000 delay-500 transform ${
                                isVisible
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-10"
                            } shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-purple-500/20`}>
                            <div className="flex items-center gap-2 mb-4">
                                <ResponsiveMedia
                                    src={profileAvatars}
                                    alt="Profile Avatars"
                                    className="h-10 md:h-12 w-auto object-contain hover:scale-110 transition-transform duration-300"
                                    loading="lazy"
                                    data-testid="img-profile-avatars-tablet"
                                />
                            </div>
                            <h3 className="text-white font-semibold text-sm md:text-base mb-2">
                                Sindhu turns technology into inspiration
                            </h3>
                            <a
                                href="https://www.instagram.com/web3_sindhu?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:text-purple-300 transition-colors underline text-xs md:text-sm cursor-pointer flex items-center gap-1"
                                data-testid="button-see-story-tablet">
                                <Users className="w-3 h-3" />
                                See Story
                            </a>
                        </div>
                    </div>

                    {/* Reviews Badge for Tablet */}
                    <div
                        className={`flex justify-center mt-8 pb-8 transition-all duration-1000 delay-700 transform ${
                            isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}>
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-6 md:px-8 py-3 md:py-4 shadow-xl hover:shadow-purple-500/30 hover:scale-110 transition-all duration-300">
                            <div className="text-center">
                                <div className="text-white font-bold text-lg md:text-xl flex items-center justify-center gap-1">
                                    <Star className="w-5 h-5 md:w-6 md:h-6 fill-yellow-300 text-yellow-300" />
                                    500+
                                </div>
                                <div className="text-white text-sm">
                                    Positive Reviews
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden px-2 sm:px-4">
                    {/* Central Sindhu Circle for Mobile */}
                    <div className="flex justify-center mt-6 mb-6">
                        <div className="relative w-56 h-56 sm:w-64 sm:h-64 -translate-x-10 opacity-100 scale-100">
                            <ResponsiveMedia
                                src={redCircle}
                                sizes="(max-width: 640px) 224px, 256px"
                                alt=""
                                width={256}
                                height={256}
                                className="w-full h-full object-cover animate-pulse-slow"
                                loading="eager"
                            />

                            {/* Sindhu Image for Mobile */}
                            <div className="absolute top-10 left-10 right-10 bottom-10 rounded-full overflow-hidden translate-x-10 opacity-100 rotate-0">
                                <ResponsiveMedia
                                    src={sindhuraImage}
                                    sizes="(max-width: 640px) 176px, 200px"
                                    alt="Sindhu - Web3 Expert"
                                    width={256}
                                    height={256}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                    loading="eager"
                                    fetchpriority="high"
                                    decoding="async"
                                    placeholder="shimmer"
                                    data-testid="img-sindhu-hero-mobile"
                                />
                            </div>

                            {/* Sparkle for Mobile */}
                            <div className="absolute -top-2 -right-2 text-yellow-400">
                                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <OrbitIcons />
                        </div>
                    </div>

                    {/* Quote Section for Mobile */}
                    <div
                        className={`bg-black/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 mx-2 bg-gradient-to-br from-purple-900/40 to-black/60 transition-all duration-1000 transform ${
                            isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        } shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-purple-500/20`}>
                        <p className="text-white text-sm leading-relaxed mb-4 sm:mb-6 text-center">
                            Building the future, one block at a time - that's
                            the spirit of Web3_Sindhu.
                        </p>
                        <button
                            onClick={handleBookDemo}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 
             rounded-full font-semibold hover:from-blue-600 hover:to-blue-700 
             hover:scale-105 transition-all duration-300 shadow-lg w-full flex items-center justify-center gap-2"
                            data-testid="button-book-demo-hero-mobile">
                            <MessageCircle className="w-4 h-4" />
                            Techara
                        </button>
                    </div>

                    {/* Profile Avatars for Mobile */}
                    <div
                        className={`text-center mb-6 transition-all duration-1000 delay-500 transform ${
                            isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <ResponsiveMedia
                                src={profileAvatars}
                                alt="Profile Avatars"
                                className="h-10 w-auto object-contain hover:scale-110 transition-transform duration-300"
                                loading="lazy"
                                data-testid="img-profile-avatars-mobile"
                            />
                        </div>
                        <h3 className="text-white font-semibold text-base mb-2">
                            Sindhu turns technology into inspiration
                        </h3>
                        <a
                            href="https://www.instagram.com/web3_sindhu?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 transition-colors underline text-sm cursor-pointer flex items-center justify-center gap-1"
                            data-testid="button-see-story">
                            <Users className="w-3 h-3" />
                            See Story
                        </a>
                    </div>

                    {/* Reviews Badge for Mobile */}
                    <div
                        className={`flex justify-center pb-12 transition-all duration-1000 delay-700 transform ${
                            isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}>
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-6 sm:px-8 py-3 sm:py-4 shadow-xl hover:shadow-purple-500/30 hover:scale-110 transition-all duration-300">
                            <div className="text-center">
                                <div className="text-white font-bold text-lg sm:text-xl flex items-center justify-center gap-1">
                                    <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-300 text-yellow-300" />
                                    500+
                                </div>
                                <div className="text-white text-sm">
                                    Positive Reviews
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
