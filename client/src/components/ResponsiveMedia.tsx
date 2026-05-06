import { cn } from "@/lib/utils";
import { CSSProperties, useState } from "react";

interface ResponsiveMediaProps {
    src: string;
    alt: string;
    className?: string;
    srcset?: string;
    sizes?: string;
    loading?: "lazy" | "eager";
    fetchpriority?: "high" | "low" | "auto";
    decoding?: "async" | "sync" | "auto";
    aspectRatio?: "square" | "video" | "auto";
    objectFit?: "contain" | "cover" | "fill";
    maxHeight?: string;
    width?: number;
    height?: number;
    style?: CSSProperties;
    placeholder?: "none" | "shimmer";
    "data-testid"?: string;
}

export function ResponsiveMedia({
    src,
    alt,
    className,
    srcset,
    sizes = "100vw",
    loading = "lazy",
    fetchpriority,
    decoding = "async",
    aspectRatio = "auto",
    objectFit = "contain",
    maxHeight,
    width,
    height,
    style,
    placeholder = "none",
    "data-testid": dataTestId,
}: ResponsiveMediaProps) {
    const [loaded, setLoaded] = useState(false);

    const aspectRatioClasses = {
        square: "aspect-square",
        video: "aspect-video",
        auto: "",
    };

    const objectFitClasses = {
        contain: "object-contain",
        cover: "object-cover",
        fill: "object-fill",
    };

    const imgClassName = cn(
        "max-w-full h-auto",
        aspectRatioClasses[aspectRatio],
        objectFitClasses[objectFit],
        placeholder === "shimmer" &&
            "transition-opacity duration-500 ease-out",
        placeholder === "shimmer" && (loaded ? "opacity-100" : "opacity-0"),
        className,
    );

    const imgProps: any = {
        src,
        alt,
        loading,
        decoding,
        sizes,
        className: imgClassName,
        style: maxHeight ? { maxHeight, ...style } : style,
        "data-testid": dataTestId,
        onLoad: () => setLoaded(true),
        onError: () => setLoaded(true),
    };

    if (srcset) imgProps.srcSet = srcset;
    if (width) imgProps.width = width;
    if (height) imgProps.height = height;
    if (fetchpriority) imgProps.fetchpriority = fetchpriority;

    if (placeholder !== "shimmer") {
        return <img {...imgProps} />;
    }

    // Shimmer wrapper: keeps layout, shows a subtle moving gradient until the image loads
    const imgOnlyProps = { ...imgProps };
    delete imgOnlyProps.className;
    delete imgOnlyProps.style;

    return (
        <div
            className={cn(
                "relative overflow-hidden",
                aspectRatioClasses[aspectRatio],
                className,
            )}
            style={style}
        >
            {!loaded && (
                <div
                    aria-hidden="true"
                    className="absolute inset-0 rm-shimmer"
                />
            )}
            <img
                {...imgOnlyProps}
                className={cn(
                    "absolute inset-0 w-full h-full",
                    objectFitClasses[objectFit],
                    "transition-opacity duration-500 ease-out",
                    loaded ? "opacity-100" : "opacity-0",
                )}
                style={maxHeight ? { maxHeight } : undefined}
            />
            <style>{`
                @keyframes rm-shimmer-anim {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .rm-shimmer {
                    background: linear-gradient(
                        90deg,
                        rgba(124, 58, 237, 0.08) 0%,
                        rgba(168, 85, 247, 0.18) 50%,
                        rgba(124, 58, 237, 0.08) 100%
                    );
                    background-size: 200% 100%;
                    animation: rm-shimmer-anim 1.4s ease-in-out infinite;
                }
                @media (prefers-reduced-motion: reduce) {
                    .rm-shimmer { animation: none; }
                }
            `}</style>
        </div>
    );
}
