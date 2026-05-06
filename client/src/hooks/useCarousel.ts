import { useEffect, useState } from 'react';

export interface CarouselImage {
  src: string;
  label: string;
}

/**
 * Manages carousel state with automatic rotation
 * Respects animation preferences and mobile devices
 */
export function useCarousel(images: CarouselImage[], animationsEnabled: boolean) {
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    // Respect the global animation gate (which already honors reduced-motion
    // and weak-device signals). Pause when the tab is hidden to save battery.
    if (!animationsEnabled) return;

    let interval: number | undefined;

    const start = () => {
      if (interval) return;
      interval = window.setInterval(() => {
        setCarouselIndex((prev) => (prev + 1) % images.length);
      }, 4000);
    };

    const stop = () => {
      if (interval) {
        window.clearInterval(interval);
        interval = undefined;
      }
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [animationsEnabled, images.length]);

  return carouselIndex;
}
