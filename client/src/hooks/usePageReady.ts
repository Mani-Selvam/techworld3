import { useEffect, useState } from "react";

/**
 * Tracks when the page is fully ready to display.
 * - Ready immediately if the document already finished loading
 * - Otherwise waits for `DOMContentLoaded` / `load`
 * - Optional minimum display time (default 0 = no artificial delay)
 * - Hard fallback so the loader never sticks forever
 */
export function usePageReady(minDisplayTimeMs: number = 0): boolean {
    const [isReady, setIsReady] = useState<boolean>(() => {
        // Sync init: if the document is already done, no spinner at all
        if (typeof document !== "undefined") {
            return document.readyState === "complete" && minDisplayTimeMs === 0;
        }
        return false;
    });

    useEffect(() => {
        if (isReady) return;

        let mounted = true;
        const startTime = Date.now();

        const makeReady = () => {
            if (!mounted) return;
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, minDisplayTimeMs - elapsed);
            if (remaining > 0) {
                setTimeout(() => {
                    if (mounted) setIsReady(true);
                }, remaining);
            } else {
                setIsReady(true);
            }
        };

        // If already loaded, fire immediately
        if (
            document.readyState === "complete" ||
            document.readyState === "interactive"
        ) {
            makeReady();
        }

        const handleLoad = () => makeReady();
        const handleDOMReady = () => makeReady();
        const handleStateChange = () => {
            if (
                document.readyState === "complete" ||
                document.readyState === "interactive"
            ) {
                makeReady();
            }
        };

        window.addEventListener("load", handleLoad);
        window.addEventListener("DOMContentLoaded", handleDOMReady);
        document.addEventListener("readystatechange", handleStateChange);

        // Hard safety net — never let the loader stay longer than 2s
        const fallbackTimer = setTimeout(makeReady, 2000);

        return () => {
            mounted = false;
            clearTimeout(fallbackTimer);
            window.removeEventListener("load", handleLoad);
            window.removeEventListener("DOMContentLoaded", handleDOMReady);
            document.removeEventListener("readystatechange", handleStateChange);
        };
    }, [minDisplayTimeMs, isReady]);

    return isReady;
}
