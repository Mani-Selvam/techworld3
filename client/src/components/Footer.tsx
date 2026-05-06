// client/src/components/Footer.tsx
import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import LimitedOfferBanner from "@/components/LimitedOfferBanner";
import { Button } from "@/components/ui/button";
import {
    GraduationCap,
    Mail,
    Phone,
    MapPin,
    ArrowUp,
    Send,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Globe,
    Calendar,
    Clock,
    Users,
    Sparkles,
} from "lucide-react";
import techaraLogo from "@/assets/techara-logo.png";
import { motion } from "framer-motion";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    useEffect(() => {
        // rAF-throttled scroll listener that only triggers a state update
        // when crossing the 200px threshold — avoids re-renders on every frame.
        let ticking = false;
        let lastShown = window.scrollY > 200;
        setShowBackToTop(lastShown);

        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const shouldShow = window.scrollY > 200;
                if (shouldShow !== lastShown) {
                    lastShown = shouldShow;
                    setShowBackToTop(shouldShow);
                }
                ticking = false;
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setTimeout(() => setIsSubscribed(false), 3000);
            setEmail("");
        }
    };

    const quickLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/#about" },
        { name: "Skills", href: "/#benefit" },
        { name: "What We Do", href: "/#courses" },
        { name: "Features", href: "/#features" },
        { name: "Attendees", href: "/#attendees" },
    ];

    const resources = [
        { name: "Blockchain Basics" },
        { name: "Crypto Trading" },
        { name: "Web3 Development" },
        { name: "NFT Guide" },
        { name: "DeFi Protocols" },
        { name: "Career Opportunities" },
    ];

    const socialLinks = [
        {
            icon: Instagram,
            href: "https://www.instagram.com/web3_sindhu?igsh=dDk1YmM0a296djh2",
            label: "Instagram",
        },
        {
            icon: Linkedin,
            href: "https://www.linkedin.com/in/sindhu-harisakthi-92b668141/",
            label: "LinkedIn",
        },
    ];

    return (
        <footer
            className="relative bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white overflow-hidden"
            id="contact">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
            </div>

            {/* Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Newsletter Section */}
                <br /> <br />
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold">TechARA</span>
                        </div>
                        <p className="text-gray-300 max-w-md">
                            The world's leading blockchain, crypto & Web3
                            academy. Empowering the next generation of Web3
                            innovators with cutting-edge education and practical
                            skills.
                        </p>

                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => {
                                const IconComponent = social.icon;
                                return (
                                    <a
                                        key={index}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-110">
                                        <IconComponent className="w-5 h-5 text-white" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-6 text-purple-300">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center">
                                        <span className="w-1 h-1 bg-purple-400 rounded-full mr-3"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-6 text-purple-300">
                            Resources
                        </h3>
                        <ul className="space-y-3">
                            {resources.map((resource, index) => (
                                <li
                                    key={index}
                                    className="text-gray-300 flex items-center">
                                    <span className="w-1 h-1 bg-purple-400 rounded-full mr-3"></span>
                                    {resource.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-6 text-purple-300">
                            Contact Us
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <Mail className="w-5 h-5 text-purple-400 mr-3 mt-0.5" />
                                <a
                                    href="mailto:info@techara.in"
                                    className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    info@techara.in
                                </a>
                            </li>
                            <li className="flex items-start">
                                <Phone className="w-5 h-5 text-purple-400 mr-3 mt-0.5" />
                                <a
                                    href="https://wa.me/918056880222"
                                    className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    +91 80568 80222
                                </a>
                            </li>
                            <li className="flex items-start">
                                <MapPin className="w-5 h-5 text-purple-400 mr-3 mt-0.5" />
                                <a
                                    href="https://maps.app.goo.gl/PUhSJUmoXi4DL7oB7"
                                    className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    Erode, Tamilnadu
                                </a>
                            </li>
                            <li className="flex items-start">
                                <Globe className="w-5 h-5 text-purple-400 mr-3 mt-0.5" />
                                <a
                                    href="https://www.techara.in"
                                    className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    www.techara.in
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* Event Info */}
                <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 mb-12">
                    <LimitedOfferBanner
                        onCtaClick={() => {
                            const enrollmentSection =
                                document.getElementById("enrollment-form");
                            if (enrollmentSection) {
                                enrollmentSection.scrollIntoView({
                                    behavior: "smooth",
                                });
                            }
                        }}
                    />
                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="flex flex-col items-center">
                            <Calendar className="w-8 h-8 text-purple-400 mb-2" />
                            <h4 className="font-semibold text-white mb-1">
                                Weekly Sessions
                            </h4>
                            <p className="text-gray-300 text-sm">
                                Every Saturday
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <Clock className="w-8 h-8 text-purple-400 mb-2" />
                            <h4 className="font-semibold text-white mb-1">
                                Session Time
                            </h4>
                            <p className="text-gray-300 text-sm">
                                19:00 – 20:30 IST
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <Users className="w-8 h-8 text-purple-400 mb-2" />
                            <h4 className="font-semibold text-white mb-1">
                                Community
                            </h4>
                            <p className="text-gray-300 text-sm">
                                500+ Learners
                            </p>
                        </div>
                    </div> */}
                </div>
                {/* Footer Bottom */}
                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm mb-4 md:mb-0">
                            &copy; 2025 TechAra. All rights reserved.
                        </p>
                        <div className="flex space-x-6 text-sm">
                            <Link
                                href="#"
                                className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                                Privacy Policy
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                                Terms of Service
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Top Button */}
            {showBackToTop && (
                <motion.button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-xl z-[9999] border border-white/20"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    whileHover={{
                        scale: 1.1,
                        boxShadow: "0 10px 25px rgba(168, 85, 247, 0.4)",
                    }}
                    whileTap={{ scale: 0.9 }}>
                    <ArrowUp className="w-6 h-6 text-white" />
                    <span className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
                </motion.button>
            )}
        </footer>
    );
}
