import { useEffect, useState } from "react";
import { FaInstagram, FaWhatsapp, FaGlobe } from "react-icons/fa";

export default function TopLinearIcons() {
    const [isVisible, setIsVisible] = useState(false);
    const [screenSize, setScreenSize] = useState({
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
    });

    useEffect(() => {
        setIsVisible(true);

        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Responsive radius based on screen size
    const getRadius = () => {
        if (screenSize.width < 480) return 90; // Small mobile
        if (screenSize.width < 768) return 110; // Mobile
        return 140; // Desktop
    };

    // Responsive icon sizes based on screen size
    const getIconSize = (baseSize) => {
        if (screenSize.width < 480) return baseSize * 0.7; // Small mobile
        if (screenSize.width < 768) return baseSize * 0.85; // Mobile
        return baseSize; // Desktop
    };

    const icons = [
        {
            icon: <FaGlobe color="#1DA1F2" />,
            href: "https://techara.in/",
            title: "Explore Techara",
            position: "9", // 9 o'clock position
            size: 70, // Base size for 9 o'clock position
        },
        {
            icon: <FaInstagram color="#E1306C" />,
            href: "https://www.instagram.com/web3_sindhu",
            title: "Follow @web3_sindhu",
            position: "8", // 8 o'clock position
            size: 65, // Base size for 8 o'clock position
        },
        {
            icon: <FaWhatsapp color="#25D366" />,
            href: "https://wa.me/8056880222",
            title: "Book Consultation",
            position: "7", // 7 o'clock position
            size: 56, // Base size for 7 o'clock position
        },
    ];

    // Calculate position based on clock position
    const getPositionClasses = (position) => {
        // Convert clock position to angle (12 o'clock = -90°, 3 o'clock = 0°, 6 o'clock = 90°, 9 o'clock = 180°)
        const angle = (parseInt(position) - 3) * 30;

        // Calculate x and y coordinates with responsive radius
        const radius = getRadius();
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return {
            left: `calc(50% + ${x}px)`,
            top: `calc(50% + ${y}px)`,
            transform: "translate(-50%, -50%)",
        };
    };

    const getRotationAngle = (position) => {
        // Calculate angle from icon to center (opposite direction)
        const angle = (parseInt(position) - 3) * 30;
        return `${angle + 180}deg`; // Point toward center
    };

    // Determine tooltip position based on icon position
    const getTooltipPosition = (position) => {
        // For 9 and 8 o'clock positions, show tooltip on the left
        if (position === "9" || position === "8") {
            return {
                position: "right-full mr-3 top-1/2 -translate-y-1/2",
                arrow: "absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-black/90 border-t-4 border-t-transparent border-b-4 border-b-transparent",
            };
        }
        // For other positions, show at bottom
        return {
            position: "bottom-full mb-3 left-1/2 -translate-x-1/2",
            arrow: "absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-b-8 border-b-black/90 border-l-4 border-l-transparent border-r-4 border-r-transparent",
        };
    };

    // Responsive container size
    const getContainerSize = () => {
        if (screenSize.width < 480) return "w-60 h-60"; // Small mobile
        if (screenSize.width < 768) return "w-72 h-72"; // Mobile
        return "w-80 h-80 md:w-96 md:h-96"; // Desktop
    };

    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
            {/* Central area reference (invisible) */}
            <div className={`relative ${getContainerSize()}`}>
                {/* Icons positioned around the center */}
                {icons.map((item, index) => {
                    const responsiveSize = getIconSize(item.size);
                    const tooltipPosition = getTooltipPosition(item.position);

                    return (
                        <div
                            key={index}
                            className={`absolute pointer-events-auto transition-all duration-700 ${
                                isVisible
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-50"
                            }`}
                            style={{
                                ...getPositionClasses(item.position),
                                transitionDelay: `${index * 200}ms`,
                            }}>
                            <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group relative flex items-center justify-center ${item.bgColor} 
                        text-white rounded-full shadow-lg 
                        hover:scale-110 transition-all duration-300 
                        hover:shadow-lg`}
                                style={{
                                    width: `${responsiveSize}px`,
                                    height: `${responsiveSize}px`,
                                    fontSize: `${responsiveSize * 0.43}px`, // Scale font proportionally
                                }}>
                                {item.icon}

                                {/* Tooltip Container */}
                                <div
                                    className={`absolute ${tooltipPosition.position} 
                               bg-black/90 backdrop-blur-sm text-white rounded-md 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10`}>
                                    {/* Tooltip Arrow */}
                                    <div
                                        className={tooltipPosition.arrow}></div>

                                    {/* Tooltip Text */}
                                    <span
                                        className={`${
                                            screenSize.width < 480
                                                ? "text-xs px-2 py-1"
                                                : "text-xs px-3 py-1.5"
                                        } block`}>
                                        {item.title}
                                    </span>
                                </div>

                                {/* Decorative ring that appears on hover */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-40 scale-150 blur-md"></div>

                                {/* Connecting line to center (decorative) */}
                                <div
                                    className="absolute top-1/2 left-1/2 h-0.5 bg-gradient-to-r from-purple-500/30 to-transparent origin-left"
                                    style={{
                                        width: `${getRadius() * 0.6}px`,
                                        transform: `translate(-100%, -50%) rotate(${getRotationAngle(
                                            item.position
                                        )})`,
                                    }}></div>
                            </a>
                        </div>
                    );
                })}
            </div>

            {/* Optional: Add a subtle center indicator */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-pink-500/50 rounded-full animate-pulse"></div>
        </div>
    );
}
