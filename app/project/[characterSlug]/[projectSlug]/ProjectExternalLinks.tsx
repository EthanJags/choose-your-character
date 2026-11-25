"use client";

import posthog from "posthog-js";

type ProjectExternalLinksProps = {
  projectTitle: string;
  projectSlug: string;
  characterName: string;
  characterSlug: string;
  secondaryColor: string;
  /** Page background, used as the text color on the filled primary button */
  backgroundColor: string;
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
  backgroundColor,
  demoUrl,
  demoLabel,
  devpostUrl,
  devpostLabel,
}: ProjectExternalLinksProps) {
  return (
    <div className="flex flex-wrap justify-center md:justify-start gap-3">
      {demoUrl && demoLabel && (
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 uppercase text-lg md:text-xl tracking-wide transition-transform hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{
            backgroundColor: secondaryColor,
            color: backgroundColor,
            outlineColor: secondaryColor,
            fontFamily: "var(--font-londrina-solid), sans-serif",
            fontWeight: 900,
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
          <span aria-hidden>→</span>
        </a>
      )}
      {devpostUrl && (
        <a
          href={devpostUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 uppercase text-lg md:text-xl tracking-wide transition-transform hover:-translate-y-0.5 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{
            border: `2px solid ${secondaryColor}`,
            color: secondaryColor,
            outlineColor: secondaryColor,
            fontFamily: "var(--font-londrina-solid), sans-serif",
            fontWeight: 900,
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
