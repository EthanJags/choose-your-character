"use client";

import Image from "next/image";
import type { Ethan, Project } from "@/app/page";

/**
 * Experimental gallery designs for the polaroid section.
 * Preview with ?polaroid=taped | clothesline | instant | corkboard
 */
export type PolaroidVariant = "taped" | "clothesline" | "instant" | "corkboard";

export const POLAROID_VARIANTS: PolaroidVariant[] = [
  "taped",
  "clothesline",
  "instant",
  "corkboard",
];

const TILTS = [-3.5, 2.5, -1.5, 3, -2.5, 1.5, -3, 2];
const tilt = (i: number) => TILTS[i % TILTS.length];
/** Tilt only applies from md up (see TILTED class); phones get straight cards. */
const tiltVar = (deg: number) => ({ "--tilt": `${deg}deg` }) as React.CSSProperties;
const TILTED = "md:[transform:rotate(var(--tilt))]";

const handwriting = "var(--font-caveat), cursive";
const londrina = "var(--font-londrina-solid), sans-serif";

type CardProps = { project: Project; ethan: Ethan; index: number };

/* ------------------------------------------------------------------ */
/* 1. Taped — scattered snapshots stuck down with washi tape           */
/* ------------------------------------------------------------------ */
function TapedCard({ project, ethan, index }: CardProps) {
  const tapeTilt = index % 2 === 0 ? -4 : 5;
  return (
    <div
      className={`relative bg-white p-3 pb-6 shadow-[3px_8px_20px_rgba(0,0,0,0.22)] transition-all duration-300 ease-out ${TILTED} md:group-hover:[transform:none] group-hover:-translate-y-2 group-hover:shadow-[6px_16px_32px_rgba(0,0,0,0.3)]`}
      style={tiltVar(tilt(index))}
    >
      <div
        className="absolute -top-4 left-1/2 h-8 w-28 -translate-x-1/2 opacity-80"
        style={{
          transform: `translateX(-50%) rotate(${tapeTilt}deg)`,
          background: `repeating-linear-gradient(45deg, ${ethan.color}cc 0 8px, ${ethan.color}99 8px 16px)`,
          clipPath:
            "polygon(3% 0, 97% 4%, 100% 30%, 96% 55%, 100% 100%, 2% 96%, 0 65%, 4% 40%)",
        }}
      />
      <div className="relative w-full overflow-hidden bg-gray-100">
        <Image src={project.image} alt={project.title} width={800} height={600} className="block h-auto w-full" sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" />
      </div>
      <p className="mt-3 text-center text-gray-900 leading-none" style={{ fontFamily: handwriting, fontWeight: 700, fontSize: "clamp(1.9rem, 2.6vw, 2.4rem)" }}>
        {project.title}
      </p>
      {project.subtitle && (
        <p className="mt-1 text-center text-gray-500 leading-snug" style={{ fontFamily: handwriting, fontSize: "1.2rem" }}>
          {project.subtitle}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Clothesline — photos hung on string with wooden pegs             */
/* ------------------------------------------------------------------ */
function ClotheslineCard({ project, index }: CardProps) {
  const swing = tilt(index) * 0.6;
  return (
    <div className="relative pt-6">
      {/* peg */}
      <div className="absolute left-1/2 top-0 z-10 h-10 w-4 -translate-x-1/2 rounded-sm bg-[#C79A63] shadow-[1px_2px_3px_rgba(0,0,0,0.3)]">
        <div className="mx-auto mt-4 h-1.5 w-full bg-[#9C7243]" />
      </div>
      {/* on small screens each photo gets its own bit of string */}
      <div className="absolute -inset-x-6 top-4 h-0.5 bg-[#7a6a58] md:hidden" />
      <div
        className={`origin-top bg-white p-3 pb-5 shadow-[2px_10px_18px_rgba(0,0,0,0.2)] transition-transform duration-500 ease-out ${TILTED} md:group-hover:[transform:translateY(4px)]`}
        style={tiltVar(swing)}
      >
        <div className="relative w-full overflow-hidden bg-gray-100">
          <Image src={project.image} alt={project.title} width={800} height={600} className="block h-auto w-full" sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" />
        </div>
        <p className="mt-3 text-left uppercase text-gray-800 leading-tight" style={{ fontFamily: londrina, fontWeight: 900, fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)" }}>
          {project.title}
        </p>
        {project.subtitle && (
          <p className="text-left text-gray-500" style={{ fontFamily: londrina, fontWeight: 400, fontSize: "1.05rem" }}>
            {project.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function ClotheslineRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <svg className="pointer-events-none absolute left-[-4%] top-2 hidden h-16 w-[108%] md:block" viewBox="0 0 1000 60" preserveAspectRatio="none">
        <path d="M0,4 Q500,56 1000,4" fill="none" stroke="#7a6a58" strokeWidth="2.5" />
      </svg>
      <div className="relative mx-auto grid max-w-md grid-cols-1 items-start gap-12 md:max-w-none md:grid-cols-3 lg:gap-12">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Instant — wide instant-film proportions, photo "develops" on hover */
/* ------------------------------------------------------------------ */
function InstantCard({ project, ethan }: CardProps) {
  return (
    <div className="rounded-[3px] bg-[#FBFAF7] p-[6%] pb-0 shadow-[0_1px_0_rgba(0,0,0,0.05),0_12px_28px_rgba(0,0,0,0.18)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)]">
      <div className="relative w-full overflow-hidden bg-[#2b2622]">
        <Image
          src={project.image}
          alt={project.title}
          width={800}
          height={600}
          className="block h-auto w-full [filter:sepia(0.55)_saturate(0.7)_brightness(1.05)_contrast(0.9)] transition-[filter] duration-700 group-hover:[filter:none]"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
        />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.35)]" />
      </div>
      <div className="flex min-h-[7.5rem] flex-col items-center justify-center px-2 py-4 text-center">
        <p className="leading-none" style={{ fontFamily: handwriting, fontWeight: 700, fontSize: "clamp(1.9rem, 2.6vw, 2.4rem)", color: ethan.color }}>
          {project.title}
        </p>
        {project.subtitle && (
          <p className="mt-1.5 text-gray-500 leading-snug" style={{ fontFamily: handwriting, fontSize: "1.15rem" }}>
            {project.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Corkboard — pinned photos with sticky-note captions              */
/* ------------------------------------------------------------------ */
const NOTE_COLORS = ["#FFF59D", "#FFD1DC", "#C8F7C5", "#BDE3FF"];

function CorkboardCard({ project, ethan, index }: CardProps) {
  return (
    <div className={`relative transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:scale-[1.02] ${TILTED}`} style={tiltVar(tilt(index) * 0.7)}>
      <div className="relative bg-white p-2.5 shadow-[2px_6px_14px_rgba(0,0,0,0.35)]">
        {/* pushpin */}
        <div
          className="absolute left-1/2 -top-2.5 z-10 h-6 w-6 -translate-x-1/2 rounded-full shadow-[1px_3px_4px_rgba(0,0,0,0.45)]"
          style={{ background: `radial-gradient(circle at 35% 30%, #ffffffaa 0 18%, ${ethan.color} 22% 100%)` }}
        />
        <div className="relative w-full overflow-hidden bg-gray-100">
          <Image src={project.image} alt={project.title} width={800} height={600} className="block h-auto w-full" sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw" />
        </div>
      </div>
      <div
        className={`relative -mt-6 ml-auto mr-2 w-[80%] p-3 shadow-[1px_4px_8px_rgba(0,0,0,0.25)] md:mr-[-4%] md:w-[72%] ${TILTED}`}
        style={{ background: NOTE_COLORS[index % NOTE_COLORS.length], ...tiltVar(-tilt(index + 1)) }}
      >
        <p className="uppercase leading-tight text-gray-900" style={{ fontFamily: londrina, fontWeight: 900, fontSize: "clamp(1.25rem, 1.9vw, 1.6rem)" }}>
          {project.title}
        </p>
        {project.subtitle && (
          <p className="mt-1 text-gray-900 leading-snug" style={{ fontFamily: "var(--font-figma-hand), sans-serif", fontSize: "1.15rem" }}>
            {project.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

const WAVE_PATH = "M0,80 C240,160 480,0 720,80 C960,160 1200,0 1440,80";
const WAVE_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 180' preserveAspectRatio='none'><path d='${WAVE_PATH} L1440,180 L0,180 Z'/></svg>`
)}")`;

/**
 * Corkboard section: the cork texture itself forms the wavy top edge (masked),
 * with a wooden frame rim drawn along the curve, so there's no flat-colour band
 * between the title screen and the board.
 */
export function CorkboardSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-20 -mt-28 overflow-x-clip md:-mt-36 [--wave-h:7rem] md:[--wave-h:9rem]">
      <div
        className="relative px-8 pt-[calc(var(--wave-h)+1rem)] pb-24 md:px-16 md:pb-32 lg:px-24"
        style={{
          backgroundColor: "#D4A574",
          backgroundImage:
            "radial-gradient(ellipse at 50% 40%, transparent 55%, rgba(60,30,10,0.28) 100%), url(/cork.webp)",
          backgroundSize: "100% 100%, 1024px 1024px",
          WebkitMaskImage: `${WAVE_MASK}, linear-gradient(#000, #000)`,
          maskImage: `${WAVE_MASK}, linear-gradient(#000, #000)`,
          WebkitMaskSize: "100% var(--wave-h), 100% calc(100% - var(--wave-h) + 1px)",
          maskSize: "100% var(--wave-h), 100% calc(100% - var(--wave-h) + 1px)",
          WebkitMaskPosition: "top, bottom",
          maskPosition: "top, bottom",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      >
        {children}
      </div>
      {/* Wooden frame rim following the wave */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-0 block h-[var(--wave-h)] w-full overflow-visible"
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d={WAVE_PATH} transform="translate(0 9)" fill="none" stroke="rgba(40,20,5,0.28)" strokeWidth="10" vectorEffect="non-scaling-stroke" />
        <path d={WAVE_PATH} fill="none" stroke="#6E4523" strokeWidth="16" vectorEffect="non-scaling-stroke" />
        <path d={WAVE_PATH} fill="none" stroke="#9A6535" strokeWidth="10" vectorEffect="non-scaling-stroke" />
        <path d={WAVE_PATH} transform="translate(0 -3)" fill="none" stroke="#C08A55" strokeWidth="2" vectorEffect="non-scaling-stroke" opacity="0.8" />
      </svg>
    </div>
  );
}

export function VariantGallery({
  variant,
  ethan,
  renderLink,
}: {
  variant: PolaroidVariant;
  ethan: Ethan;
  renderLink: (project: Project, children: React.ReactNode) => React.ReactNode;
}) {
  const projects = ethan.projects;

  if (variant === "clothesline") {
    const rows: Project[][] = [];
    for (let i = 0; i < projects.length; i += 3) rows.push(projects.slice(i, i + 3));
    return (
      <div className="mx-auto flex max-w-[1200px] flex-col gap-16">
        {rows.map((row, r) => (
          <ClotheslineRow key={r}>
            {row.map((p, j) => (
              <div key={p.slug}>{renderLink(p, <ClotheslineCard project={p} ethan={ethan} index={r * 3 + j} />)}</div>
            ))}
          </ClotheslineRow>
        ))}
      </div>
    );
  }

  const Card = variant === "taped" ? TapedCard : variant === "instant" ? InstantCard : CorkboardCard;
  const gap = variant === "instant" ? "gap-10" : "gap-12";
  // Vertical spacing between cards in a column (extra room for tape/pins and overlapping notes)
  const rowGap = variant === "instant" ? "pb-12" : "pb-16 pt-4";

  return (
    <div className={`mx-auto max-w-md columns-1 sm:max-w-[1200px] sm:columns-2 lg:columns-3 ${gap} pt-4`}>
      {projects.map((p, i) => (
        <div key={p.slug} className={`break-inside-avoid ${rowGap}`}>
          {renderLink(p, <Card project={p} ethan={ethan} index={i} />)}
        </div>
      ))}
    </div>
  );
}
