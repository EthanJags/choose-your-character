"use client";

import posthog from "posthog-js";

type ProjectExternalLinksProps = {
  projectTitle: string;
  projectSlug: string;
  characterName: string;
  characterSlug: string;
  secondaryColor: string;
  demoUrl?: string;
  demoLabel?: string;
  devpostUrl?: string;
  devpostLabel?: string;
};

export default function ProjectExternalLinks({
  projectTitle,
  projectSlug,
  characterName,
  characterSlug,
  secondaryColor,
  demoUrl,
  demoLabel,
  devpostUrl,
  devpostLabel,
}: ProjectExternalLinksProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {demoUrl && demoLabel && (
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="uppercase font-semibold text-sm md:text-base hover:opacity-80 transition-opacity"
          style={{
            color: secondaryColor,
            fontFamily: "var(--font-londrina-solid), sans-serif",
          }}
          onClick={() => {
            posthog.capture("project_external_link_clicked", {
              project_title: projectTitle,
              project_slug: projectSlug,
              character_name: characterName,
              character_slug: characterSlug,
              link_type: "demo",
              url: demoUrl,
            });
          }}
        >
          {demoLabel}
        </a>
      )}
      {devpostUrl && (
        <a
          href={devpostUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="uppercase font-semibold text-sm md:text-base hover:opacity-80 transition-opacity"
          style={{
            color: secondaryColor,
            fontFamily: "var(--font-londrina-solid), sans-serif",
          }}
          onClick={() => {
            posthog.capture("project_external_link_clicked", {
              project_title: projectTitle,
              project_slug: projectSlug,
              character_name: characterName,
              character_slug: characterSlug,
              link_type: "devpost",
              url: devpostUrl,
            });
          }}
        >
          {devpostLabel ?? "View on Devpost"}
        </a>
      )}
    </div>
  );
}
