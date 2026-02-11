import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { characters } from "@/app/data/content";

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

export async function generateStaticParams() {
  return characters.flatMap((char) =>
    char.projects.map((proj) => ({
      characterSlug: char.slug,
      projectSlug: proj.slug,
    }))
  );
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

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: character.color }}
    >
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 md:px-8 md:py-6">
        <Link
          href="/"
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

      <main className="max-w-5xl mx-auto px-4 md:px-8 pb-20">
        <div className="mb-12">
          <h1
            className="uppercase text-center md:text-left"
            style={{
              color: character.secondaryColor,
              fontFamily: "var(--font-londrina-solid), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2.5rem, 10vw, 6rem)",
              lineHeight: 1,
            }}
          >
            {project.title}
          </h1>
          <p
            className="uppercase mt-2 text-center md:text-left"
            style={{
              color: character.secondaryColor,
              fontFamily: "var(--font-londrina-solid), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
              opacity: 0.9,
            }}
          >
            {project.subtitle}
          </p>
        </div>

        {project.description && (
          <p
            className="mb-12 max-w-2xl text-lg md:text-xl leading-relaxed"
            style={{
              color: character.secondaryColor,
              opacity: 0.95,
            }}
          >
            {project.description}
          </p>
        )}

        <div
          className="columns-2 md:columns-3 gap-4"
          style={{ columnFill: "balance" }}
        >
          {images.map((src, i) => (
            <div
              key={src}
              className="break-inside-avoid mb-4 overflow-hidden rounded-sm"
              style={{ boxShadow: "0px 20px 26.6px 6px rgba(0,0,0,0.25)" }}
            >
              <img
                src={src}
                alt={`${project.title} - Photo ${i + 1}`}
                className="w-full h-auto block"
                loading={i < 4 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
