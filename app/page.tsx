"use client";

import { useState } from "react";
import TitleScreen from "./components/TitleScreen";
import StageSelectionScreen from "./components/StageSelectionScreen";

export type Ethan = {
  id: number;
  name: string;
  image: string;
  banner: string;
  color: string;
  secondaryColor: string;
  thirdColor: string;
  titleImage: string;
};

const ethans: Ethan[] = [
  {
    id: 1,
    name: "adventurer",
    image: "/adventurer.png",
    banner: "/adventurer-banner.png",
    color: "#CBBEFF",
    secondaryColor: "#FFE8BE",
    thirdColor: "#FE4A01",
    titleImage: "/adventurer-title.png",
  },
  {
    id: 2,
    name: "artist",
    image: "/artist.png",
    banner: "/artist-banner.png",
    color: "#EFFFBE",
    secondaryColor: "#800001",
    thirdColor: "#800001",
    titleImage: "/artist-title.png",
  },
  {
    id: 3,
    name: "engineer",
    image: "/engineer.png",
    banner: "/engineer-banner.png",
    color: "#4300DE",
    secondaryColor: "#FFE8BE",
    thirdColor: "#FFE8BE",
    titleImage: "/engineer-title.png",
  },
  {
    id: 4,
    name: "misc dude",
    image: "/misc-dude.png",
    banner: "/misc-dude-banner.png",
    color: "#FF5100",
    secondaryColor: "#FFE8BE",
    thirdColor: "#FFE8BE",
    titleImage: "/misc-dude-title.png",
  },
];

export default function Home() {
  const [selectedEthan, setSelectedEthan] = useState<Ethan | null>(null);

  return (
    <div className="relative overflow-hidden min-h-screen">
      <StageSelectionScreen
        ethans={ethans}
        onSelect={(ethan: Ethan) => {
          setSelectedEthan(ethan);
        }}
      />
      {selectedEthan && (
        <div className="absolute inset-0 z-50">
          <TitleScreen ethan={selectedEthan} onBack={() => setSelectedEthan(null)} />
        </div>
      )}
    </div>
  );
}
