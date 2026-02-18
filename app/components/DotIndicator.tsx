"use client";

export default function DotIndicator({
  count,
  activeIndex,
  color,
  onDotClick,
}: {
  count: number;
  activeIndex: number;
  color: string;
  onDotClick: (index: number) => void;
}) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:bottom-auto sm:left-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 md:right-10 z-30 flex flex-row items-center gap-3 py-2 px-3 sm:flex-col sm:gap-5 sm:py-2 sm:px-2 rounded-full"
      style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          className="w-4 h-4 md:w-5 md:h-5 rounded-full transition-all duration-300 cursor-pointer"
          style={{
            backgroundColor: i === activeIndex ? color : "rgba(255,255,255,0.3)",
          }}
          aria-label={`Go to project ${i + 1}`}
        />
      ))}
    </div>
  );
}
