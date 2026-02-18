"use client";

import { useRef, useEffect, useState } from "react";

type AutoFitTextProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  baseFontSize: string;
  minFontSizePx?: number;
  as?: "h1" | "h2" | "p" | "span";
};

export default function AutoFitText({
  children,
  className = "",
  style = {},
  baseFontSize,
  minFontSizePx = 12,
  as: Tag = "span",
}: AutoFitTextProps) {
  const textRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState<string | null>(null);

  useEffect(() => {
    const el = textRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    const fit = () => {
      const maxWidth = container.offsetWidth;
      if (maxWidth <= 0) return;

      el.style.fontSize = baseFontSize;
      let size = parseFloat(getComputedStyle(el).fontSize);

      while (el.scrollWidth > maxWidth && size > minFontSizePx) {
        size -= 2;
        el.style.fontSize = `${size}px`;
      }

      setFontSize(`${size}px`);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(container);

    return () => observer.disconnect();
  }, [children, baseFontSize, minFontSizePx]);

  return (
    <div ref={containerRef} className="w-full min-w-0 overflow-hidden">
      <Tag
        ref={textRef as React.Ref<HTMLHeadingElement>}
        className={className}
        style={{
          ...style,
          whiteSpace: "nowrap",
          fontSize: fontSize ?? baseFontSize,
        }}
      >
        {children}
      </Tag>
    </div>
  );
}
