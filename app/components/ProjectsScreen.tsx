"use client";

import type { Ethan } from "@/app/page";
import ProjectGalleryShowcase from "./ProjectGalleryShowcase";
import { characters } from "@/app/data/content";

type ProjectsScreenProps = {
  ethan: Ethan;
  onBack: () => void;
};

export default function ProjectsScreen({ ethan, onBack }: ProjectsScreenProps) {
  const allProjects = characters.flatMap((character) =>
    character.projects.map((project) => ({
      ...project,
      characterSlug: character.slug,
    }))
  );

  return (
    <div className="relative h-screen w-full overflow-y-auto overflow-x-hidden bg-[#f5efe1]">
      <button
        onClick={onBack}
        className="fixed left-4 top-4 z-30 flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80 md:left-8 md:top-8"
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

      <ProjectGalleryShowcase
        projects={allProjects}
        accentColor={ethan.thirdColor}
        secondaryColor={ethan.secondaryColor}
      />
    </div>
  );
}
