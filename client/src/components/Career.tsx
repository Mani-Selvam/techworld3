import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    CheckCircle,
    ArrowRight,
    Zap,
    BookOpen,
    Briefcase,
    Sparkles,
    Code,
    Users,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

// ✅ Fixed: module-level constant — no state, no resize listener, no re-renders
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

const careerServices = [
    {
        id: 1,
        title: "Certified Blockchain & Crypto Workshop",
        duration: "1 Day | Every Sunday 10 AM – 1 PM",
        actualPrice: "Rs.3800/-",
        offerPrice: "Rs.1999/-",
        description:
            "Master blockchain fundamentals, wallets, smart contracts, and NFTs through hands-on demos.",
        highlights: [
            "Blockchain fundamentals & history",
            "Wallets, transactions & crypto basics",
            "Smart contract introduction",
            "NFT overview & marketplaces",
            "Hands-on demos included",
        ],
        outcome:
            "Foundational understanding + hands-on experience + clarity for further learning",
        icon: Zap,
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/30",
    },
    {
        id: 2,
        title: "Crypto Consultation (1-to-1)",
        duration: "45–60 Minutes | Online / Offline",
        actualPrice: "Rs.5000/-",
        offerPrice: "Rs.3000/-",
        description:
            "Personal guidance on portfolio review, safe crypto investment, and beginner roadmap.",
        highlights: [
            "Personal portfolio review & strategy",
            "Safe crypto investment guidance",
            "Risk management & market timing",
            "Long-term vs short-term planning",
            "Custom investment plan",
        ],
        outcome:
            "Safe investing knowledge + personalized roadmap + confidence to start",
        icon: Briefcase,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/30",
    },
    {
        id: 3,
        title: "Crypto Licensing & Exchange Listing",
        duration: "1 Hour | Online / Offline",
        actualPrice: "Custom Pricing",
        offerPrice: "Customized",
        description:
            "Complete guidance for startups and founders on token creation, licensing, and exchange listing.",
        highlights: [
            "Crypto project licensing process",
            "Token creation & tokenomics",
            "Exchange listing (Centralized & DEX)",
            "Legal & compliance structure",
            "Budgeting & auditing guidance",
        ],
        outcome:
            "Full clarity on launching projects + legal compliance + exchange listing roadmap",
        icon: Code,
        color: "text-purple-400",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/30",
    },
    {
        id: 4,
        title: "Career Consultation – Web3 / Blockchain",
        duration: "30–45 Minutes",
        actualPrice: "Rs.3000/-",
        offerPrice: "Rs.1000/-",
        description:
            "Personalized career roadmap for students, job seekers, and career-changers in blockchain.",
        highlights: [
            "Career path assessment",
            "Skill roadmap from beginner",
            "Job vs freelance opportunities",
            "Salary expectations & market demand",
            "Resume & LinkedIn audit",
        ],
        outcome:
            "Personalized roadmap + skill progression plan + Web3 career confidence",
        icon: Users,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/30",
    },
    {
        id: 5,
        title: "NFT Consultation & Creation Guidance",
        duration: "1 Hour | Online / Offline",
        actualPrice: "Rs.3500/-",
        offerPrice: "Rs.1999/-",
        description:
            "Learn NFT creation, minting, marketplace launch, and safe practices for artists & entrepreneurs.",
        highlights: [
            "NFT fundamentals & how they work",
            "Choosing the right blockchain",
            "Minting your first NFT",
            "Marketplace setup & trading",
            "NFT collection creation",
        ],
        outcome:
            "NFT creation skills + marketplace knowledge + launch-ready collection roadmap",
        icon: Sparkles,
        color: "text-pink-400",
        bgColor: "bg-pink-500/10",
        borderColor: "border-pink-500/30",
    },
    {
        id: 6,
        title: "Internship Program (Live Project)",
        duration: "1-Day or 2-Day | Every Tuesday & Friday",
        actualPrice: "1-Day: Rs.3800/- | 2-Day: Rs.6800/-",
        offerPrice: "1-Day: Rs.1999/- | 2-Day: Rs.3500/-",
        description:
            "Hands-on internship with real projects: deploy smart contracts, mint NFTs, build portfolio.",
        highlights: [
            "Deploy smart contracts on Ethereum testnet",
            "Mint NFTs & upload to IPFS",
            "Build GitHub portfolio",
            "Connect DApp frontend",
            "Resume & LinkedIn polish",
        ],
        outcome:
            "Portfolio-ready projects + practical experience + confidence to join Master courses",
        icon: BookOpen,
        color: "text-indigo-400",
        bgColor: "bg-indigo-500/10",
        borderColor: "border-indigo-500/30",
    },
];

