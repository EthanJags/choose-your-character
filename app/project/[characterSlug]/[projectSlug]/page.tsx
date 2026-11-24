import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { characters } from "@/app/data/content";
import AutoFitText from "@/app/components/AutoFitText";
import ProjectExternalLinks from "./ProjectExternalLinks";

const IMAGE_EXTENSIONS = [".jpeg", ".jpg", ".png", ".webp", ".JPG"];

function getProjectImages(projectsFolder: string, projectSlug: string): string[] {
  const dir = path.join(
    process.cwd(),
    "public",
    "projects",
    projectsFolder,
    projectSlug
  );
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir);
  return files
    .filter((f) => IMAGE_EXTENSIONS.some((ext) => f.toLowerCase().endsWith(ext)))
    .sort((a, b) => {
      if (a.toLowerCase().startsWith("thumbnail")) return -1;
      if (b.toLowerCase().startsWith("thumbnail")) return 1;
      return a.localeCompare(b);
    })
    .map((f) => `/projects/${projectsFolder}/${projectSlug}/${f}`);
}

/**
 * Render description paragraphs. Short "Label: text" paragraphs get a bold
 * label, and short standalone lines are treated as sub-headings.
 */
function renderDescription(description: string) {
  return description.split("\n\n").map((paragraph, i) => {
    const colonMatch = paragraph.match(/^([^\n]+?):\s*([\s\S]*)$/);
    if (colonMatch && colonMatch[1].length < 50 && !colonMatch[1].includes("http")) {
      const [, label, content] = colonMatch;
      return (
        <div key={i}>
          <h3 className="font-semibold mb-1">{label}:</h3>
          {content ? <p>{content}</p> : null}
        </div>
      );
    }
    if (paragraph.length < 40) {
      return (
        <h3 key={i} className="font-semibold">
          {paragraph}
        </h3>
      );
    }
    return <p key={i}>{paragraph}</p>;
  });
}

export async function generateStaticParams() {
  return characters.flatMap((char) =>
    char.projects.map((proj) => ({
      characterSlug: char.slug,
      projectSlug: proj.slug,
    }))
  );
}

