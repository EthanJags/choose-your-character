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
import { playSfx } from "./lib/sound";

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
  // False for the drawer's first frame so it mounts off-screen, then slides up
  const [isDrawerUp, setIsDrawerUp] = useState(false);
  const isDrawerOpen = selectedEthan !== null;
  useEffect(() => {
    if (!isDrawerOpen) return;
    // Two frames so the off-screen position is painted before transitioning
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setIsDrawerUp(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [isDrawerOpen]);
  const [lastViewedCharacterIndex, setLastViewedCharacterIndex] = useState<
    number | null
  >(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  // Set when we change ?character= ourselves, so the URL sync below ignores it
  const skipUrlSyncRef = useRef(false);

  // Sound state for exit sound effect (SoundToggle broadcasts the current value on mount)
  const [isSoundOn, setIsSoundOn] = useState(false);
  useEffect(() => {
    const handler = (e: Event) => {
      setIsSoundOn((e as CustomEvent<{ enabled: boolean }>).detail.enabled);
    };
    window.addEventListener("soundToggle", handler);
    return () => window.removeEventListener("soundToggle", handler);
  }, []);

  // Open the character named in the URL when it changes from outside
  // (e.g. a chatbot link), even if another character is already open
  useEffect(() => {
    if (skipUrlSyncRef.current) {
      skipUrlSyncRef.current = false;
      return;
    }
    if (characterIndex >= 0) {
      setLastViewedCharacterIndex(characterIndex);
      setSelectedEthan(characters[characterIndex]);
    }
  }, [charSlug, characterIndex]);

  const replaceCharacterInUrl = useCallback(
    (slug: string | null) => {
      if (slug === charSlug) return;
      skipUrlSyncRef.current = true;
      router.replace(slug ? `/?character=${slug}` : "/", { scroll: false });
    },
    [charSlug, router]
  );

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
    if (isSoundOn) playSfx("/sound-effects/drawer-closing.mov");
    setIsExiting(true);
    setTimeout(() => {
      const index = selectedEthan
        ? characters.findIndex((c) => c.id === selectedEthan.id)
        : -1;
      setLastViewedCharacterIndex(index >= 0 ? index : null);
      setSelectedEthan(null);
      setIsDrawerUp(false);
      setIsExiting(false);
      // Drop ?projects=1 but keep the character so the selection screen remembers it
      router.replace(
        index >= 0 ? `/?character=${characters[index].slug}` : "/",
        { scroll: false }
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
          replaceCharacterInUrl(ethan.slug);
        }}
      />
      {selectedEthan && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto overscroll-none"
          style={{
            backgroundColor: selectedEthan.color,
            // Open and close are both transitions (not a keyframe animation, which
            // would override the transform and slide the drawer back up if it was
            // closed mid-open), so closing always starts from the current position
            transform:
              isDrawerUp && !isExiting ? "translateY(0)" : "translateY(100vh)",
            transition: "transform 800ms ease-out",
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
