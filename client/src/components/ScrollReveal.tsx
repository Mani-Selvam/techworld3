import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
    children: ReactNode;
    variant?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale-up";
    duration?: number;
    delay?: number;
    className?: string;
    threshold?: number;
    rootMargin?: string;
    as?: keyof JSX.IntrinsicElements; // Add this to allow custom element types
}

export function ScrollReveal({
    children,
    variant = "fade-up",
    duration = 600,
    delay = 0,
    className,
    threshold = 0.1,
    rootMargin = "0px 0px -50px 0px",
    as: Component = "div", // Default to div, but allow customization
}: ScrollRevealProps) {
    const { elementRef, isVisible } = useScrollReveal({
        threshold,
        rootMargin,
    });

    const getVariantClasses = () => {
        const baseClasses = "transition-all ease-out";

        switch (variant) {
            case "fade-up":
                return cn(
                    baseClasses,
                    "transform",
                    isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                );
            case "fade-in":
                return cn(baseClasses, isVisible ? "opacity-100" : "opacity-0");
            case "slide-left":
                return cn(
                    baseClasses,
                    "transform",
                    isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-8"
                );
            case "slide-right":
                return cn(
                    baseClasses,
                    "transform",
                    isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-8"
                );
            case "scale-up":
                return cn(
                    baseClasses,
                    "transform",
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                );
            default:
                return baseClasses;
        }
    };

    const style = {
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        willChange: isVisible ? "auto" : "transform, opacity",
    };

    return (
        <Component
            ref={elementRef}
            className={cn(getVariantClasses(), className)}
            style={style}>
            {children}
        </Component>
    );
}
