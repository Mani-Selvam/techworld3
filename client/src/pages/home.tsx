import { lazy, Suspense, useCallback } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SectionBubbles from "@/components/SectionBubbles";
import { ScrollReveal } from "@/components/ScrollReveal";

const LimitedOfferBanner = lazy(() => import("@/components/LimitedOfferBanner"));
const Statistics = lazy(() => import("@/components/Statistics"));
const Review = lazy(() => import("@/components/Review"));
const PhotoGallery = lazy(() => import("@/components/PhotoGallery"));
const DesignLancerAbout = lazy(() => import("@/components/DesignLancerAbout"));
const Skills = lazy(() => import("@/components/Skills"));
const Whatwedo = lazy(() => import("@/components/Whatwedo"));
const Visitors = lazy(() => import("@/components/Visitors"));
const Features = lazy(() => import("@/components/Features"));
const Attendees = lazy(() => import("@/components/Attendees"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const CountdownTimer = lazy(() => import("@/components/CountdownTimer"));
const Footer = lazy(() => import("@/components/Footer"));
const StickyBottomBanner = lazy(() => import("@/components/StickyBottomBanner"));

// ✅ Bubbles only on desktop — one place, not everywhere
const DesktopBubbles = ({ count }: { count: number }) => (
    <div className="hidden md:block">
        <SectionBubbles count={count} />
    </div>
);

function HomeContent() {
    // ✅ One stable callback for all three LimitedOfferBanner instances
    const scrollToEnrollment = useCallback(() => {
        document
            .getElementById("enrollment-form")
            ?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // ✅ Kept separate since it targets a different section
    const scrollToAttendees = useCallback(() => {
        document
            .getElementById("attendees")
            ?.scrollIntoView({ behavior: "smooth" });
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navigation />

            {/* Hero — bubbles here matter most visually, keep them */}
            <div className="relative" id="hero">
                <SectionBubbles count={5} />
                <Hero />
            </div>

            <Suspense fallback={<div className="h-16" />}>
                <LimitedOfferBanner onCtaClick={scrollToEnrollment} />
            </Suspense>

            <ScrollReveal variant="fade-up" duration={800} delay={100}>
                {/* ✅ No bubbles on most sections — saves ~50 animated nodes */}
                <div className="relative cv-section" id="statistics">
                    <Suspense fallback={<div className="h-48" />}>
                        <Statistics />
                    </Suspense>
                </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" duration={800} delay={200}>
                <div className="relative cv-section" id="gallery">
                    <DesktopBubbles count={4} />
                    <Suspense fallback={<div className="h-64" />}>
                        <PhotoGallery />
                    </Suspense>
                </div>
            </ScrollReveal>

            {/* ✅ Fixed: unique id "review" (was duplicating "about") */}
            <ScrollReveal variant="fade-up" duration={800} delay={200}>
                <div className="relative cv-section" id="review">
                    <Suspense fallback={<div className="h-96" />}>
                        <Review />
                    </Suspense>
                </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" duration={800} delay={200}>
                <div className="relative cv-section" id="about">
                    <Suspense fallback={<div className="h-96" />}>
                        <DesignLancerAbout />
                    </Suspense>
                </div>
            </ScrollReveal>

            <ScrollReveal variant="slide-left" duration={900} delay={150}>
                <div className="relative cv-section" id="benefit">
                    <DesktopBubbles count={4} />
                    <Suspense fallback={<div className="h-96" />}>
                        <Skills />
                    </Suspense>
                </div>
            </ScrollReveal>

            <Suspense fallback={<div className="h-16" />}>
                <LimitedOfferBanner onCtaClick={scrollToEnrollment} />
            </Suspense>

            <ScrollReveal variant="slide-right" duration={800} delay={100}>
                <div className="relative cv-section" id="courses">
                    <Suspense fallback={<div className="h-96" />}>
                        <Whatwedo />
                    </Suspense>
                </div>
            </ScrollReveal>

            <ScrollReveal variant="slide-right" duration={800} delay={100}>
                <div className="relative cv-section" id="visitors">
                    <Suspense fallback={<div className="h-96" />}>
                        <Visitors />
                    </Suspense>
                </div>
            </ScrollReveal>

            <ScrollReveal variant="slide-left" duration={800} delay={100}>
                <div className="relative cv-section" id="features">
                    <DesktopBubbles count={3} />
                    <Suspense fallback={<div className="h-80" />}>
                        <Features />
                    </Suspense>
                </div>
            </ScrollReveal>

            <Suspense fallback={<div className="h-16" />}>
                <LimitedOfferBanner onCtaClick={scrollToEnrollment} />
            </Suspense>

            <ScrollReveal variant="fade-up" duration={800} delay={200}>
                <div className="relative cv-section" id="attendees">
                    <Suspense fallback={<div className="h-96" />}>
                        <Attendees />
                    </Suspense>
                </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" duration={800} delay={200}>
                <div className="relative cv-section" id="testimonials">
                    <Suspense fallback={<div className="h-96" />}>
                        <Testimonials />
                    </Suspense>
                </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" duration={800} delay={200}>
                <div className="relative cv-section" id="timer">
                    <Suspense fallback={<div className="h-96" />}>
                        <CountdownTimer onRegisterClick={scrollToAttendees} />
                    </Suspense>
                </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-in" duration={600} delay={100}>
                <div className="cv-section">
                    <Suspense fallback={<div className="h-64" />}>
                        <Footer />
                    </Suspense>
                </div>
            </ScrollReveal>

            {/* ✅ Replaced <br><br><br> with proper bottom padding */}
            <div className="pb-24" />
            <Suspense fallback={null}>
                <StickyBottomBanner />
            </Suspense>
        </div>
    );
}

export default function Home() {
    return <HomeContent />;
}
