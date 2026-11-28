import type { Metadata } from "next";
import Link from "next/link";
import LostEthan from "./components/LostEthan";

export const metadata: Metadata = {
  title: "404: Ethan Not Found",
  description: "You found the secret 5th Ethan. He is also lost.",
};

export default function NotFound() {
  return (
    <main
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <p className="relative z-20 mt-6 px-4 py-2 rounded-full bg-white shadow-lg text-sm font-bold uppercase tracking-wide text-[#171717]">
        Error 404 · Secret character unlocked
      </p>

      <h1 className="relative z-20 mt-6 mx-5 text-center uppercase leading-none text-white text-[min(3.75rem,13vw,11vh)] md:text-[min(6rem,10vw,11vh)]">
        Ethan not found
      </h1>

      <p className="relative z-20 mt-3 mx-6 max-w-xl text-center text-white text-lg sm:text-xl font-bold">
        You found the secret 5th Ethan. Unfortunately, he is also lost. He went
        looking for this page and never came back.
      </p>

      <LostEthan />

      <div className="relative z-20 mt-auto mb-24 sm:mb-8 flex flex-col items-center gap-3">
        <p
          className="uppercase text-white text-3xl sm:text-4xl leading-none"
          style={{ fontFamily: "var(--font-londrina-solid), sans-serif" }}
        >
          Continue?
        </p>
        <div className="flex gap-2 sm:gap-3 px-4">
          <Link
            href="/"
            className="px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base whitespace-nowrap rounded-full bg-[#CBBEFF] text-[#171717] font-bold uppercase tracking-wide shadow-lg hover:scale-105 transition-transform"
          >
            Yes, respawn me
          </Link>
          <Link
            href="/?character=misc-dude"
            className="px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base whitespace-nowrap rounded-full bg-white text-[#171717] font-bold uppercase tracking-wide shadow-lg hover:scale-105 transition-transform"
          >
            Pick a real Ethan
          </Link>
        </div>
      </div>
    </main>
  );
}
