interface AcademyLabelProps {
  text: string;
}

/**
 * Badge label for academy images
 * Displayed with gradient background and glow effect
 */
export function AcademyLabel({ text }: AcademyLabelProps) {
  return (
    <div className="absolute bottom-1 left-1 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium bg-gradient-to-r from-purple-600/70 to-blue-600/70 text-white shadow-[0_0_8px_rgba(139,92,246,0.8)] backdrop-blur-md border border-white/10">
      {text}
    </div>
  );
}
