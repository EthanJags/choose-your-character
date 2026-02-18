"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import AutoFitText from "./AutoFitText";
import DotIndicator from "./DotIndicator";
import type { Ethan, Project } from "@/app/page";

type ProjectsScreenProps = {
  ethan: Ethan;
  initialProjectSlug?: string;
  onBack: () => void;
};

function ProjectSlide({
  project,
  secondaryColor,
  projectHref,
}: {
  project: Project;
  secondaryColor: string;
  projectHref: string;
}) {
  const cardHref =
    project.externalLinkOnly && project.demoUrl
      ? project.demoUrl
      : projectHref;

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center pl-8 pr-8 md:pl-16 md:pr-16 sm:pr-20 md:pr-24 py-20 sm:py-8">
      <Link
        href={cardHref}
        target={project.externalLinkOnly ? "_blank" : undefined}
        rel={project.externalLinkOnly ? "noopener noreferrer" : undefined}
        className="flex flex-col items-center w-full max-w-[1141px] cursor-pointer hover:opacity-95 transition-opacity"
      >
        <div
          className="w-full max-w-[1141px]"
          style={{ aspectRatio: "1141/652" }}
        >
          <div
            className="relative mx-auto h-full overflow-hidden rounded-sm"
            style={{
              aspectRatio: project.aspectRatio ?? "1141/652",
              width: project.aspectRatio ? "auto" : "100%",
              maxWidth: "100%",
              boxShadow: "0px 20px 26.6px 6px rgba(0,0,0,0.25)",
            }}
          >
            <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
          </div>
        </div>
        <AutoFitText
          as="h2"
          className="uppercase text-center mt-6"
          baseFontSize="clamp(2rem, 8vw, 8rem)"
          style={{
            color: secondaryColor,
            fontFamily: "var(--font-londrina-solid), sans-serif",
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {project.title}
        </AutoFitText>
        <AutoFitText
          as="p"
          className="text-center mt-2"
          baseFontSize="clamp(1rem, 2.5vw, 2rem)"
          style={{
            color: secondaryColor,
            fontFamily: "var(--font-londrina-solid), sans-serif",
            fontWeight: 900,
          }}
        >
          {project.subtitle}
        </AutoFitText>
      </Link>
      {(project.demoUrl || project.devpostUrl) && (
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="uppercase cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                color: secondaryColor,
                fontFamily: "var(--font-londrina-solid), sans-serif",
                fontWeight: 900,
                fontSize: "clamp(0.875rem, 2vw, 1.25rem)",
              }}
            >
              {project.demoLabel ?? "View demo"}
            </a>
          )}
          {project.devpostUrl && (
            <a
              href={project.devpostUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="uppercase cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                color: secondaryColor,
                fontFamily: "var(--font-londrina-solid), sans-serif",
                fontWeight: 900,
                fontSize: "clamp(0.875rem, 2vw, 1.25rem)",
              }}
            >
              {project.devpostLabel ?? "View on Devpost"}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProjectsScreen({
  ethan,
  initialProjectSlug,
  onBack,
}: ProjectsScreenProps) {
  const initialIndex =
    initialProjectSlug != null
      ? ethan.projects.findIndex((p) => p.slug === initialProjectSlug)
      : -1;
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const projects = ethan.projects;

  const navigateTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      const wrapped =
        ((index % projects.length) + projects.length) % projects.length;
      if (wrapped === currentIndex) return;
      setIsAnimating(true);
      setCurrentIndex(wrapped);
      setTimeout(() => setIsAnimating(false), 700);
    },
    [isAnimating, currentIndex, projects.length]
  );

  // Wheel scroll-jacking
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating) return;
      if (e.deltaY > 30) {
        navigateTo(currentIndex + 1);
      } else if (e.deltaY < -30) {
        navigateTo(currentIndex - 1);
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [isAnimating, currentIndex, navigateTo]);

  // Touch swipe
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isAnimating) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (delta > 50) {
        navigateTo(currentIndex + 1);
      } else if (delta < -50) {
        navigateTo(currentIndex - 1);
      }
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isAnimating, currentIndex, navigateTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        navigateTo(currentIndex + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        navigateTo(currentIndex - 1);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, navigateTo, onBack]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: ethan.color }}
    >
      {/* Back arrow - top left */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 md:top-8 md:left-8 z-30 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="Go back"
        style={{ color: ethan.secondaryColor }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 md:w-12 md:h-12 shrink-0"
        >
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </svg>
        <span
          className="uppercase font-semibold text-sm md:text-base"
          style={{ fontFamily: "var(--font-londrina-solid), sans-serif" }}
        >
          Back to home
        </span>
      </button>

      {/* Slides container */}
      <div
        className="w-full"
        style={{
          transform: `translateY(-${currentIndex * 100}vh)`,
          transition: "transform 700ms cubic-bezier(0.65, 0, 0.35, 1)",
        }}
      >
        {projects.map((project, i) => (
          <ProjectSlide
            key={i}
            project={project}
            secondaryColor={ethan.secondaryColor}
            projectHref={`/project/${ethan.slug}/${project.slug}`}
          />
        ))}
      </div>

      {/* Dot indicator */}
      <DotIndicator
        count={projects.length}
        activeIndex={currentIndex}
        color={ethan.secondaryColor}
        onDotClick={navigateTo}
      />
    </div>
  );
}
