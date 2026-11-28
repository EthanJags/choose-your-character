"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { playSfx } from "@/app/lib/sound";

const POKE_LINES = [
  "Hey. Have you seen a page around here?",
  "Ow. That was my map.",
  "I'm not lost. I'm adventuring sideways.",
  "Stop poking me, I'm trying to look cool.",
  "I asked the chatbot for directions. It asked me about myself.",
  "Fun fact: I am 40% engineer, 40% artist, 20% panic.",
  "Okay I will be honest, I also clicked a broken link.",
  "Please. I have a podcast episode.",
  "One more poke and I'm calling my other Ethans.",
];

const RAIN_IMAGES = ["/adventurer.png", "/engineer.png", "/artist.png", "/misc-dude.png"];
const SECRET_POKES = 10;

type Drop = { id: number; src: string; left: number; delay: number; duration: number; spin: number };

export default function LostEthan() {
  const [pokes, setPokes] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [isSoundOn, setIsSoundOn] = useState(false);

  // SoundToggle broadcasts the current value on mount
  useEffect(() => {
    const handler = (e: Event) =>
      setIsSoundOn((e as CustomEvent<{ enabled: boolean }>).detail.enabled);
    window.addEventListener("soundToggle", handler);
    return () => window.removeEventListener("soundToggle", handler);
  }, []);

  const unlocked = pokes >= SECRET_POKES;
  const line =
    pokes === 0
      ? "(psst, poke him)"
      : unlocked
        ? "ACHIEVEMENT UNLOCKED: Professional Ethan Poker. You summoned all of us."
        : POKE_LINES[(pokes - 1) % POKE_LINES.length];

  const poke = () => {
    const next = pokes + 1;
    setPokes(next);
    setSpinning(true);
    setTimeout(() => setSpinning(false), 500);
    if (isSoundOn) {
      if (next === SECRET_POKES) playSfx("/sound-effects/selectCharacter.mp3");
      else playSfx("/sound-effects/menuselect.mov", 0.15);
    }
    if (next === SECRET_POKES) {
      setDrops(
        Array.from({ length: 28 }, (_, i) => ({
          id: i,
          src: RAIN_IMAGES[i % RAIN_IMAGES.length],
          left: Math.random() * 95,
          delay: Math.random() * 1.5,
          duration: 2.2 + Math.random() * 2,
          spin: (Math.random() - 0.5) * 1080,
        }))
      );
      setTimeout(() => setDrops([]), 5000);
    }
  };

  return (
    <div className="relative z-20 flex flex-col items-center mt-4">
      <style>{`
        @keyframes lostWobble { 0%,100% { transform: rotate(-8deg) } 50% { transform: rotate(8deg) } }
        @keyframes lostSpin { from { transform: rotate(0) scale(1) } 50% { transform: rotate(180deg) scale(1.15) } to { transform: rotate(360deg) scale(1) } }
        @keyframes ethanRain { from { transform: translateY(-30vh) rotate(0) } to { transform: translateY(130vh) rotate(var(--spin)) } }
        @media (prefers-reduced-motion: reduce) { .lost-ethan, .ethan-drop { animation: none !important } }
      `}</style>

      <p className="min-h-[3.5rem] max-w-md mx-6 px-4 py-2 rounded-2xl bg-white text-[#171717] text-center font-bold shadow-lg">
        {line}
      </p>

      <button
        type="button"
        onClick={poke}
        aria-label="Poke the lost Ethan"
        className="relative mt-3 flex items-center justify-center cursor-pointer"
      >
        <span
          className="absolute rounded-full w-[min(30vh,50vw)] h-[min(30vh,50vw)] max-w-[380px] max-h-[380px]"
          style={{ background: "conic-gradient(#CBBEFF, #4300DE, #EFFFBE, #FF5100, #CBBEFF)" }}
        />
        <span
          className="lost-ethan relative block"
          style={{
            animation: spinning
              ? "lostSpin 500ms ease-in-out"
              : "lostWobble 1.6s ease-in-out infinite",
          }}
        >
          <Image
            src="/misc-dude.png"
            alt="The lost Ethan, wobbling and confused"
            width={431}
            height={721}
            className="w-auto h-[min(38vh,60vw)] max-w-none -scale-x-100"
            priority
          />
        </span>
        <span
          className="absolute bottom-[2vh] uppercase whitespace-nowrap text-[3.5vh] px-5 py-1 bg-white text-[#171717] -rotate-3 shadow-lg"
          style={{ fontFamily: "var(--font-londrina-solid), sans-serif" }}
        >
          The lost Ethan
        </span>
      </button>

      <p className="mt-2 text-white/80 text-sm font-bold">
        Pokes: {pokes}
        {unlocked ? " 🏆" : ""}
      </p>

      {drops.length > 0 && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {drops.map((d) => (
            <Image
              key={d.id}
              src={d.src}
              alt=""
              width={86}
              height={144}
              className="ethan-drop absolute top-0 w-14 sm:w-20 h-auto"
              style={
                {
                  left: `${d.left}%`,
                  "--spin": `${d.spin}deg`,
                  animation: `ethanRain ${d.duration}s linear ${d.delay}s both`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
