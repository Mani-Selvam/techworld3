import imgClass from "@assets/bitcoin.jpg";
import imgDev from "@assets/crypto.jpg";
import imgTeam from "@assets/nft.jpeg";
import imgMetaverse from "@assets/vr.jpg";
import imgCode from "@assets/Web.jpg";

/**
 * Carousel images for academy hero
 */
export const ACADEMY_CAROUSEL_IMAGES = [
    { src: imgClass, label: "Blockchain" },
    { src: imgDev, label: "Smart Contracts" },
    { src: imgTeam, label: "Team Learning" },
    { src: imgMetaverse, label: "Metaverse" },
    { src: imgCode, label: "Web3 Dev" },
];

/**
 * Floating gallery images configuration
 */
export const ACADEMY_FLOATING_IMAGES = [
    {
        src: imgClass,
        alt: "Blockchain",
        label: "Blockchain",
        position: "top-right" as const,
        size: { width: "w-28 sm:w-36 md:w-40", height: "h-32 sm:h-44 md:h-48" },
        duration: 4,
    },
    {
        src: imgMetaverse,
        alt: "Metaverse",
        label: "Metaverse",
        position: "top-left" as const,
        size: { width: "w-32 sm:w-40 md:w-48", height: "h-28 sm:h-40 md:h-44" },
        duration: 4.5,
    },
    {
        src: imgTeam,
        alt: "Team Learning",
        label: "Team Learning",
        position: "bottom-left" as const,
        size: { width: "w-32 sm:w-40 md:w-48", height: "h-28 sm:h-40 md:h-44" },
        duration: 4.5,
    },
    {
        src: imgCode,
        alt: "Web3 Dev",
        label: "Web3 Dev",
        position: "bottom-right" as const,
        size: { width: "w-32 sm:w-40 md:w-48", height: "h-28 sm:h-40 md:h-44" },
        duration: 4.5,
    },
];

/**
 * Preload critical images for faster loading
 * Images are loaded in background to ensure page completion
 */
export function preloadAcademyImages() {
    const allImages = [imgClass, imgDev, imgTeam, imgMetaverse, imgCode];

    allImages.forEach((img) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = img;
        document.head.appendChild(link);
    });
}
