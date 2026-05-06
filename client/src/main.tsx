// Safe PWA check — avoids InvalidStateError in iframes
// (Vite uses import.meta.env.* on the client)
if (import.meta.env.PROD && window.self === window.top) {
    (navigator as any).getInstalledRelatedApps?.().catch(() => {});
}

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

/*
 * Global scroll-perf helper: toggles `is-scrolling` on <body> while the user
 * is actively scrolling. CSS uses this to suspend transitions and
 * backdrop-blur during scroll bursts, eliminating jank on mobile.
 * Passive listener + rAF + idle timeout = essentially free on the main thread.
 */
(() => {
    if (typeof window === "undefined") return;
    let scrolling = false;
    let timer: number | undefined;
    let rafId = 0;
    const idleMs = 140;

    const onScroll = () => {
        if (!scrolling) {
            scrolling = true;
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                document.body.classList.add("is-scrolling");
            });
        }
        if (timer) window.clearTimeout(timer);
        timer = window.setTimeout(() => {
            scrolling = false;
            document.body.classList.remove("is-scrolling");
        }, idleMs);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
})();
