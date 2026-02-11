"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Buttons from "./Buttons";
import Arrow from "./Arrow";
import AboutSection from "./AboutSection";
import type { Ethan } from "@/app/page";
import { uiStrings } from "@/app/data/content";



type StageSelectionScreenProps = {
  ethans: Ethan[];
  onSelect: (ethan: Ethan) => void;
};

type AnimationState = {
  outgoingIndex: number | null;
  incomingIndex: number;
  direction: "left" | "right";
  phase: "idle" | "animating";
};

export default function StageSelectionScreen({ ethans, onSelect }: StageSelectionScreenProps) {
  const [animState, setAnimState] = useState<AnimationState>({
    outgoingIndex: null,
    incomingIndex: 0,
    direction: "right",
    phase: "idle",
  });
  const [isSmallScreen, setIsSmallScreen] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 639px)").matches;
  });
  const [isSoundOn, setIsSoundOn] = useState(() => {
    if (typeof window === "undefined") return true;
    const savedPreference = localStorage.getItem("soundEnabled");
    return savedPreference === null ? true : savedPreference === "true";
  });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"select" | "about">("select");
  const [hoveredTab, setHoveredTab] = useState<"select" | "about" | null>(null);

  const currentEthan = ethans[animState.incomingIndex];

  // Disable vertical scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Detect screen size below sm breakpoint (640px)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsSmallScreen(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Listen to sound toggle events
  useEffect(() => {
    const handleSoundToggle = (e: CustomEvent<{ enabled: boolean }>) => {
      setIsSoundOn(e.detail.enabled);
    };

    window.addEventListener("soundToggle", handleSoundToggle as EventListener);

    return () => {
      window.removeEventListener("soundToggle", handleSoundToggle as EventListener);
    };
  }, []);

  const navigateTo = useCallback((newIndex: number) => {
    setHoveredIndex(null);
    setAnimState((prev) => {
      if (prev.phase === "animating" || newIndex === prev.incomingIndex) return prev;

      let wrappedIndex = newIndex;
      if (newIndex < 0) {
        wrappedIndex = ethans.length - 1;
      } else if (newIndex >= ethans.length) {
        wrappedIndex = 0;
      }

      if (wrappedIndex === prev.incomingIndex) return prev;

      if (isSoundOn) {
        const audio = new Audio("/sound-effects/menuselect.mov");
        audio.currentTime = 0.15;
        audio.play();
      }

      let dir: "left" | "right";
      if (newIndex < 0) {
        dir = "left";
      } else if (newIndex >= ethans.length) {
        dir = "right";
      } else {
        dir = wrappedIndex > prev.incomingIndex ? "right" : "left";
      }

      return {
        outgoingIndex: prev.incomingIndex,
        incomingIndex: wrappedIndex,
        direction: dir,
        phase: "animating",
      };
    });
  }, [ethans.length, isSoundOn]);

  useEffect(() => {
    if (animState.phase === "animating") {
      const timer = setTimeout(() => {
        setAnimState((prev) => ({ ...prev, outgoingIndex: null, phase: "idle" }));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [animState.phase]);

  const handlePrevious = useCallback(() => {
    navigateTo(animState.incomingIndex - 1);
  }, [animState.incomingIndex, navigateTo]);
  const handleNext = useCallback(() => {
    navigateTo(animState.incomingIndex + 1);
  }, [animState.incomingIndex, navigateTo]);
  const handleDotClick = useCallback((index: number) => navigateTo(index), [navigateTo]);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  // Horizontal wheel scroll to navigate
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (activeTab === "about") return;
      if (animState.phase === "animating") return;
      const threshold = 50;
      if (e.deltaX > threshold) {
        navigateTo(animState.incomingIndex + 1);
      } else if (e.deltaX < -threshold) {
        navigateTo(animState.incomingIndex - 1);
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: true });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [activeTab, animState.incomingIndex, animState.phase, navigateTo]);

  // Touch swipe to navigate
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (activeTab === "about") return;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (activeTab === "about") return;
      if (animState.phase === "animating") return;
      const deltaX = touchStartX.current - e.changedTouches[0].clientX;
      const threshold = 50;
      if (deltaX > threshold) {
        navigateTo(animState.incomingIndex + 1);
      } else if (deltaX < -threshold) {
        navigateTo(animState.incomingIndex - 1);
      }
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeTab, animState.incomingIndex, animState.phase, navigateTo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab === "about") return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigateTo(animState.incomingIndex - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateTo(animState.incomingIndex + 1);
      } else if (e.key === "Enter" && animState.phase === "idle") {
        e.preventDefault();
        if (isSoundOn) {
          const selectAudio = new Audio("/sound-effects/selectCharacter.mp3");
          selectAudio.play().catch(() => {});
        }
        onSelect(ethans[animState.incomingIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, animState.incomingIndex, animState.phase, ethans, isSoundOn, onSelect, navigateTo]);

  const handleTabClick = (tab: "select" | "about") => {
    if (tab === activeTab) return;
    if (isSoundOn) {
      const audio = new Audio("/sound-effects/menuselect.mov");
      audio.currentTime = 0.15;
      audio.play();
    }
    setActiveTab(tab);
  };

  return (
    <div
      ref={containerRef}
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
      {/* Top bar toggle */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-1 py-1 bg-white rounded-full shadow-lg">
        <button
          onClick={() => handleTabClick("select")}
          onMouseEnter={() => setHoveredTab("select")}
          onMouseLeave={() => setHoveredTab(null)}
          className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-colors duration-300"
          style={{
            backgroundColor: activeTab === "select" ? currentEthan.color : "transparent",
            color: activeTab === "select" ? "#171717" : hoveredTab === "select" ? "#171717" : "#6B6B6B",
          }}
        >
          Projects
        </button>
        <button
          onClick={() => handleTabClick("about")}
          onMouseEnter={() => setHoveredTab("about")}
          onMouseLeave={() => setHoveredTab(null)}
          className="px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-colors duration-300"
          style={{
            backgroundColor: activeTab === "about" ? "#d1d5db" : "transparent",
            color: activeTab === "about" ? "#000" : hoveredTab === "about" ? "#171717" : "#6B6B6B",
          }}
        >
          About
        </button>
      </div>

      <Image
        src="/mountain.png"
        className="min-w-[100vw] min-h-[50vh] max-h-[60vh] absolute top-[50%] left-1/2 -translate-x-1/2 z-10"
        alt="Mountain"
        width={2038}
        height={916}
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Left and Right Clouds - visible on lg screens and above */}
      <Image
        src="/left cloud.png"
        alt="Left Cloud"
        width={1939}
        height={592}
        className="hidden lg:block absolute left-0 top-[15vh] -translate-x-1/4 z-5 w-[40vw] h-auto opacity-80"
      />
      <Image
        src="/right cloud.png"
        alt="Right Cloud"
        width={1939}
        height={592}
        className="hidden lg:block absolute right-0 top-[15vh] translate-x-1/3 z-5 w-[40vw] h-auto opacity-80"
      />
      {activeTab === "select" && (
        <>
          {/* Select your Ethan */}
          <h1 className="text-6xl md:text-8xl text-white text-center uppercase absolute z-20 top-[20vh] -translate-y-1/2 left-0 right-0 mx-5 lg:mx-20">
            {uiStrings.selectCharacter}
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
        {ethans.map((ethan: Ethan, index: number) => {
          const isOutgoing = animState.outgoingIndex === index;
          const isIncoming = animState.incomingIndex === index;
          const isAnimating = animState.phase === "animating";
          const dir = animState.direction;

          if (!isOutgoing && !isIncoming) return null;

          let translateX = "0";
          if (isAnimating && isOutgoing) {
            translateX = dir === "right" ? "-100vw" : "100vw";
          }

          const isHovered = hoveredIndex === index && isIncoming && !isAnimating;
          const scale = isHovered ? 1.08 : 1;
          const translateY = isHovered ? "-15px" : "0px";
          
          return (
            <div
              key={ethan.id}
              onMouseEnter={() => {
                if (isIncoming && !isAnimating) {
                  setHoveredIndex(index);
                }
              }}
              onMouseLeave={() => {
                setHoveredIndex(null);
              }}
              onClick={() => {
                if (isIncoming) {
                  if (isSoundOn) {
                    const selectAudio = new Audio("/sound-effects/selectCharacter.mp3");
                    selectAudio.play().catch(() => {
                      // Ignore autoplay errors
                    });
                  }
                  onSelect(ethan);
                }
              }}
              className={`absolute flex items-center justify-center ${isIncoming ? 'cursor-pointer' : ''}`}
              style={{
                transform: `translateX(${translateX}) translateY(${translateY}) scale(${scale})`,
                transition: isAnimating ? "transform 800ms ease-out" : isIncoming ? "transform 300ms ease-out" : "none",
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
                className="h-auto w-full max-w-none absolute z-20 scale-110 translate-y-[12vh]"
              />
              <h1 className="text-[4vh] absolute text-center uppercase z-20 scale-110 whitespace-nowrap translate-y-[11.5vh]">
                The {ethan.name}
              </h1>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <Arrow
        direction="left"
        color={isSmallScreen ? "black" : currentEthan.color}
        onClick={handlePrevious}
      />
      <Arrow
        direction="right"
        color={isSmallScreen ? "black" : currentEthan.color}
        onClick={handleNext}
      />

      {/* Buttons */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20">
        <Buttons
          activeIndex={animState.incomingIndex}
          activeColor={currentEthan.color}
          onDotClick={handleDotClick}
        />
      </div>
        </>
      )}

      {activeTab === "about" && <AboutSection />}
    </div>
  );
}
