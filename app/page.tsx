"use client";

import { useState, useEffect, Suspense } from "react";
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
  const shouldShowProjects = showProjectsParam === "1" && characterIndex >= 0;

  const [selectedEthan, setSelectedEthan] = useState<Ethan | null>(() =>
    shouldShowProjects ? characters[characterIndex] : null
  );
  const [showProjects, setShowProjects] = useState(shouldShowProjects);
  const [lastViewedCharacterIndex, setLastViewedCharacterIndex] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (charSlug && characterIndex >= 0) {
      setLastViewedCharacterIndex(characterIndex);
      if (shouldShowProjects) {
        setSelectedEthan(characters[characterIndex]);
        setShowProjects(true);
      }
    }
  }, [charSlug, characterIndex, shouldShowProjects]);

  const currentScreen: Screen = showProjects
    ? "projects"
    : selectedEthan
      ? "title"
      : "selection";

  return (
    <div className="relative overflow-hidden min-h-screen">
      <Music screen={currentScreen} selectedCharacter={selectedEthan} />
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
            initialProjectSlug={searchParams.get("project") ?? undefined}
            onBack={() => {
              const index = characters.findIndex((c) => c.id === selectedEthan.id);
              setLastViewedCharacterIndex(index);
              setShowProjects(false);
              setSelectedEthan(null);
              router.replace(
                index >= 0 ? `/?character=${characters[index].slug}` : "/"
              );
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
