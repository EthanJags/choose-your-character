"use client";

import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";
import type { Ethan, Project } from "@/app/page";

function PolaroidCard({
  project,
  ethan,
  index,
}: {
  project: Project;
  ethan: Ethan;
  index: number;
}) {


  const href =
    project.externalLinkOnly && project.demoUrl
      ? project.demoUrl
      : `/project/${ethan.slug}/${project.slug}`;

  return (
    <Link
      href={href}
      target={project.externalLinkOnly ? "_blank" : undefined}
      rel={project.externalLinkOnly ? "noopener noreferrer" : undefined}
      className="group block"
      onClick={() => {
        posthog.capture(
          project.externalLinkOnly
            ? "project_link_clicked"
            : "project_detail_opened",
          {
            project_title: project.title,
            project_slug: project.slug,
            character_name: ethan.name,
            character_slug: ethan.slug,
            ...(project.externalLinkOnly
              ? { link_type: "demo", url: project.demoUrl }
              : {}),
          }
        );
      }}
    >
        <div className="bg-white p-3 pb-4 md:p-4 md:pb-5 shadow-[4px_6px_16px_rgba(0,0,0,0.2)] transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:shadow-[6px_12px_28px_rgba(0,0,0,0.3)] group-hover:scale-[1.03]">
          <div className="w-full overflow-hidden bg-gray-100">
            <Image
              src={project.image}
              alt={project.title}
              width={800}
              height={600}
              className="w-full h-auto block"
              sizes="(max-width: 768px) 85vw, (max-width: 1024px) 42vw, 28vw"
            />
          </div>
          <p
            className="mt-3 text-left text-gray-800 truncate uppercase"
            style={{
              fontFamily: "var(--font-londrina-solid), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(1.5rem, 2.5vw, 2.1rem)",
            }}
          >
            {project.title}
          </p>
          {project.subtitle && (
            <p
              className="text-left text-gray-500 font-normal"
              style={{
                fontFamily: "var(--font-londrina-solid), sans-serif",
                fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
                fontWeight: 400,
              }}
            >
              {project.subtitle}
            </p>
          )}
        </div>
    </Link>
  );
}

const GALLERY_BG = "#EDE8DF";

export default function ProjectsScreen({ ethan }: { ethan: Ethan }) {
  return (
    <div className="relative">
      {/* Wavy transition - overlaps bottom of title screen */}
      <div className="relative -mt-28 md:-mt-36 z-20 pointer-events-none">
        <svg
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
          className="block w-full h-28 md:h-36"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,80 C240,160 480,0 720,80 C960,160 1200,0 1440,80 L1440,180 L0,180 Z"
            fill={GALLERY_BG}
          />
        </svg>
      </div>

      {/* Gallery section */}
      <section
        className="relative z-20 px-8 md:px-16 lg:px-24 pt-8 pb-24 md:pt-12 md:pb-32"
        style={{ backgroundColor: GALLERY_BG }}
      >
        <div className="columns-1 md:columns-2 lg:columns-3 gap-10 lg:gap-12 max-w-[1200px] mx-auto">
          {ethan.projects.map((project, i) => (
            <div key={project.slug} className="mb-10 lg:mb-12 break-inside-avoid">
              <PolaroidCard
                project={project}
                ethan={ethan}
                index={i}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
