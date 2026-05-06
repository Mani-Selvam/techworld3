import { motion } from "framer-motion";

interface AcademyHeroBackgroundProps {
  animationsEnabled: boolean;
}

/**
 * Animated background gradient for hero section
 * Only renders when animations are enabled for performance
 */
export function AcademyHeroBackground({ animationsEnabled }: AcademyHeroBackgroundProps) {
  if (!animationsEnabled) return null;

  return (
    <motion.div
      className="absolute inset-0 opacity-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ duration: 2 }}>
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-20 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl" />
    </motion.div>
  );
}
