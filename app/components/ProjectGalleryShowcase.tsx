"use client";

import Image from "next/image";
import Link from "next/link";
import Polaroid from "./Polaroid";
import type { Project } from "@/app/page";

type GalleryProject = Project & {
  characterSlug: string;
};

type ProjectGalleryShowcaseProps = {
  projects: GalleryProject[];
  accentColor: string;
  secondaryColor: string;
};

export default function ProjectGalleryShowcase({
  projects,
  accentColor,
  secondaryColor,
}: ProjectGalleryShowcaseProps) {
  return (
    <div className="relative z-10 min-h-screen w-full bg-[#f5efe1] px-4 pb-20 pt-28 sm:px-8 sm:pt-32">
      <div className="relative min-h-[calc(100vh-7rem)] w-full overflow-hidden sm:min-h-[calc(100vh-10rem)]">
        <div className="relative z-10 px-4 pb-8 pt-8 sm:px-8 sm:pt-10 lg:px-12">
          <h2
            className="text-center uppercase tracking-tight"
            style={{
              color: secondaryColor,
              fontFamily: "var(--font-londrina-solid), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2rem, 6vw, 4.2rem)",
              lineHeight: 1,
            }}
          >
            Project Gallery
          </h2>
          <p
            className="mx-auto mt-2 max-w-2xl text-center"
            style={{
              color: "#1a1a1a",
              fontFamily: '"Figma Hand", var(--font-figma-hand), cursive',
              fontSize: "clamp(1rem, 2.6vw, 1.35rem)",
            }}
          >
            Click any photo to open the full project page.
          </p>

          <div className="mt-8 columns-1 gap-6 sm:columns-2 xl:columns-3 [column-fill:balance]">
            {projects.map((project, index) => {
              const cardHref = `/project/${project.characterSlug}/${project.slug}`;
              const photoAspectRatios: Array<`${number} / ${number}`> = [
                "4 / 5",
                "1 / 1",
                "3 / 2",
                "2 / 3",
              ];
              const photoAspectRatio = photoAspectRatios[index % photoAspectRatios.length];

              return (
                <div key={project.slug} className="mb-8 break-inside-avoid">
                  <Link
                    href={cardHref}
                    className="group relative mb-6 block break-inside-avoid transition-transform duration-300 hover:scale-[1.015]"
                    aria-label={`Open ${project.title}`}
                  >
                    <div
                      className="pointer-events-none absolute -top-3 left-1/2 z-10 -translate-x-1/2"
                    >
                      <Image
                        src="/about/tape.png"
                        alt=""
                        width={244}
                        height={62}
                        className="h-auto w-24 opacity-90 sm:w-28"
                        aria-hidden
                      />
                    </div>
                    <Polaroid
                      image={project.image}
                      title={project.title}
                      photoAspectRatio={photoAspectRatio}
                      className="h-auto w-full max-w-115"
                    />
                  </Link>

                  <article
                    className="relative mb-6 break-inside-avoid overflow-visible"
                  >
                    <Image
                      src="/about/notebook.png"
                      alt=""
                      fill
                      className="pointer-events-none object-fill"
                      style={{ filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.22))" }}
                      aria-hidden
                    />
                    <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-20">
                      <Image
                        src="/about/tape.png"
                        alt=""
                        width={244}
                        height={62}
                        className="h-auto w-20 opacity-90 sm:w-24"
                        aria-hidden
                      />
                    </div>
                    <div className="relative z-10 flex flex-col pt-10 pb-6 px-6 sm:pt-12 sm:px-8">
                      <h3
                      className="uppercase leading-none tracking-tight"
                      style={{
                        color: accentColor,
                        fontFamily: "var(--font-londrina-solid), sans-serif",
                        fontWeight: 900,
                        fontSize: "clamp(1.8rem, 5.2vw, 2.7rem)",
                      }}
                    >
                      {project.title}
                    </h3>
                    <p
                      className="mt-1"
                      style={{
                        color: "#232323",
                        fontFamily: "var(--font-londrina-solid), sans-serif",
                        fontWeight: 700,
                        fontSize: "clamp(1rem, 2.3vw, 1.3rem)",
                      }}
                    >
                      {project.subtitle}
                    </p>
                    <p
                      className="mt-3"
                      style={{
                        color: "#111",
                        fontFamily: '"Figma Hand", var(--font-figma-hand), cursive',
                        fontSize: "clamp(1rem, 2vw, 1.2rem)",
                        lineHeight: 1.3,
                      }}
                    >
                      {project.description}
                    </p>
                    {project.content ? (
                      <p
                        className="mt-2"
                        style={{
                          color: "#111",
                          fontFamily: '"Figma Hand", var(--font-figma-hand), cursive',
                          fontSize: "clamp(0.95rem, 1.9vw, 1.1rem)",
                          lineHeight: 1.3,
                        }}
                      >
                        {project.content}
                      </p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <Link
                        href={cardHref}
                        className="rounded-full px-4 py-2 text-sm uppercase transition-opacity hover:opacity-80"
                        style={{
                          backgroundColor: accentColor,
                          color: secondaryColor,
                          fontFamily: "var(--font-londrina-solid), sans-serif",
                          fontWeight: 900,
                        }}
                      >
                        Open project
                      </Link>
                      {project.demoUrl ? (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border px-4 py-2 text-sm uppercase transition-opacity hover:opacity-80"
                          style={{
                            borderColor: `${accentColor}55`,
                            color: accentColor,
                            fontFamily: "var(--font-londrina-solid), sans-serif",
                            fontWeight: 900,
                            backgroundColor: "#fff9",
                          }}
                        >
                          View demo
                        </a>
                      ) : null}
                    </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
