import { useEffect, useState } from 'react';

/**
 * Defers animations until after the page is fully painted (LCP).
 * On mobile, disables animations entirely for better performance.
 * Returns true when animations should be enabled.
 */
export function useAnimationDefer(delayMs: number = 2000): boolean {
  const [animationsEnabled, setAnimationsEnabled] = useState(false);

  useEffect(() => {
    // Check if mobile at initialization
    const isMobile = window.innerWidth < 768 || /Mobile|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
    
    // Never enable animations on mobile
    if (isMobile) {
      setAnimationsEnabled(false);
      return;
    }

    // On desktop, defer animations
    if (document.readyState === 'complete') {
      const timer = setTimeout(() => setAnimationsEnabled(true), delayMs);
      return () => clearTimeout(timer);
    }

    // Wait for page load, then defer animations
    const handleLoad = () => {
      const timer = setTimeout(() => setAnimationsEnabled(true), delayMs);
    };

    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, [delayMs]);

  return animationsEnabled;
}