interface ExpandedItem {
    [key: number]: boolean;
}

export default function Career() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expanded, setExpanded] = useState<ExpandedItem>({});

    // ✅ Fixed: drag coords in refs — no state, no re-renders on touch
    const dragStartRef = useRef(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ✅ Fixed: extracted so manual nav can reset it (same pattern as Testimonials/Ecosystem)
    const startAutoPlay = () => {
        if (!isMobile) return;
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % careerServices.length);
        }, 4000);
    };

    useEffect(() => {
        startAutoPlay();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const toggleExpand = (id: number) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleWhatsAppClick = (serviceName: string) => {
        const msg = `Hi 👋 I'm interested in "${serviceName}". Please share more details and available slots. 🚀`;
        window.open(
            `https://wa.me/919345791995?text=${encodeURIComponent(msg)}`,
            "_blank",
        );
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % careerServices.length);
        startAutoPlay(); // ✅ Fixed: resets interval instead of permanently disabling
    };

    const prevSlide = () => {
        setCurrentIndex(
            (prev) =>
                (prev - 1 + careerServices.length) % careerServices.length,
        );
        startAutoPlay();
    };

    // ✅ Fixed: read touch value directly — no stale state race condition
    const handleTouchStart = (e: React.TouchEvent) => {
        dragStartRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const dragEnd = e.changedTouches[0].clientX;
        const delta = dragStartRef.current - dragEnd;
        if (delta > 50) nextSlide();
        else if (delta < -50) prevSlide();
    };

    const isMobileView = isMobile && careerServices.length > 1;

    return (
        <section className="relative py-16 md:py-20 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(135deg, #000000 0%, #1a0033 25%, #0a0020 50%, #1a0033 75%, #000000 100%)",
                    }}
                />
                {/* ✅ Fixed: blobs desktop-only — removes 2 infinite loops from mobile */}
                <div className="hidden md:block">
                    <motion.div
                        className="absolute top-20 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full filter blur-3xl"
                        animate={{ y: [0, 40, 0] }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute bottom-20 left-1/3 w-96 h-96 bg-pink-900/15 rounded-full filter blur-3xl"
                        animate={{ y: [0, -40, 0] }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-12 md:mb-16">
                    <div className="inline-block mb-4">
                        {/* ✅ Fixed: emoji removed from uppercased text */}
                        <span className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/50 text-purple-300 text-sm font-bold uppercase tracking-wider">
                            Expert Consulting Services
                        </span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
                        Career & Consulting Services
                    </h2>

                    <p className="text-lg text-gray-300 max-w-3xl">
                        Get personalized guidance from blockchain experts.
                        Choose from workshops, 1-to-1 consultations, and
                        hands-on internship programs tailored to your goals.
                    </p>
                </motion.div>

                {/* Mobile Carousel */}
                {isMobileView ? (
                    <div className="mb-12">
                        <div
                            className="relative overflow-hidden rounded-xl"
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, x: 200 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -200 }}
                                    transition={{
                                        duration: 0.35,
                                        ease: "easeOut",
                                    }}>
                                    <ServiceCard
                                        service={careerServices[currentIndex]}
                                        expanded={
                                            !!expanded[
                                                careerServices[currentIndex].id
                                            ]
                                        }
                                        onToggleExpand={() =>
                                            toggleExpand(
                                                careerServices[currentIndex].id,
                                            )
                                        }
                                        onWhatsApp={() =>
                                            handleWhatsAppClick(
                                                careerServices[currentIndex]
                                                    .title,
                                            )
                                        }
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-6 px-2">
                            <motion.button
                                onClick={prevSlide}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Previous service"
                                className="p-3 rounded-lg bg-purple-600/30 border border-purple-400/50 text-purple-300 hover:bg-purple-600/50 transition-all">
                                <ChevronLeft className="w-5 h-5" />
                            </motion.button>

                            <div className="flex flex-col items-center gap-3">
                                <div className="flex gap-2">
                                    {careerServices.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setCurrentIndex(idx);
                                                startAutoPlay();
                                            }}
                                            aria-label={`Go to service ${idx + 1}`}
                                            className={`h-2 rounded-full transition-all ${
                                                idx === currentIndex
                                                    ? "bg-purple-500 w-8"
                                                    : "bg-purple-500/30 w-2 hover:bg-purple-500/50"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-400">
                                    {currentIndex + 1} / {careerServices.length}
                                </span>
                            </div>

                            <motion.button
                                onClick={nextSlide}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Next service"
                                className="p-3 rounded-lg bg-purple-600/30 border border-purple-400/50 text-purple-300 hover:bg-purple-600/50 transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        </div>
                        {/* ✅ Fixed: removed auto-play toggle button — auto-play resets silently on manual nav */}
                    </div>
                ) : (
                    /* Desktop Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
                        {careerServices.map((service, idx) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: idx * 0.08,
                                    duration: 0.5,
                                }}>
                                <ServiceCard
                                    service={service}
                                    expanded={!!expanded[service.id]}
                                    onToggleExpand={() =>
                                        toggleExpand(service.id)
                                    }
                                    onWhatsApp={() =>
                                        handleWhatsAppClick(service.title)
                                    }
                                />
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-center pt-8 border-t border-white/10">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Not Sure Which One?
                    </h3>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Schedule a free discovery call with our career advisors
                        to find the perfect program for your goals and
                        aspirations.
                    </p>
                    <motion.button
                        onClick={() =>
                            handleWhatsAppClick(
                                "Free Discovery Call - Career Guidance",
                            )
                        }
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 mx-auto transition-all">
                        Schedule Free Call
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}

interface ServiceCardProps {
    service: (typeof careerServices)[0];
    expanded: boolean;
    onToggleExpand: () => void;
    onWhatsApp: () => void;
}

function ServiceCard({
    service,
    expanded,
    onToggleExpand,
    onWhatsApp,
}: ServiceCardProps) {
    const Icon = service.icon;

    return (
        <motion.div
            className={`relative group overflow-hidden rounded-xl border ${service.borderColor} ${service.bgColor} backdrop-blur-sm hover:border-white/50 transition-all duration-300 p-6`}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}>
            {/* Header */}
            <div className="mb-5">
                <div className="flex items-start justify-between mb-3">
                    <div
                        className={`p-3 rounded-lg ${service.bgColor} border ${service.borderColor}`}>
                        <Icon className={`w-6 h-6 ${service.color}`} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span className="line-clamp-1">
                            {service.duration.split("|")[0].trim()}
                        </span>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                    {service.title}
                </h3>

                <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm text-gray-400 line-through">
                        {service.actualPrice}
                    </span>
                    <span className={`font-bold ${service.color}`}>
                        {service.offerPrice}
                    </span>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                    {service.description}
                </p>
            </div>

            {/* Highlights — collapsible */}
            <motion.div
                initial={false}
                animate={{
                    height: expanded ? "auto" : 0,
                    opacity: expanded ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-4">
                <div className="pt-3 border-t border-white/10">
                    <h4 className="text-xs font-bold text-gray-300 uppercase mb-3 tracking-wider">
                        Key Features
                    </h4>
                    <div className="space-y-2">
                        {service.highlights.map((item, hIdx) => (
                            // ✅ Fixed: static list items — no entrance animation that re-fires on parent re-render
                            <div key={hIdx} className="flex items-start gap-2">
                                <CheckCircle
                                    className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${service.color}`}
                                />
                                <span className="text-xs text-gray-400">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10">
                        <p className="text-xs text-gray-300">
                            <span className="font-bold text-yellow-400">
                                Your Outcome:
                            </span>{" "}
                            {service.outcome}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={onToggleExpand}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-all text-sm font-semibold flex items-center justify-center gap-2 ${
                        expanded
                            ? "border-white/30 text-gray-300 hover:bg-white/5"
                            : `${service.borderColor} text-gray-300 hover:border-white/50`
                    }`}>
                    <span>{expanded ? "Show Less" : "Details"}</span>
                    <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                    />
                </button>

                <motion.button
                    onClick={onWhatsApp}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all text-sm">
                    <span>Enroll</span>
                    <ArrowRight className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div>
    );
}
