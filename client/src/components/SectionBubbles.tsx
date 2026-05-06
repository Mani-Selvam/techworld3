import { useMemo } from 'react';
import { useDeviceCapability } from '@/hooks/useDeviceCapability';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
  opacity: number;
}

interface SectionBubblesProps {
  count?: number; // Number of bubbles (4-6)
  className?: string;
}

export default function SectionBubbles({ count = 5, className = "" }: SectionBubblesProps) {
  const { isMobile, isLowEnd, prefersReducedMotion, bubbleScale } = useDeviceCapability();
  const disabled = isMobile || isLowEnd || prefersReducedMotion || bubbleScale === 0;

  // Adapt to mid-range hardware: shrink the count by the device's bubble scale.
  // Always render at least 1 bubble if the section was meant to have any.
  const effectiveCount = disabled
    ? 0
    : Math.max(1, Math.round(count * bubbleScale));

  // Generate stable bubble data once - must be called regardless of disabled
  const bubbles = useMemo<Bubble[]>(() => {
    const newBubbles: Bubble[] = [];

    for (let i = 0; i < effectiveCount; i++) {
      newBubbles.push({
        id: i,
        x: Math.random() * 90 + 5, // Random x position (5% to 95%)
        y: Math.random() * 80 + 10, // Random y position (10% to 90%)
        size: Math.random() * 30 + 20, // Size between 20-50px
        speed: Math.random() * 10 + 15, // Animation speed (15-25s)
        delay: Math.random() * 8, // Random delay 0-8s
        opacity: Math.random() * 0.4 + 0.2, // Opacity (0.2-0.6)
      });
    }

    return newBubbles;
  }, [effectiveCount]);

  // Disable bubbles on mobile / low-end / reduced-motion for performance
  if (disabled) {
    return <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} />;
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            background: `radial-gradient(circle, 
              hsla(262, 83%, 58%, ${bubble.opacity}) 0%, 
              hsla(262, 83%, 58%, ${bubble.opacity * 0.7}) 30%, 
              hsla(262, 83%, 58%, ${bubble.opacity * 0.3}) 70%, 
              transparent 100%)`,
            boxShadow: `
              0 0 ${bubble.size * 0.6}px hsla(262, 83%, 58%, ${bubble.opacity}),
              0 0 ${bubble.size * 1.2}px hsla(262, 83%, 58%, ${bubble.opacity * 0.5})
            `,
            filter: 'blur(0.5px)',
            animation: `
              float-${bubble.id % 3} ${bubble.speed}s ease-in-out infinite ${bubble.delay}s,
              drift-${bubble.id % 2} ${bubble.speed * 1.5}s linear infinite ${bubble.delay * 0.5}s
            `,
          }}
        />
      ))}
      
      {/* CSS Animation Styles */}
      <style>{`
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) scale(1); }
          25% { transform: translateY(-20px) scale(1.1); }
          50% { transform: translateY(-10px) scale(0.9); }
          75% { transform: translateY(-25px) scale(1.05); }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) scale(1); }
          33% { transform: translateY(-15px) scale(1.05); }
          66% { transform: translateY(-30px) scale(0.95); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) scale(1); }
          20% { transform: translateY(-25px) scale(1.1); }
          40% { transform: translateY(-5px) scale(0.9); }
          60% { transform: translateY(-20px) scale(1.05); }
          80% { transform: translateY(-10px) scale(0.95); }
        }
        
        @keyframes drift-0 {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          25% { transform: translateX(10px) rotate(90deg); }
          50% { transform: translateX(-5px) rotate(180deg); }
          75% { transform: translateX(15px) rotate(270deg); }
        }
        
        @keyframes drift-1 {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          33% { transform: translateX(-10px) rotate(120deg); }
          66% { transform: translateX(8px) rotate(240deg); }
        }
      `}</style>
    </div>
  );
}