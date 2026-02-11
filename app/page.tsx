"use client";

import { useState } from "react";
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

export default function Home() {
  const [selectedEthan, setSelectedEthan] = useState<Ethan | null>(null);
  const [showProjects, setShowProjects] = useState(false);

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
          onSelect={(ethan: Ethan) => {
            setSelectedEthan(ethan);
          }}
        />
      )}
      {selectedEthan && !showProjects && (
        <div className="absolute inset-0 z-50">
          <TitleScreen
            ethan={selectedEthan}
            onBack={() => setSelectedEthan(null)}
            onEnter={() => setShowProjects(true)}
          />
        </div>
      )}
      {selectedEthan && showProjects && (
        <div className="absolute inset-0 z-50">
          <ProjectsScreen
            ethan={selectedEthan}
            onBack={() => {
          setShowProjects(false);
          setSelectedEthan(null);
        }}
          />
        </div>
      )}
    </div>
  );
}
