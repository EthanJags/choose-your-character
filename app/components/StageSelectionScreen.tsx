"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Buttons from "./Buttons";
import Arrow from "./Arrow";

const ethans = [
  {
    id: 1,
    name: "The Adventurer",
    image: "/adventurer.png",
    banner: "/adventurer-banner.png",
    color: "#CBBEFF",
  },
  {
    id: 2,
    name: "The Artist",
    image: "/artist.png",
    banner: "/artist-banner.png",
    color: "#FDE047",
  },
  {
    id: 3,
    name: "The Engineer",
    image: "/engineer.png",
    banner: "/engineer-banner.png",
    color: "#4300DE",
  },
  {
    id: 4,
    name: "The Misc Dude",
    image: "/misc-dude.png",
    banner: "/misc-dude-banner.png",
    color: "#FF5100",
  },
];

type AnimationState = {
  outgoingIndex: number | null;
  incomingIndex: number;
  direction: "left" | "right";
  phase: "idle" | "animating";
};

export default function StageSelectionScreen() {
  const [animState, setAnimState] = useState<AnimationState>({
    outgoingIndex: null,
    incomingIndex: 0,
    direction: "right",
    phase: "idle",
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentEthan = ethans[animState.incomingIndex];

  // Disable vertical scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Play background music on page load
  useEffect(() => {
    if (audioRef.current) return;

    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.0;
    audioRef.current = audio;

    const tryPlay = () => {
      audio.play().catch(() => {
        // Autoplay blocked - will play on first user interaction
        const playOnInteraction = () => {
          audio.play();
          document.removeEventListener("click", playOnInteraction);
          document.removeEventListener("keydown", playOnInteraction);
        };
        document.addEventListener("click", playOnInteraction);
        document.addEventListener("keydown", playOnInteraction);
      });
    };

    audio.addEventListener("canplaythrough", tryPlay, { once: true });
    audio.src = "/characterSelectSong.mp3";
  }, []);

  const navigateTo = (newIndex: number) => {
    if (animState.phase === "animating" || newIndex === animState.incomingIndex) return;
    if (newIndex < 0 || newIndex >= ethans.length) return;

    const dir = newIndex > animState.incomingIndex ? "right" : "left";
    
    setAnimState({
      outgoingIndex: animState.incomingIndex,
      incomingIndex: newIndex,
      direction: dir,
      phase: "animating",
    });
  };

  useEffect(() => {
    if (animState.phase === "animating") {
      const timer = setTimeout(() => {
        setAnimState((prev) => ({ ...prev, outgoingIndex: null, phase: "idle" }));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [animState.phase]);

  const handlePrevious = () => navigateTo(animState.incomingIndex - 1);
  const handleNext = () => navigateTo(animState.incomingIndex + 1);
  const handleDotClick = (index: number) => navigateTo(index);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [animState.incomingIndex, animState.phase]);

  return (
    <div
      className="min-h-screen w-full h-screen overflow-hidden"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      
      <Image
        src="/mountain.png"
        className="min-w-[100vw] min-h-[50vh] max-h-[60vh] absolute top-[50%] left-1/2 -translate-x-1/2 z-10"
        alt="Mountain"
        width={2038}
        height={916}
      />
      <div className="absolute inset-0 bg-black/40" />
      {/* Select your Ethan */}
      <h1 className="text-6xl md:text-8xl text-white text-center uppercase absolute z-20 top-[20vh] -translate-y-1/2 left-0 right-0 lg:mx-20">
        Select your Ethan
      </h1>

      {/* CIRCLE */}
      <div
        className={`max-w-[509px] max-h-[509px] w-[40vh] h-[40vh] rounded-full absolute z-8`}
        style={{ 
          backgroundColor: currentEthan.color,
          transition: "background-color 800ms ease-out",
        }}
      />

      {/* Ethan's Character */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 z-20 h-[60vh] w-fit flex items-center justify-center overflow-visible">
        {ethans.map((ethan, index) => {
          const isOutgoing = animState.outgoingIndex === index;
          const isIncoming = animState.incomingIndex === index;
          const isAnimating = animState.phase === "animating";
          const dir = animState.direction;

          if (!isOutgoing && !isIncoming) return null;

          let translateX = "0";
          if (isAnimating && isOutgoing) {
            translateX = dir === "right" ? "-100vw" : "100vw";
          }

          return (
            <div
              key={ethan.id}
              className="absolute flex items-center justify-center"
              style={{
                transform: `translateX(${translateX})`,
                transition: isAnimating ? "transform 800ms ease-out" : "none",
                ...(isIncoming && isAnimating && {
                  animation: `slideIn${dir === "right" ? "FromRight" : "FromLeft"} 800ms ease-out forwards`,
                }),
              }}
            >
              <Image
                src={ethan.image}
                alt={ethan.name}
                width={431}
                height={721}
                className="w-auto h-[60vh] max-w-none"
              />
              <Image
                src={ethan.banner}
                alt={ethan.name}
                width={431}
                height={721}
                className="h-auto w-full max-w-none absolute z-20 scale-110 translate-y-34"
              />
              <h1 className="text-5xl absolute text-center uppercase z-20 scale-110 translate-y-33">
                {ethan.name}
              </h1>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {animState.incomingIndex > 0 && (
        <Arrow
          direction="left"
          color={currentEthan.color}
          onClick={handlePrevious}
        />
      )}
      {animState.incomingIndex < ethans.length - 1 && (
        <Arrow
          direction="right"
          color={currentEthan.color}
          onClick={handleNext}
        />
      )}

      {/* Buttons */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
        <Buttons
          activeIndex={animState.incomingIndex}
          activeColor={currentEthan.color}
          onDotClick={handleDotClick}
        />
      </div>
    </div>
  );
}
