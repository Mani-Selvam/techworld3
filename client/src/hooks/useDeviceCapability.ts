import { useEffect, useState } from "react";

export interface DeviceCapability {
    isLowEnd: boolean;
    isMobile: boolean;
    prefersReducedMotion: boolean;
    saveData: boolean;
    slowConnection: boolean;
    /**
     * Multiplier (0..1) for decorative animations like floating bubbles.
     * 1.0 = full count on capable hardware
     * 0.6 = mid-range desktop / tablet — shed about 40% of bubbles
     * 0.4 = lower-mid — keep just a hint of motion
     * 0   = mobile / low-end / reduced-motion — no bubbles
     */
    bubbleScale: number;
}

function detect(): DeviceCapability {
    if (typeof window === "undefined") {
        return {
            isLowEnd: false,
            isMobile: false,
            prefersReducedMotion: false,
            saveData: false,
            slowConnection: false,
            bubbleScale: 1,
        };
    }

    const nav: any = navigator;
    const conn: any = nav.connection || nav.mozConnection || nav.webkitConnection;

    const cores = typeof nav.hardwareConcurrency === "number" ? nav.hardwareConcurrency : 8;
    const mem = typeof nav.deviceMemory === "number" ? nav.deviceMemory : 8;

    const effectiveType: string = conn?.effectiveType || "4g";
    const saveData: boolean = !!conn?.saveData;
    const slowConnection = saveData || /^(slow-2g|2g|3g)$/i.test(effectiveType);

    const isMobile =
        window.innerWidth < 768 ||
        /Mobile|Android|iPhone|iPad|iPod/i.test(nav.userAgent || "");

    const prefersReducedMotion = window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    // Treat as low-end if any signal indicates a weak device
    const isLowEnd =
        cores <= 4 ||
        mem <= 4 ||
        slowConnection ||
        prefersReducedMotion;

    // Adaptive bubble density based on hardware tier
    let bubbleScale = 1;
    if (isMobile || isLowEnd || prefersReducedMotion) {
        bubbleScale = 0;
    } else if (cores >= 8 && mem >= 8) {
        bubbleScale = 1; // capable desktop
    } else if (cores >= 6 || mem >= 6) {
        bubbleScale = 0.6; // mid-range desktop / strong tablet
    } else {
        bubbleScale = 0.4; // lower-mid
    }

    return {
        isLowEnd,
        isMobile,
        prefersReducedMotion,
        saveData,
        slowConnection,
        bubbleScale,
    };
}

export function useDeviceCapability(): DeviceCapability {
    const [cap, setCap] = useState<DeviceCapability>(() => detect());

    useEffect(() => {
        const update = () => setCap(detect());

        const mql = window.matchMedia
            ? window.matchMedia("(prefers-reduced-motion: reduce)")
            : null;
        mql?.addEventListener?.("change", update);
        window.addEventListener("resize", update);

        const nav: any = navigator;
        const conn: any = nav.connection || nav.mozConnection || nav.webkitConnection;
        conn?.addEventListener?.("change", update);

        return () => {
            mql?.removeEventListener?.("change", update);
            window.removeEventListener("resize", update);
            conn?.removeEventListener?.("change", update);
        };
    }, []);

    return cap;
}
