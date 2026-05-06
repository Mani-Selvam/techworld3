import { lazy, Suspense, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAnimationDefer } from "@/hooks/useAnimationDefer";
import { useCarousel } from "@/hooks/useCarousel";
import { useWhatsAppMessage } from "@/hooks/useWhatsAppMessage";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import { AcademyHeroBackground } from "@/components/AcademyHeroBackground";
import { AcademyHeroContent } from "@/components/AcademyHeroContent";
import { AcademyHeroGallery } from "@/components/AcademyHeroGallery";
import {
    ACADEMY_CAROUSEL_IMAGES,
    ACADEMY_FLOATING_IMAGES,
    preloadAcademyImages,
} from "@/constants/academy";
import { ScrollReveal } from "@/components/ScrollReveal";
import LimitedOfferBanner from "@/components/LimitedOfferBanner";
import StickyBottomBanner from "@/components/StickyBottomBanner";

import Ecosystem from "@/components/Ecosystem";
import Career from "@/components/Career";
import CertificationPrograms from "@/components/CertificationPrograms";
import CryptoDigitalAssetProgram from "@/components/CryptoDigitalAssetProgram";

export default function Academy() {
    const animationsEnabled = useAnimationDefer(1500);
    const carouselIndex = useCarousel(
        ACADEMY_CAROUSEL_IMAGES,
        animationsEnabled,
    );
    const { sendWorkshopMessage, sendConsultationMessage } =
        useWhatsAppMessage();
    const { isLowEnd, slowConnection, saveData } = useDeviceCapability();

    // Preload all hero images immediately on mount so the floating cards and
    // carousel slides appear on first paint instead of popping in 2-3s later.
    // These images are the hero content, so they must not wait for idle time.
    // On data-saver / very slow connections we skip the extra preload hints
    // (the <img> tags themselves are still eager-loaded).
    useEffect(() => {
        if (saveData || slowConnection) return;
        preloadAcademyImages();
    }, [saveData, slowConnection]);

    return (
        <>
            <Navigation />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
                <AcademyHeroBackground animationsEnabled={animationsEnabled} />

                <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-20">
                    <div className="min-h-screen flex items-center">
                        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 w-full">
                            <AcademyHeroContent
                                animationsEnabled={animationsEnabled}
                                onWorkshopClick={sendWorkshopMessage}
                                onConsultationClick={sendConsultationMessage}
                            />

                            <AcademyHeroGallery
                                animationsEnabled={animationsEnabled}
                                floatingImages={ACADEMY_FLOATING_IMAGES}
                                carouselImages={ACADEMY_CAROUSEL_IMAGES}
                                carouselIndex={carouselIndex}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Lazy Loaded Sections */}
            <Suspense fallback={<div className="h-96" />}>
                <LimitedOfferBanner />
            </Suspense>
            <Suspense fallback={<div className="h-96" />}>
                <Ecosystem />
            </Suspense>
            <Suspense fallback={<div className="h-96" />}>
                <Career />
            </Suspense>
            <Suspense fallback={<div className="h-96" />}>
                <CertificationPrograms />
            </Suspense>
            <Suspense fallback={<div className="h-96" />}>
                <CryptoDigitalAssetProgram />
            </Suspense>

            <Footer />
            <br />
            <br />
            <br />
            <StickyBottomBanner />
        </>
    );
}
