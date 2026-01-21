interface ButtonsProps {
  activeIndex: number;
  totalDots?: number;
  activeColor?: string;
  onDotClick?: (index: number) => void;
}

export default function Buttons({ 
  activeIndex, 
  totalDots = 4,
  activeColor = "#FDE047",
  onDotClick
}: ButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-4 px-1 py-1 bg-white rounded-full shadow-lg">
      {Array.from({ length: totalDots }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick?.(index)}
          className="w-3 h-3 rounded-full cursor-pointer hover:opacity-80"
          style={{
            backgroundColor: index === activeIndex ? activeColor : "#B3B3B3",
            transition: "background-color 800ms ease-out",
          }}
          aria-label={`Go to character ${index + 1}`}
        />
      ))}
    </div>
  );
}