type ProjectParams = { characterSlug: string; projectSlug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<ProjectParams>;
}): Promise<Metadata> {
  const { characterSlug, projectSlug } = await params;
  const character = characters.find((c) => c.slug === characterSlug);
  const project = character?.projects.find((p) => p.slug === projectSlug);
  if (!character || !project) return {};

  const title = `${project.title} | Ethan's Portfolio`;
  const description = project.tagline ?? project.subtitle;
  // Pre-rendered 1200x630 cards; regenerate with `npm run og`.
  const image = {
    url: `/og/${character.slug}/${project.slug}.jpg`,
    width: 1200,
    height: 630,
    alt: project.title,
  };
  const url = `/project/${character.slug}/${project.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url,
      siteName: "Ethan's Portfolio",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ characterSlug: string; projectSlug: string }>;
}) {
  const { characterSlug, projectSlug } = await params;

  const character = characters.find((c) => c.slug === characterSlug);
  const project = character?.projects.find((p) => p.slug === projectSlug);

  if (!character || !project) notFound();

  const images = getProjectImages(character.projectsFolder, projectSlug);
  const [heroImage, ...galleryImages] = images;

  const fg = character.secondaryColor;
  const heading = {
    color: fg,
    fontFamily: "var(--font-londrina-solid), sans-serif",
  };
  const shadow = { boxShadow: "0px 20px 40px 0px rgba(0,0,0,0.3)" };
  const frame = "ring-1 ring-black/10";

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: character.color }}
    >
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 md:px-8 md:py-6">
        <Link
          href={`/?character=${characterSlug}&projects=1`}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          style={{ color: character.secondaryColor }}
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
            Back
          </span>
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 pb-24">
        {/* Hero: title, pitch and call to action beside the lead image */}
        <section className="grid gap-8 md:gap-12 md:grid-cols-[1fr_1.1fr] items-center mb-12 md:mb-16">
          <div className="min-w-0 text-center md:text-left">
            <AutoFitText
              as="h1"
              className="uppercase"
              baseFontSize="clamp(3rem, 9vw, 6.5rem)"
              style={{ ...heading, fontWeight: 900, lineHeight: 0.95 }}
            >
              {project.title}
            </AutoFitText>
            <p
              className="mt-4 text-xl md:text-2xl leading-snug"
              style={{ color: fg, opacity: 0.9 }}
            >
              {project.tagline ?? project.subtitle}
            </p>
            {((project.demoUrl && project.demoLabel) || project.devpostUrl) && (
              <div className="mt-8 flex justify-center md:justify-start">
                <ProjectExternalLinks
                  projectTitle={project.title}
                  projectSlug={projectSlug}
                  characterName={character.name}
                  characterSlug={characterSlug}
                  secondaryColor={fg}
                  backgroundColor={character.color}
                  demoUrl={project.demoUrl}
                  demoLabel={project.demoLabel}
                  devpostUrl={project.devpostUrl}
                  devpostLabel={project.devpostLabel}
                />
              </div>
            )}
          </div>
          {heroImage && (
            <div className={`overflow-hidden rounded-2xl ${frame}`} style={shadow}>
              <img
                src={heroImage}
                alt={`${project.title} preview`}
                className="w-full h-auto block"
                loading="eager"
              />
            </div>
          )}
        </section>

        {/* Headline numbers (falls back to the subtitle when no stats are set) */}
        {project.stats && project.stats.length > 0 && (
          <section
            className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden mb-12 md:mb-16"
            style={{ backgroundColor: `${fg}40`, border: `1px solid ${fg}40` }}
          >
            {project.stats.map((stat) => (
              <div
                key={stat.label}
                className="px-4 py-6 md:px-6 md:py-8 text-center md:text-left"
                style={{ backgroundColor: character.color }}
              >
                <div
                  className="text-4xl md:text-5xl"
                  style={{ ...heading, fontWeight: 900, lineHeight: 1 }}
                >
                  {stat.value}
                </div>
                <div
                  className="mt-2 text-sm md:text-base leading-snug"
                  style={{ color: fg, opacity: 0.8 }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Remaining photos: two-up on desktop, cropped to a shared height */}
        {galleryImages.length > 0 && (
          <section
            className={`grid gap-4 md:gap-6 mb-12 md:mb-16 ${
              galleryImages.length === 1 ? "" : "sm:grid-cols-2"
            }`}
          >
            {galleryImages.map((src, i) => (
              <div
                key={src}
                className={`overflow-hidden rounded-2xl ${frame}`}
                style={shadow}
              >
                <img
                  src={src}
                  alt={`${project.title} - Photo ${i + 2}`}
                  className="w-full h-64 sm:h-80 md:h-[26rem] object-cover object-left-top block"
                  loading="lazy"
                />
              </div>
            ))}
          </section>
        )}

        {/* About + awards */}
        {(project.description || project.awards?.length || project.hackathonAwards) && (
          <section
            className={`grid gap-10 md:gap-16 ${
              project.awards?.length ? "md:grid-cols-[1.6fr_1fr]" : ""
            }`}
          >
            {project.description && (
              <div className="min-w-0">
                <h2
                  className="uppercase text-3xl md:text-4xl mb-5"
                  style={{ ...heading, fontWeight: 900 }}
                >
                  About
                </h2>
                <div
                  className="max-w-2xl text-lg md:text-xl leading-relaxed space-y-5 [overflow-wrap:anywhere]"
                  style={{ color: fg, opacity: 0.92 }}
                >
                  {renderDescription(project.description)}
                </div>
                {project.hackathonAwards && (
                  <p
                    className="mt-6 max-w-2xl text-base md:text-lg italic"
                    style={{ color: fg, opacity: 0.85 }}
                  >
                    {project.hackathonAwards}
                  </p>
                )}
              </div>
            )}
            {project.awards && project.awards.length > 0 && (
              <aside
                className="rounded-2xl p-6 md:p-8 self-start"
                style={{ border: `2px solid ${fg}`, color: fg }}
              >
                <h2
                  className="uppercase text-2xl md:text-3xl mb-5"
                  style={{ ...heading, fontWeight: 900 }}
                >
                  Recognition
                </h2>
                <ul className="space-y-4">
                  {project.awards.map((award) => (
                    <li key={award} className="flex gap-3 text-base md:text-lg leading-snug">
                      <span aria-hidden className="mt-[0.15em] shrink-0">★</span>
                      <span>{award}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
