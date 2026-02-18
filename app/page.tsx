"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TitleScreen from "./components/TitleScreen";
import StageSelectionScreen from "./components/StageSelectionScreen";
import ProjectsScreen from "./components/ProjectsScreen";
import SoundToggle from "./components/SoundToggle";
import Music from "./components/Music";
import type { Screen } from "./components/Music";
import { characters } from "./data/content";
import type { ProjectEntry, CharacterEntry } from "./data/content";

export type Project = ProjectEntry;
export type Ethan = CharacterEntry;

function HomeContent() {
  const searchParams = useSearchParams();
  const [selectedEthan, setSelectedEthan] = useState<Ethan | null>(null);
  const [showProjects, setShowProjects] = useState(false);
  const [lastViewedCharacterIndex, setLastViewedCharacterIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    const charSlug = searchParams.get("character");
    if (charSlug) {
      const index = characters.findIndex((c) => c.slug === charSlug);
      if (index >= 0) {
        setLastViewedCharacterIndex(index);
      }
    }
  }, [searchParams]);

  const currentScreen: Screen = showProjects
    ? "projects"
    : selectedEthan
      ? "title"
      : "selection";

  return (
    <div className="relative overflow-hidden min-h-screen">
      <Music screen={currentScreen} selectedCharacter={selectedEthan} />
      <SoundToggle />
      {!showProjects && (
        <StageSelectionScreen
          ethans={characters}
          initialCharacterIndex={lastViewedCharacterIndex}
          onSelect={(ethan: Ethan) => {
            setSelectedEthan(ethan);
            setLastViewedCharacterIndex(
              characters.findIndex((c) => c.id === ethan.id)
            );
          }}
        />
      )}
      {selectedEthan && !showProjects && (
        <div className="absolute inset-0 z-50">
          <TitleScreen
            ethan={selectedEthan}
            onBack={() => {
              setLastViewedCharacterIndex(
                characters.findIndex((c) => c.id === selectedEthan.id)
              );
              setSelectedEthan(null);
            }}
            onEnter={() => setShowProjects(true)}
          />
        </div>
      )}
      {selectedEthan && showProjects && (
        <div className="absolute inset-0 z-50">
          <ProjectsScreen
            ethan={selectedEthan}
            onBack={() => {
              setLastViewedCharacterIndex(
                characters.findIndex((c) => c.id === selectedEthan.id)
              );
              setShowProjects(false);
              setSelectedEthan(null);
            }}
          />
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
