"use client";

function isLightBg(hex: string): boolean {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return true;
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

export default function DotIndicator({
  count,
  activeIndex,
  color,
  backgroundColor,
  onDotClick,
}: {
  count: number;
  activeIndex: number;
  color: string;
  backgroundColor: string;
  onDotClick: (index: number) => void;
}) {
  const light = isLightBg(backgroundColor);
  const inactiveColor = light ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.5)";
  const containerBg = light ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.15)";

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:bottom-auto sm:left-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 md:right-10 z-30 flex flex-row items-center gap-3 py-2 px-3 sm:flex-col sm:gap-5 sm:py-2 sm:px-2 rounded-full"
      style={{ backgroundColor: containerBg }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          className="w-4 h-4 md:w-5 md:h-5 rounded-full transition-all duration-300 cursor-pointer"
          style={{
            backgroundColor: i === activeIndex ? color : inactiveColor,
          }}
          aria-label={`Go to project ${i + 1}`}
        />
      ))}
    </div>
  );
}
