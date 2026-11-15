"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";
import { characters } from "@/app/data/content";
import { playSfx } from "@/app/lib/sound";
import { isInteractiveTarget } from "@/app/lib/keyboard";

// The 404 page doubles as a hidden fifth slot on the character select: a
// silhouette of a random Ethan and a "who's that Ethan?" guessing game.

const QUIPS: Record<string, string> = {
  adventurer: "Got lost on purpose. Honestly the best way to find something memorable.",
  engineer: "Pretty sure this is a routing bug. I'll ship a fix… eventually.",
  artist: "Wandered off chasing a melody. Happens more than I'd like to admit.",
  "misc-dude": "No idea how I got here either. Wanna hang out anyway?",
};

const INK = "#171717";
const MYSTERY_GRAY = "#8f8f8f";
const STREAK_KEY = "ethanNotFoundStreak";

type Phase = "guessing" | "revealed";

function pickIndex(exclude: number | null) {
  let next = Math.floor(Math.random() * characters.length);
  if (next === exclude) next = (next + 1 + Math.floor(Math.random() * (characters.length - 1))) % characters.length;
  return next;
}

function readStreak() {
  try {
    return Number(sessionStorage.getItem(STREAK_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeStreak(n: number) {
  try {
    sessionStorage.setItem(STREAK_KEY, String(n));
  } catch {
    // Storage unavailable — the streak just won't survive a reload
  }
}

// Client-only values read through useSyncExternalStore: the server renders the
// "loading" snapshot (no silhouette yet, streak 0) so hydration matches.
const noSubscribe = () => () => {};
let firstPick: number | null = null;
function getFirstPick() {
  if (firstPick === null) firstPick = pickIndex(null);
  return firstPick;
}

export default function EthanNotFound() {
  const initialIndex = useSyncExternalStore(noSubscribe, getFirstPick, () => null);
  const storedStreak = useSyncExternalStore(noSubscribe, readStreak, () => 0);
  const [pickedIndex, setHiddenIndex] = useState<number | null>(null);
  const [streakState, setStreak] = useState<number | null>(null);
  const hiddenIndex = pickedIndex ?? initialIndex;
  const streak = streakState ?? storedStreak;
  const [phase, setPhase] = useState<Phase>("guessing");
  const [guessIndex, setGuessIndex] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const playAgainRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    posthog.capture("easter_egg_404_viewed", { path: window.location.pathname });
  }, []);

  useEffect(() => {
    const onSound = (e: Event) => setIsSoundOn((e as CustomEvent<{ enabled: boolean }>).detail.enabled);
    window.addEventListener("soundToggle", onSound);
    return () => window.removeEventListener("soundToggle", onSound);
  }, []);

  const hidden = hiddenIndex === null ? null : characters[hiddenIndex];
  const revealed = phase === "revealed";
  const correct = revealed && guessIndex === hiddenIndex;

  const guess = useCallback(
    (index: number) => {
      if (hiddenIndex === null || phase !== "guessing") return;
      const isCorrect = index === hiddenIndex;
      const nextStreak = isCorrect ? streak + 1 : 0;
      setGuessIndex(index);
      setPhase("revealed");
      setStreak(nextStreak);
      writeStreak(nextStreak);
      if (isSoundOn) {
        playSfx(isCorrect ? "/sound-effects/selectCharacter.mp3" : "/sound-effects/drawer-closing.mov");
      }
      const c = characters[hiddenIndex];
      const detail = { color: c.color, secondaryColor: c.secondaryColor, thirdColor: c.thirdColor, name: c.name };
      (window as unknown as { __activeCharacter?: typeof detail }).__activeCharacter = detail;
      window.dispatchEvent(new CustomEvent("characterChange", { detail }));
      posthog.capture("easter_egg_404_guess", {
        answer: c.slug,
        guess: characters[index].slug,
        correct: isCorrect,
        streak: nextStreak,
      });
    },
    [hiddenIndex, phase, streak, isSoundOn]
  );

  const playAgain = useCallback(() => {
    setHiddenIndex(pickIndex(hiddenIndex));
    setGuessIndex(null);
    setPhase("guessing");
    setRound((r) => r + 1);
    if (isSoundOn) playSfx("/sound-effects/menuselect.mov", 0.15);
  }, [hiddenIndex, isSoundOn]);

  // Move focus to "Play again" after a reveal so Enter/Space keeps the game going
  useEffect(() => {
    if (revealed) playAgainRef.current?.focus({ preventScroll: true });
  }, [revealed]);

  // 1-4 to guess, Enter/Space to play again
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (phase === "guessing" && n >= 1 && n <= characters.length) {
        e.preventDefault();
        guess(n - 1);
      } else if (phase === "revealed" && (e.key === "Enter" || e.key === " ") && !isInteractiveTarget(e.target)) {
        e.preventDefault();
        playAgain();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, guess, playAgain]);

  const circleColor = revealed && hidden ? hidden.color : MYSTERY_GRAY;

  return (
    <main
      className="enf relative w-full h-[100dvh] overflow-hidden flex flex-col items-center"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <style>{`
        .enf-cloud-l { animation: enfDrift 14s ease-in-out infinite alternate; }
        .enf-cloud-r { animation: enfDrift 17s ease-in-out infinite alternate-reverse; }
        @keyframes enfDrift { from { translate: -3vw 0; } to { translate: 3vw 1.5vh; } }
        .enf-float { animation: enfFloat 3.2s ease-in-out infinite; }
        @keyframes enfFloat { 0%, 100% { translate: 0 0; } 50% { translate: 0 -10px; } }
        .enf-pop { animation: enfPop 520ms cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes enfPop { 0% { scale: 0.92; } 60% { scale: 1.07; } 100% { scale: 1; } }
        .enf-stamp { animation: enfStamp 420ms cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        @keyframes enfStamp {
          0% { opacity: 0; transform: rotate(-14deg) scale(2.4); }
          100% { opacity: 1; transform: rotate(-14deg) scale(1); }
        }
        .enf-shake { animation: enfShake 420ms ease-in-out; }
        @keyframes enfShake {
          0%, 100% { translate: 0 0; } 20% { translate: -6px 0; } 40% { translate: 6px 0; }
          60% { translate: -4px 0; } 80% { translate: 4px 0; }
        }
        .enf-q { animation: enfQ 2.6s ease-in-out infinite; }
        @keyframes enfQ { 0%, 100% { opacity: 0.35; translate: 0 0; } 50% { opacity: 0.9; translate: 0 -8px; } }
        .enf-in { animation: enfIn 380ms ease-out both; }
        @keyframes enfIn { from { opacity: 0; translate: 0 8px; } to { opacity: 1; translate: 0 0; } }
        .enf-guess:hover:not(:disabled) { background: var(--c); color: var(--t); }
        .enf-guess:focus-visible, .enf-action:focus-visible { outline: 3px solid ${INK}; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          .enf *, .enf *::before, .enf *::after { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* Scenery, layered like the character select */}
      <Image
        src="/mountain.png"
        alt=""
        width={2038}
        height={916}
        priority
        className="pointer-events-none min-w-[100vw] min-h-[50vh] max-h-[60vh] absolute top-[50%] left-1/2 -translate-x-1/2 z-10"
      />
      <div className="absolute inset-0 bg-black/40 z-[1]" />
      <Image
        src="/left cloud.png"
        alt=""
        width={1939}
        height={592}
        priority
        className="enf-cloud-l pointer-events-none hidden md:block absolute left-0 top-[15vh] -translate-x-1/4 z-[5] w-[40vw] h-auto opacity-80"
      />
      <Image
        src="/right cloud.png"
        alt=""
        width={1939}
        height={592}
        priority
        className="enf-cloud-r pointer-events-none hidden md:block absolute right-0 top-[15vh] translate-x-1/3 z-[5] w-[40vw] h-auto opacity-80"
      />

      {/* Top pill, same shape as the Projects / About toggle */}
      <div className="relative z-30 mt-5 flex items-center gap-1 px-1 py-1 bg-white rounded-full shadow-lg shrink-0">
        <span
          className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide"
          style={{ background: INK, color: "#fff" }}
        >
          Error 404
        </span>
        <span className="px-3 py-2 text-sm font-bold uppercase tracking-wide text-[#6B6B6B]">
          {streak > 0 ? `Streak × ${streak}` : "Secret slot"}
        </span>
      </div>

      <h1 className="relative z-30 mt-[2vh] mx-5 shrink-0 text-[min(3.4rem,13vw,10vh)] md:text-[min(6rem,11vw,11vh)] leading-none text-white text-center uppercase pointer-events-none">
        Ethan not found
      </h1>
      <p
        className="relative z-30 mx-6 mt-[1vh] shrink-0 text-center text-white/90 text-[min(1.35rem,4.6vw,3vh)] leading-tight"
        style={{ fontFamily: "var(--font-figma-hand), 'Patrick Hand', cursive" }}
      >
        This page doesn&apos;t exist… but somebody wandered in here. Can you tell who?
      </p>

      {/* Stage: circle + silhouette + torn-paper label */}
      <div className="relative z-20 flex-1 w-full min-h-0 py-4 flex items-center justify-center">
        {!revealed &&
          ["?", "?", "?"].map((q, i) => (
            <span
              key={i}
              aria-hidden
              className="enf-q absolute z-10 text-white pointer-events-none"
              style={{
                fontFamily: "var(--font-londrina-solid), sans-serif",
                fontSize: `min(${[7, 5, 6][i]}vh, ${[13, 9, 11][i]}vw)`,
                left: `calc(50% + ${[-24, 18, 21][i]}vh)`,
                top: `${[22, 16, 58][i]}%`,
                animationDelay: `${i * 0.7}s`,
              }}
            >
              {q}
            </span>
          ))}

        <div
          key={round}
          className={`relative h-full max-h-[52vh] aspect-[431/721] ${revealed ? "enf-pop" : "enf-float"}`}
          style={{ containerType: "inline-size" }}
        >
          {/* Circle sized off the character, same proportion as the select screen */}
          <div
            className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-[112%] aspect-square rounded-full"
            style={{ background: circleColor, transition: "background-color 700ms ease-out" }}
          />
          {characters.map((c, i) => (
            <Image
              key={c.id}
              src={c.image}
              alt={i === hiddenIndex && revealed ? `The ${c.name}` : ""}
              width={431}
              height={721}
              priority
              draggable={false}
              className="absolute inset-0 w-full h-full object-contain select-none"
              style={{
                opacity: i === hiddenIndex ? 1 : 0,
                filter: i === hiddenIndex && revealed ? "none" : "brightness(0)",
                transition: "filter 600ms ease-out, opacity 200ms ease-out",
              }}
            />
          ))}

          {/* Torn paper label */}
          <div className="absolute left-1/2 bottom-[6%] -translate-x-1/2 w-[115%] flex items-center justify-center">
            <Image
              src="/adventurer-banner.png"
              alt=""
              width={2193}
              height={608}
              className="w-full h-auto"
            />
            <span
              className="absolute uppercase whitespace-nowrap leading-none text-[10.5cqw]"
              style={{ fontFamily: "var(--font-londrina-solid), sans-serif", color: INK }}
            >
              {revealed && hidden ? `It's the ${hidden.name}!` : "Who's that Ethan?"}
            </span>
          </div>

          {revealed && (
            <span
              className="enf-stamp absolute right-[-18%] top-[18%] px-3 py-1 rounded-lg uppercase leading-none text-[14cqw]"
              style={{
                fontFamily: "var(--font-londrina-solid), sans-serif",
                color: correct ? "#1f9d55" : "#e3342f",
                border: `4px solid ${correct ? "#1f9d55" : "#e3342f"}`,
                background: "rgba(255,255,255,0.85)",
              }}
            >
              {correct ? "Nailed it!" : "Nope!"}
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-30 w-full shrink-0 px-4 pb-[calc(88px+env(safe-area-inset-bottom))] sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-3">
        {!revealed ? (
          <>
            <div className="grid grid-cols-2 sm:flex gap-1 p-1 bg-white rounded-[28px] sm:rounded-full shadow-lg">
              {characters.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => guess(i)}
                  disabled={hiddenIndex === null}
                  className="enf-guess px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide text-[#3a3a3a] transition-colors duration-200 cursor-pointer"
                  style={{ ["--c" as string]: c.color, ["--t" as string]: c.slug === "engineer" ? "#fff" : INK }}
                >
                  <span className="opacity-50 mr-1.5">{i + 1}</span>
                  {c.name}
                </button>
              ))}
            </div>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest hidden sm:block">
              Click a name or press 1–4
            </p>
          </>
        ) : (
          hidden && (
            <div className="enf-in flex flex-col items-center gap-3 max-w-[560px]">
              <p
                className="bg-white rounded-2xl px-4 py-2 text-center text-[17px] leading-snug shadow-lg"
                style={{ fontFamily: "var(--font-figma-hand), 'Patrick Hand', cursive", color: INK, border: `2px solid ${INK}` }}
              >
                <span className="font-bold">The {hidden.name}:</span> &ldquo;{QUIPS[hidden.slug]}&rdquo;
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  ref={playAgainRef}
                  onClick={playAgain}
                  className="enf-action px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide bg-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
                  style={{ color: INK }}
                >
                  Play again
                </button>
                <Link
                  href={`/?character=${hidden.slug}`}
                  className="enf-action px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg hover:scale-105 transition-transform"
                  style={{ background: hidden.color, color: hidden.slug === "engineer" ? "#fff" : INK }}
                >
                  Go home with the {hidden.name} →
                </Link>
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
}
