import { useState } from "react";
import { motion } from "framer-motion";
import {
    Zap,
    TrendingUp,
    Shield,
    Wallet,
    BarChart3,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    BookOpen,
    Award,
} from "lucide-react";

export default function CryptoDigitalAssetProgram() {
    const [activeTab, setActiveTab] = useState<number>(0);

    const handleCryptoWhatsApp = () => {
        const whatsappNumber = "+919345791995";
        const whatsappMessage = `Hi 👋 I'm interested in the "Certified Cryptocurrency & Digital Asset Strategist" program (₹45,000/-). Please share the curriculum, schedule, and batch details. 🚀`;
        const url = `https://wa.me/${whatsappNumber.replace(/\s/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(url, "_blank");
    };

    interface TabType {
        id: number;
        name: string;
        icon: any;
        items: string[];
    }

    const tabs: TabType[] = [
        {
            id: 0,
            name: "Core Learning",
            icon: BookOpen,
            items: [
                "How crypto works: wallets, exchanges, orders",
                "How to buy, hold, manage, and track digital assets",
                "Risk management & scam-avoidance methods",
            ],
        },
        {
            id: 1,
            name: "Hands-On Practice",
            icon: Sparkles,
            items: [
                "Wallet setup (hot, cold & mobile)",
                "Exchange navigation (spot, basic trading)",
                "Portfolio building (long-term & diversified)",
                "Entry–exit planning strategies",
                "Understanding market cycles, charts & fundamentals",
            ],
        },
        {
            id: 2,
            name: "Outcomes",
            icon: Award,
            items: [
                "Confidence using wallets & exchanges safely",
                "Ability to create simple and stable crypto portfolios",
                "Knowledge to identify scams & avoid losses",
                "Clear decision-making on when to buy, hold & sell",
                "Professional certification for career or investment credibility",
            ],
        },
    ];

    interface WhoJoinType {
        icon: any;
        text: string;
    }

    const whoShouldJoin: WhoJoinType[] = [
        { icon: Zap, text: "Students & beginners wanting safe crypto knowledge" },
        { icon: TrendingUp, text: "Working professionals building investment skills" },
        { icon: Wallet, text: "Entrepreneurs exploring digital asset opportunities" },
        { icon: Shield, text: "Anyone who wants to invest without falling for scams" },
    ];

    interface StatType {
        label: string;
        value: string;
        detail: string;
    }

    const stats: StatType[] = [
        { label: "Program Duration", value: "1 Month", detail: "36 Hours" },
        { label: "Difficulty Level", value: "Beginner", detail: "No Coding" },
        { label: "Learning Format", value: "Live & Self-paced", detail: "Flexible" },
        { label: "Investment", value: "₹45,000/-", detail: "Save 35%" },
    ];

    const ImportIcon = tabs[activeTab]?.icon || Wallet;

    return (
        <section className="relative py-20 md:py-32 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0a1a2e 0%, #0f3460 25%, #16213e 50%, #0f3460 75%, #0a1a2e 100%)" }} />
                <motion.div className="absolute top-40 right-1/4 w-80 h-80 bg-emerald-900/20 rounded-full filter blur-3xl" animate={{ y: [0, 30, 0] }} transition={{ duration: 8, repeat: Infinity }} />
                <motion.div className="absolute bottom-40 left-1/3 w-96 h-96 bg-green-900/15 rounded-full filter blur-3xl" animate={{ y: [0, -30, 0] }} transition={{ duration: 10, repeat: Infinity }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-20">
                    <div className="inline-block mb-4">
                        <span className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-sm font-bold uppercase tracking-wider">
                            🌍 Investment-Focused Program
                        </span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                        Certified Cryptocurrency &
                        <br />
                        <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-300 bg-clip-text text-transparent">
                            Digital Asset Strategist
                        </span>
                    </h2>

                    <p className="text-lg text-gray-300 max-w-3xl">
                        Master the art of crypto investing with real-world strategies, risk management, and scam-avoidance techniques. Build wealth safely and confidently.
                    </p>
                </motion.div>

                {/* Key Stats Row */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="mb-20 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-emerald-500/30 hover:bg-white/10 transition-all group"
                        >
                            <p className="text-gray-400 text-xs uppercase mb-1 group-hover:text-emerald-300 transition-colors">{stat.label}</p>
                            <p className="text-white font-bold text-lg mb-0.5">{stat.value}</p>
                            <p className="text-gray-500 text-xs">{stat.detail}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Left: Pricing & Quick Info */}
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                        {/* Pricing Section */}
                        <div className="mb-8">
                            <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-4 font-bold">Program Investment</h3>
                            <div className="flex items-baseline gap-3 mb-6">
                                <span className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                                    ₹45,000/-
                                </span>
                                <span className="text-gray-400 line-through">₹70,000/-</span>
                            </div>
                            <p className="text-emerald-300 font-semibold mb-6">💰 Limited Time: Save 35% today! (₹25,000 off)</p>

                            <motion.button
                                onClick={handleCryptoWhatsApp}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-2xl hover:shadow-emerald-500/50 text-lg"
                            >
                                Enroll & Start Learning
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Who Should Join */}
                        <div>
                            <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-6 font-bold">Perfect For</h3>
                            <div className="space-y-4">
                                {whoShouldJoin.map((item, idx) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex gap-4 items-start"
                                        >
                                            <div className="p-2 rounded-lg bg-emerald-500/20 flex-shrink-0 mt-1">
                                                <Icon className="w-4 h-4 text-emerald-400" />
                                            </div>
                                            <p className="text-gray-300 text-sm">{item.text}</p>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Content Tabs */}
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
                        {/* Tab Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 mb-8">
                            {tabs.map((tab: TabType, idx: number) => {
                                const TabIcon = tab.icon;
                                return (
                                    <motion.button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 md:px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                                            activeTab === tab.id
                                                ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/50"
                                                : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                                        }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <TabIcon className="w-4 h-4" />
                                        <span className="hidden sm:inline">{tab.name}</span>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Tab Content */}
                        <div className="relative">
                            {tabs.map((tab, idx) => (
                                <motion.div
                                    key={tab.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: activeTab === tab.id ? 1 : 0, y: activeTab === tab.id ? 0 : 10 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className={`${activeTab !== tab.id ? "absolute inset-0 pointer-events-none" : ""}`}
                                >
                                    <div className="space-y-3">
                                        {tab.items.map((item, itemIdx) => (
                                            <motion.div
                                                key={itemIdx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: itemIdx * 0.05 }}
                                                className="flex gap-4 items-start p-3 rounded-lg bg-white/5 border border-white/5 hover:border-emerald-400/30 hover:bg-white/10 transition-all group"
                                            >
                                                <div className="mt-1">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 group-hover:text-emerald-300" />
                                                </div>
                                                <p className="text-gray-200 text-sm leading-relaxed">{item}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Feature Highlights Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="mb-20">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-12 text-center">Why Choose This Program?</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: "Scam Protection",
                                description: "Learn to identify and avoid crypto scams, frauds, and investment traps with real-world examples.",
                            },
                            {
                                icon: BarChart3,
                                title: "Portfolio Building",
                                description: "Master the art of creating diversified, stable crypto portfolios that weather market volatility.",
                            },
                            {
                                icon: Zap,
                                title: "Fast-Track Learning",
                                description: "Complete your certification in just 1 month with structured, action-oriented curriculum.",
                            },
                        ].map((feature, idx) => {
                            const FIcon = feature.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative"
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-green-400 opacity-0 group-hover:opacity-20 blur transition duration-300 rounded-xl" />
                                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:border-emerald-400/50 transition-all">
                                        <motion.div className="inline-block p-3 rounded-lg bg-emerald-500/20 mb-4" whileHover={{ scale: 1.1, rotate: 5 }}>
                                            <FIcon className="w-6 h-6 text-emerald-400" />
                                        </motion.div>
                                        <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-center pt-12 border-t border-white/10">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Master Crypto Investing?</h3>
                    <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join hundreds of students learning to invest safely and build their crypto portfolio with confidence
                    </p>

                    <motion.button
                        onClick={handleCryptoWhatsApp}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold rounded-xl flex items-center justify-center gap-2 mx-auto transition-all shadow-lg hover:shadow-2xl hover:shadow-emerald-500/50"
                    >
                        Get Started Today
                        <ArrowRight className="w-5 h-5" />
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
