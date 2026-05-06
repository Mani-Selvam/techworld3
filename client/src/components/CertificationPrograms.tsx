import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen,
    Shield,
    Zap,
    Clock,
    Award,
    TrendingUp,
    ArrowRight,
    CheckCircle,
    Target,
} from "lucide-react";

export default function CertificationPrograms() {
    const [selectedId, setSelectedId] = useState(1);

    const certifications = [
        {
            id: 1,
            number: "01",
            title: "Blockchain Foundations",
            subtitle: "& Digital Innovation",
            tagline: "Perfect for Getting Started",
            duration: "1 Month",
            hours: "36 Hours",
            level: "Beginner",
            coding: "No Coding Required",
            price: "₹19,999/-",
            originalPrice: "₹32,000/-",
            icon: BookOpen,
            gradient: "from-yellow-400 to-orange-400",
            bgGradient: "from-yellow-500/10 to-orange-500/10",
            textGradient: "from-yellow-300 to-orange-300",
            whoShouldJoin: [
                "Students & freshers",
                "Working professionals",
                "Entrepreneurs & trainers",
                "Anyone curious about blockchain & crypto",
            ],
            whatYouLearn: [
                "Basics of blockchain, blocks & transactions",
                "Wallets, keys & security",
                "Smart contracts overview",
                "Real-world industry use cases",
                "Simple hands-on: wallet setup, block explorer, demo dApp",
            ],
            outcome: [
                "Strong foundation in blockchain concepts",
                "Confidence using wallets & explorers",
                "Ability to understand use-cases & opportunities",
                "Professional certification (LinkedIn add-on)",
            ],
        },
        {
            id: 2,
            number: "02",
            title: "Blockchain Architecture",
            subtitle: "& Smart Contract Technologies",
            tagline: "Build Real Skills Fast",
            duration: "2 Months",
            hours: "72 Hours",
            level: "Intermediate",
            coding: "Includes Job Assistance",
            price: "₹45,000/-",
            originalPrice: "₹65,000/-",
            icon: Shield,
            gradient: "from-blue-400 to-cyan-400",
            bgGradient: "from-blue-500/10 to-cyan-500/10",
            textGradient: "from-blue-300 to-cyan-300",
            whoShouldJoin: [
                "Students with basic blockchain knowledge",
                "Tech learners moving from theory → practical",
                "Developers entering Web3",
                "Professionals targeting blockchain technical roles",
            ],
            whatYouLearn: [
                "Blockchain architecture, networks & consensus models",
                "Smart contract fundamentals",
                "Hands-on Solidity basics",
                "Deploy & test simple smart contracts",
                "Intro to dApp workflows & tools",
                "Practical assignments + guided mini-projects",
            ],
            outcome: [
                "Ability to design basic blockchain architectures",
                "Confidence writing & deploying simple smart contracts",
                "Hands-on experience with Remix & MetaMask",
                "Strong base for advanced Web3 development",
                "Job assistance + LinkedIn-ready certification",
            ],
        },
        {
            id: 3,
            number: "03",
            title: "Advanced Blockchain",
            subtitle: "Engineering & Web3 Development",
            tagline: "Become a Web3 Expert",
            duration: "4 Months",
            hours: "144 Hours",
            level: "Advanced",
            coding: "Career Opportunities + Internship",
            price: "₹99,999/-",
            originalPrice: "₹1,30,000/-",
            icon: Zap,
            gradient: "from-purple-400 to-pink-400",
            bgGradient: "from-purple-500/10 to-pink-500/10",
            textGradient: "from-purple-300 to-pink-300",
            whoShouldJoin: [
                "Students who know blockchain basics",
                "Beginners who want to start coding",
                "Developers entering Web3",
                "Professionals for advanced blockchain roles",
            ],
            whatYouLearn: [
                "Blockchain architecture & networks",
                "Consensus methods & on-chain logic",
                "Smart contract fundamentals",
                "Hands-on Solidity",
                "Deploy complex smart contracts (Hyperledger Fabric)",
                "Practical tasks + major real-world projects",
            ],
            outcome: [
                "Deep understanding of blockchain systems",
                "Ability to write & deploy smart contracts",
                "Practical confidence with tools (Remix, MetaMask, Testnets)",
                "Ready for high-level Web3 development",
                "Job assurance included",
            ],
        },
    ];

    const selected = certifications.find((c) => c.id === selectedId);
    const Icon = selected?.icon || BookOpen;

    const handleWhatsApp = () => {
        if (!selected) return;
        const whatsappNumber = "+919345791995";
        const whatsappMessage = `Hi 👋 I'm interested in "${selected.title} ${selected.subtitle}" (${selected.price}). Please share the curriculum details, schedule, and next batch information. 🚀`;
        const url = `https://wa.me/${whatsappNumber.replace(/\s/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(url, "_blank");
    };

    return (
        <section className="relative py-20 md:py-32 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(135deg, #0a0e27 0%, #1a1a3e 25%, #2d1b4e 50%, #1a1a3e 75%, #0a0e27 100%)",
                    }}
                />
                <motion.div
                    className="absolute top-20 left-1/4 w-72 h-72 bg-purple-900/20 rounded-full filter blur-3xl"
                    animate={{ y: [0, 30, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-32 right-1/4 w-96 h-96 bg-indigo-900/15 rounded-full filter blur-3xl"
                    animate={{ y: [0, -30, 0] }}
                    transition={{ duration: 10, repeat: Infinity }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16 md:mb-24">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
                        <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                            Certification Pathways
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                        Choose your learning journey from beginner to advanced
                        professional
                    </p>
                </motion.div>

                {/* Program Selector - Horizontal Line */}
                <div className="mb-16 md:mb-24">
                    <div
                        className="flex flex-row gap-4 md:gap-8 justify-center items-stretch overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-hide"
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}>
                        {certifications.map((cert, idx) => {
                            const CertIcon = cert.icon;
                            const isSelected = selectedId === cert.id;
                            return (
                                <motion.button
                                    key={cert.id}
                                    onClick={() => setSelectedId(cert.id)}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative group flex-1 md:flex-none">
                                    <div
                                        className={`relative overflow-hidden rounded-2xl md:rounded-3xl p-4 md:p-8 backdrop-blur-xl border transition-all duration-300 flex-1 min-w-max md:min-w-fit ${
                                            isSelected
                                                ? `bg-gradient-to-br ${cert.bgGradient} border-white/30 shadow-2xl shadow-purple-500/20`
                                                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                                        }`}>
                                        {/* Animated background for selected */}
                                        {isSelected && (
                                            <motion.div
                                                layoutId="selector-bg"
                                                className={`absolute inset-0 bg-gradient-to-br ${cert.gradient} opacity-5 rounded-2xl md:rounded-3xl`}
                                                transition={{
                                                    type: "spring",
                                                    bounce: 0.2,
                                                }}
                                            />
                                        )}

                                        <div className="relative z-10">
                                            <motion.div
                                                initial={false}
                                                animate={{
                                                    scale: isSelected ? 1.2 : 1,
                                                }}
                                                className={`inline-block p-3 rounded-xl mb-3 transition-all ${
                                                    isSelected
                                                        ? `bg-gradient-to-br ${cert.gradient}`
                                                        : "bg-white/10"
                                                }`}>
                                                <CertIcon
                                                    className={`w-6 h-6 ${isSelected ? "text-white" : "text-gray-400"}`}
                                                />
                                            </motion.div>

                                            <h3
                                                className={`text-base md:text-lg font-bold mb-2 transition-colors ${
                                                    isSelected
                                                        ? "text-white"
                                                        : "text-gray-300"
                                                }`}>
                                                {cert.number}
                                            </h3>

                                            <p
                                                className={`text-sm transition-colors ${
                                                    isSelected
                                                        ? "text-gray-100"
                                                        : "text-gray-400"
                                                }`}>
                                                {cert.level}
                                            </p>

                                            {isSelected && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className={`text-xs font-semibold mt-3 bg-gradient-to-r ${cert.textGradient} bg-clip-text text-transparent`}>
                                                    ✓ Selected
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Hover effect border */}
                                        {!isSelected && (
                                            <div className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                        )}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Featured Program Content */}
                <AnimatePresence mode="wait">
                    {selected && (
                        <motion.div
                            key={selected.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.5 }}
                            className="mb-20">
                            {/* Main Featured Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
                                {/* Left: Content */}
                                <div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}>
                                        <span
                                            className={`inline-block text-sm font-bold px-4 py-2 rounded-full bg-gradient-to-r ${selected.gradient} text-white mb-4`}>
                                            {selected.tagline}
                                        </span>

                                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                                            {selected.title}
                                            <br />
                                            <span
                                                className={`bg-gradient-to-r ${selected.gradient} bg-clip-text text-transparent`}>
                                                {selected.subtitle}
                                            </span>
                                        </h1>

                                        <p className="text-gray-300 text-lg mb-8">
                                            Master the skills needed to succeed
                                            in the blockchain industry with our
                                            comprehensive curriculum and expert
                                            guidance.
                                        </p>
                                    </motion.div>

                                    {/* Key Info Boxes */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:border-white/20 transition-all">
                                            <p className="text-gray-400 text-xs uppercase mb-1">
                                                Duration
                                            </p>
                                            <p className="text-white font-bold text-lg">
                                                {selected.duration}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                {selected.hours}
                                            </p>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:border-white/20 transition-all">
                                            <p className="text-gray-400 text-xs uppercase mb-1">
                                                Difficulty
                                            </p>
                                            <p className="text-white font-bold text-lg">
                                                {selected.level}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                {selected.coding}
                                            </p>
                                        </div>
                                    </motion.div>

                                    {/* CTA Buttons */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="flex gap-4 flex-col sm:flex-row">
                                        <motion.button
                                            onClick={handleWhatsApp}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`flex-1 px-6 py-4 bg-gradient-to-r ${selected.gradient} hover:shadow-2xl hover:shadow-yellow-500/50 text-white font-bold rounded-xl md:rounded-2xl flex items-center justify-center gap-2 transition-all text-base md:text-lg`}>
                                            Enroll Now
                                            <ArrowRight className="w-5 h-5" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl md:rounded-2xl border border-white/20 transition-all">
                                            Learn More
                                        </motion.button>
                                    </motion.div>
                                </div>

                                {/* Right: Pricing Section */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}>
                                    <div
                                        className={`relative rounded-3xl md:rounded-4xl overflow-hidden backdrop-blur-xl border border-white/20 p-8 md:p-10`}>
                                        {/* Gradient Background */}
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${selected.bgGradient} opacity-50`}
                                        />
                                        <motion.div
                                            className={`absolute inset-0 bg-gradient-to-br ${selected.gradient} opacity-5`}
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                duration: 20,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                        />

                                        <div className="relative z-10">
                                            <div className="mb-8 pb-8 border-b border-white/10">
                                                <p className="text-gray-300 text-sm uppercase tracking-wider mb-2">
                                                    Investment Required
                                                </p>
                                                <div className="flex items-baseline gap-3">
                                                    <span className="text-gray-400 line-through text-lg">
                                                        {selected.originalPrice}
                                                    </span>
                                                    <motion.span
                                                        key={selected.id}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${selected.gradient} bg-clip-text text-transparent`}>
                                                        {selected.price}
                                                    </motion.span>
                                                </div>
                                                <p className="text-emerald-300 text-sm font-semibold mt-3">
                                                    💰 Save{" "}
                                                    {Math.round(
                                                        ((parseInt(
                                                            selected.originalPrice.replace(
                                                                /[^0-9]/g,
                                                                "",
                                                            ),
                                                        ) -
                                                            parseInt(
                                                                selected.price.replace(
                                                                    /[^0-9]/g,
                                                                    "",
                                                                ),
                                                            )) /
                                                            parseInt(
                                                                selected.originalPrice.replace(
                                                                    /[^0-9]/g,
                                                                    "",
                                                                ),
                                                            )) *
                                                            100,
                                                    )}
                                                    % today
                                                </p>
                                            </div>

                                            {/* Highlights */}
                                            <div className="space-y-3">
                                                <p className="text-white font-bold text-sm uppercase tracking-wide mb-4">
                                                    What's Included
                                                </p>
                                                {[
                                                    "Expert-led live training",
                                                    "Certificate of completion",
                                                    "Job assistance",
                                                    "Community access",
                                                ].map((item, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{
                                                            opacity: 0,
                                                            x: -10,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            x: 0,
                                                        }}
                                                        transition={{
                                                            delay:
                                                                0.4 +
                                                                idx * 0.05,
                                                        }}
                                                        className="flex items-center gap-3">
                                                        <CheckCircle
                                                            className={`w-5 h-5 bg-gradient-to-r ${selected.gradient} bg-clip-text text-transparent flex-shrink-0`}
                                                        />
                                                        <span className="text-gray-200 text-sm">
                                                            {item}
                                                        </span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Three Section Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                                {/* Who Should Join */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 hover:bg-white/[0.08] transition-all">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Target
                                            className={`w-6 h-6 bg-gradient-to-br ${selected.gradient} rounded-lg p-1`}
                                        />
                                        <h3 className="text-lg font-bold text-white">
                                            Ideal For
                                        </h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {selected.whoShouldJoin.map(
                                            (item, idx) => (
                                                <motion.li
                                                    key={idx}
                                                    initial={{
                                                        opacity: 0,
                                                        x: -10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    transition={{
                                                        delay: 0.5 + idx * 0.05,
                                                    }}
                                                    className="flex items-start gap-3">
                                                    <span
                                                        className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${selected.gradient} flex-shrink-0 mt-2`}
                                                    />
                                                    <span className="text-gray-300 text-sm">
                                                        {item}
                                                    </span>
                                                </motion.li>
                                            ),
                                        )}
                                    </ul>
                                </motion.div>

                                {/* What You Learn */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 hover:bg-white/[0.08] transition-all">
                                    <div className="flex items-center gap-3 mb-6">
                                        <BookOpen
                                            className={`w-6 h-6 bg-gradient-to-br ${selected.gradient} rounded-lg p-1`}
                                        />
                                        <h3 className="text-lg font-bold text-white">
                                            You'll Learn
                                        </h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {selected.whatYouLearn
                                            .slice(0, 4)
                                            .map((item, idx) => (
                                                <motion.li
                                                    key={idx}
                                                    initial={{
                                                        opacity: 0,
                                                        x: -10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    transition={{
                                                        delay: 0.6 + idx * 0.05,
                                                    }}
                                                    className="flex items-start gap-3">
                                                    <span
                                                        className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${selected.gradient} flex-shrink-0 mt-2`}
                                                    />
                                                    <span className="text-gray-300 text-sm">
                                                        {item}
                                                    </span>
                                                </motion.li>
                                            ))}
                                        {selected.whatYouLearn.length > 4 && (
                                            <li className="text-gray-400 text-xs italic pt-2">
                                                +
                                                {selected.whatYouLearn.length -
                                                    4}{" "}
                                                more topics
                                            </li>
                                        )}
                                    </ul>
                                </motion.div>

                                {/* Outcomes */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:border-white/20 hover:bg-white/[0.08] transition-all">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Award
                                            className={`w-6 h-6 bg-gradient-to-br ${selected.gradient} rounded-lg p-1`}
                                        />
                                        <h3 className="text-lg font-bold text-white">
                                            You'll Get
                                        </h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {selected.outcome
                                            .slice(0, 4)
                                            .map((item, idx) => (
                                                <motion.li
                                                    key={idx}
                                                    initial={{
                                                        opacity: 0,
                                                        x: -10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    transition={{
                                                        delay: 0.7 + idx * 0.05,
                                                    }}
                                                    className="flex items-start gap-3">
                                                    <span
                                                        className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${selected.gradient} flex-shrink-0 mt-2`}
                                                    />
                                                    <span className="text-gray-300 text-sm">
                                                        {item}
                                                    </span>
                                                </motion.li>
                                            ))}
                                        {selected.outcome.length > 4 && (
                                            <li className="text-gray-400 text-xs italic pt-2">
                                                +{selected.outcome.length - 4}{" "}
                                                more benefits
                                            </li>
                                        )}
                                    </ul>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-20 pt-12 border-t border-white/10 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Ready to Transform Your Blockchain Career?
                    </h3>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of learners already mastering blockchain,
                        crypto, and Web3 technologies
                    </p>
                    <motion.button
                        onClick={handleWhatsApp}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-8 py-4 bg-gradient-to-r ${selected?.gradient || "from-purple-500 to-pink-500"} hover:shadow-2xl hover:shadow-purple-500/50 text-white font-bold rounded-xl md:rounded-2xl flex items-center justify-center gap-2 mx-auto transition-all`}>
                        Get Started Now
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
