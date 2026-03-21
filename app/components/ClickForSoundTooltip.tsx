"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export default function ClickForSoundTooltip() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const rafRef = useRef<number>(0);

  // Only show if sound hasn't been explicitly disabled
  useEffect(() => {
    const savedPreference = localStorage.getItem("soundEnabled");
    if (savedPreference === "false") return;
    const timeout = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timeout);
  }, []);

  // Track mouse position
  useEffect(() => {
    if (!visible) return;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
        setHasMoved(true);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  // Dismiss on any interaction
  const dismiss = useCallback(() => setVisible(false), []);

  useEffect(() => {
    if (!visible) return;

    const handleSoundToggle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.enabled) dismiss();
    };

    window.addEventListener("click", dismiss);
    window.addEventListener("keydown", dismiss);
    window.addEventListener("touchstart", dismiss);
    window.addEventListener("soundToggle", handleSoundToggle);

    return () => {
      window.removeEventListener("click", dismiss);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("touchstart", dismiss);
      window.removeEventListener("soundToggle", handleSoundToggle);
    };
  }, [visible, dismiss]);

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        zIndex: 9999,
        left: position.x + 16,
        top: position.y + 16,
        opacity: hasMoved ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-londrina-solid), sans-serif",
          fontSize: "14px",
          color: "white",
          letterSpacing: "0.025em",
          padding: "6px 14px",
          borderRadius: "9999px",
          whiteSpace: "nowrap",
          userSelect: "none",
          background: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.3)",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ width: "14px", height: "14px" }}
          >
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
          Click for sound
        </span>
      </div>
    </div>
  );
}
