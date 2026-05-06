import image1 from "@assets/Image 1.jpg";
import image2 from "@assets/image 2.jpg";
import image3 from "@assets/image 3.jpg";
import image4 from "@assets/image 4.jpg";
import image5 from "@assets/image 5.jpg";
import image6 from "@assets/image 6.jpeg";
import { useEffect, useRef, useState } from "react";

export default function PhotoGallery() {
    const images = [
        {
            src: image1,
            width: 960,
            height: 720,
            alt: "BNI Erode Beacon's 500th Week Celebration!",
        },
        {
            src: image2,
            width: 960,
            height: 720,
            alt: "I'm Overjoyed to Announce My Leadership Graduation!",
        },
        {
            src: image5,
            width: 910,
            height: 683,
            alt: "JCI India Installation Ceremony!",
        },
        {
            src: image4,
            width: 960,
            height: 720,
            alt: "VIP networking area at Blockchain Life",
        },
        {
            src: image3,
            width: 960,
            height: 720,
            alt: "BNI BeIcon Award Function and representing Blockchain Technology",
        },
        {
            src: image6,
            width: 960,
            height: 720,
            alt: "BNI BeIcon Award Function and representing Blockchain Technology",
        },
    ];

    // Duplicate images for seamless loop
    const duplicatedImages = [...images, ...images];
    const galleryRef = useRef<HTMLDivElement>(null);
    const [scrollSpeed, setScrollSpeed] = useState(15); // Default speed in seconds

    useEffect(() => {
        // Set scroll speed based on screen size
        const updateScrollSpeed = () => {
            if (window.innerWidth < 640) {
                setScrollSpeed(12); // Fast on mobile
            } else if (window.innerWidth < 1024) {
                setScrollSpeed(12); // Medium on tablet
            } else {
                setScrollSpeed(15); // Normal on desktop
            }
        };

        updateScrollSpeed();
        window.addEventListener("resize", updateScrollSpeed);
        return () => window.removeEventListener("resize", updateScrollSpeed);
    }, []);

    useEffect(() => {
        const gallery = galleryRef.current;
        if (!gallery) return;

        let animationId: number | null = null;
        let baseTimestamp = 0; // virtual elapsed time, preserved across pauses
        let lastFrame = 0;
        let isVisible = true;

        const animate = (timestamp: number) => {
            if (!lastFrame) lastFrame = timestamp;
            baseTimestamp += timestamp - lastFrame;
            lastFrame = timestamp;

            const totalWidth = gallery.scrollWidth / 2; // Half because we duplicated
            const progress =
                (baseTimestamp % (scrollSpeed * 1000)) / (scrollSpeed * 1000);
            const position = -totalWidth * progress;

            gallery.style.transform = `translate3d(${position}px, 0, 0)`;

            animationId = requestAnimationFrame(animate);
        };

        const start = () => {
            if (animationId == null) {
                lastFrame = 0;
                animationId = requestAnimationFrame(animate);
            }
        };
        const stop = () => {
            if (animationId != null) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        };

        // Only animate when the gallery is on-screen
        const io = new IntersectionObserver(
            (entries) => {
                isVisible = entries[0]?.isIntersecting ?? true;
                if (isVisible && !document.hidden) start();
                else stop();
            },
            { rootMargin: "100px" }
        );
        io.observe(gallery);

        const onVisibility = () => {
            if (document.hidden) stop();
            else if (isVisible) start();
        };
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            stop();
            io.disconnect();
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [scrollSpeed]);

    return (
        <section className="py-16 bg-background" id="gallery">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                    <div
                        ref={galleryRef}
                        className="flex space-x-4 sm:space-x-6 select-none"
                        style={{
                            touchAction: "none",
                            willChange: "transform",
                            backfaceVisibility: "hidden",
                        }}
                    >
                        {duplicatedImages.map((image, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 pointer-events-none"
                            >
                                <img
                                    src={image.src}
                                    width={320}
                                    height={240}
                                    sizes="(max-width: 640px) 240px, (max-width: 768px) 288px, (max-width: 1024px) 320px, 320px"
                                    alt={image.alt}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-60 sm:w-72 md:w-80 h-48 sm:h-56 md:h-60 object-cover rounded-lg transition-transform duration-1000"
                                    data-testid={`gallery-image-${index}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
