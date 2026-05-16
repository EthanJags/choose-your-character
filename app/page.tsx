"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TitleScreen from "./components/TitleScreen";
import StageSelectionScreen from "./components/StageSelectionScreen";
import ProjectsScreen from "./components/ProjectsScreen";
import Music from "./components/Music";
import type { Screen } from "./components/Music";
import { characters } from "./data/content";
import type { ProjectEntry, CharacterEntry } from "./data/content";

export type Project = ProjectEntry;
export type Ethan = CharacterEntry;

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const charSlug = searchParams.get("character");
  const showProjectsParam = searchParams.get("projects");
  const characterIndex =
    charSlug != null ? characters.findIndex((c) => c.slug === charSlug) : -1;

  const [selectedEthan, setSelectedEthan] = useState<Ethan | null>(() =>
    characterIndex >= 0 ? characters[characterIndex] : null
  );
  const [isExiting, setIsExiting] = useState(false);
  const [lastViewedCharacterIndex, setLastViewedCharacterIndex] = useState<
    number | null
  >(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Sound state for exit sound effect
  const [isSoundOn, setIsSoundOn] = useState(true);
  useEffect(() => {
    const saved = localStorage.getItem("soundEnabled");
    if (saved !== null) setIsSoundOn(saved === "true");
    const handler = (e: Event) => {
      setIsSoundOn((e as CustomEvent<{ enabled: boolean }>).detail.enabled);
    };
    window.addEventListener("soundToggle", handler);
    return () => window.removeEventListener("soundToggle", handler);
  }, []);

  useEffect(() => {
    if (charSlug && characterIndex >= 0) {
      setLastViewedCharacterIndex(characterIndex);
      if (!selectedEthan) {
        setSelectedEthan(characters[characterIndex]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charSlug, characterIndex]);

  // Auto-scroll to gallery if URL has projects=1
  useEffect(() => {
    if (showProjectsParam === "1" && selectedEthan && galleryRef.current) {
      const timer = setTimeout(() => {
        galleryRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [showProjectsParam, selectedEthan]);

  const currentScreen: Screen = selectedEthan ? "title" : "selection";

  useEffect(() => {
    const themeColor = selectedEthan ? selectedEthan.color : "#ffffff";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", themeColor);
    }
    if (selectedEthan) {
      const detail = {
        color: selectedEthan.color,
        secondaryColor: selectedEthan.secondaryColor,
        thirdColor: selectedEthan.thirdColor,
        name: selectedEthan.name,
      };
      (window as unknown as { __activeCharacter?: typeof detail }).__activeCharacter = detail;
      window.dispatchEvent(new CustomEvent("characterChange", { detail }));
    }
  }, [selectedEthan]);

  const handleBack = useCallback(() => {
    if (isExiting) return;
    if (isSoundOn) {
      const audio = new Audio("/sound-effects/drawer-closing.mov");
      audio.play().catch(() => {});
    }
    setIsExiting(true);
    setTimeout(() => {
      const index = selectedEthan
        ? characters.findIndex((c) => c.id === selectedEthan.id)
        : -1;
      setLastViewedCharacterIndex(index >= 0 ? index : null);
      setSelectedEthan(null);
      setIsExiting(false);
      router.replace(
        index >= 0 ? `/?character=${characters[index].slug}` : "/"
      );
    }, 800);
  }, [isExiting, isSoundOn, selectedEthan, router]);

  const handleScrollToGallery = useCallback(() => {
    galleryRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="relative overflow-hidden min-h-screen">
      <Music screen={currentScreen} selectedCharacter={selectedEthan} />
      <StageSelectionScreen
        ethans={characters}
        active={!selectedEthan}
        initialCharacterIndex={lastViewedCharacterIndex}
        onSelect={(ethan: Ethan) => {
          setSelectedEthan(ethan);
          setLastViewedCharacterIndex(
            characters.findIndex((c) => c.id === ethan.id)
          );
        }}
      />
      {selectedEthan && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto overscroll-none"
          style={{
            backgroundColor: selectedEthan.color,
            transform: isExiting ? "translateY(100vh)" : "translateY(0)",
            transition: "transform 800ms ease-out",
            animation: "slideUpFromBottom 800ms ease-out",
          }}
        >
          <TitleScreen
            ethan={selectedEthan}
            onBack={handleBack}
            onEnter={handleScrollToGallery}
          />
          <div ref={galleryRef}>
            <ProjectsScreen ethan={selectedEthan} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
