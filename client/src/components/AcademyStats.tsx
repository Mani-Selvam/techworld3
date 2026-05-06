import { motion } from "framer-motion";
import { Users, TrendingUp, Zap, LucideIcon } from "lucide-react";

export interface StatItem {
  icon: LucideIcon;
  number: string;
  label: string;
}

interface AcademyStatsProps {
  stats: StatItem[];
  animationsEnabled: boolean;
}

const DEFAULT_STATS: StatItem[] = [
  { icon: Users, number: "5000+", label: "Active Students" },
  { icon: TrendingUp, number: "95%", label: "Success Rate" },
  { icon: Zap, number: "4.5K", label: "Tutors" },
];

/**
 * Statistics section for academy hero
 * Displays key metrics with icons and hover effects
 */
export function AcademyStats({ stats = DEFAULT_STATS, animationsEnabled }: AcademyStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={animationsEnabled ? { opacity: 1 } : { opacity: 1 }}
      transition={animationsEnabled ? { duration: 0.8, delay: 0.4 } : { duration: 0 }}
      className="grid grid-cols-3 gap-2 sm:gap-4 pt-8 sm:pt-12 border-t border-gray-700/50">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          whileHover={animationsEnabled ? { scale: 1.08, y: -5 } : {}}
          className="min-w-0 p-2 sm:p-4 rounded-xl bg-gradient-to-br from-purple-900/30 to-blue-900/20 border border-purple-700/30 backdrop-blur-sm hover:border-purple-500/60 transition-all duration-300">
          {/* Stack vertical on mobile so big numbers like "5000+" don't overflow */}
          <div className="flex flex-col items-start sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-purple-600/30 shrink-0">
              <stat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-300" />
            </div>
            <span className="text-lg sm:text-2xl md:text-3xl font-black text-white leading-none break-words min-w-0">
              {stat.number}
            </span>
          </div>
          <span className="block text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-semibold leading-tight">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}
