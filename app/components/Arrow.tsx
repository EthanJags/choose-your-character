interface ArrowProps {
  direction: "left" | "right" | "up";
  color: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function Arrow({ direction, color, onClick, disabled = false }: ArrowProps) {
  const handleClick = () => {
    if (disabled) return;
    onClick();
  };

  const getPositionClasses = () => {
    if (direction === "left") return "left-4 md:left-8 top-1/2 -translate-y-1/2";
    if (direction === "right") return "right-4 md:right-8 top-1/2 -translate-y-1/2";
    if (direction === "up") return "top-4 md:top-8 left-1/2 -translate-x-1/2";
    return "";
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`absolute z-30 ${getPositionClasses()} w-20 h-20 md:w-24 md:h-24 flex items-center justify-center transition-opacity ${
        disabled ? "opacity-30 cursor-not-allowed" : "opacity-100 cursor-pointer hover:opacity-80"
      }`}
      aria-label={`Navigate ${direction}`}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transition: "stroke 800ms ease-out" }}
      >
        <path
          d={
            direction === "left"
              ? "M15 18l-6-6 6-6"
              : direction === "right"
              ? "M9 18l6-6-6-6"
              : "M18 15l-6-6-6 6"
          }
          stroke={color}
          strokeWidth="3"
          strokeLinecap="square"
          strokeLinejoin="miter"
          style={{ transition: "stroke 800ms ease-out" }}
        />
      </svg>
    </button>
  );
}
