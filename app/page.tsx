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
};

const ethans: Ethan[] = [
  {
    id: 1,
    name: "Adventurer",
    image: "/adventurer.png",
    banner: "/adventurer-banner.png",
    color: "#CBBEFF",
    secondaryColor: "#FFE8BE",
    thirdColor: "#FE4A01",
  },
  {
    id: 2,
    name: "Artist",
    image: "/artist.png",
    banner: "/artist-banner.png",
    color: "#EFFFBE",
    secondaryColor: "#800001",
    thirdColor: "#800001",
  },
  {
    id: 3,
    name: "Engineer",
    image: "/engineer.png",
    banner: "/engineer-banner.png",
    color: "#4300DE",
    secondaryColor: "#FFE8BE",
    thirdColor: "#FFE8BE",
  },
  {
    id: 4,
    name: "Misc Dude",
    image: "/misc-dude.png",
    banner: "/misc-dude-banner.png",
    color: "#FF5100",
    secondaryColor: "#FFE8BE",
    thirdColor: "#FFE8BE",
  },
];

export default function Home() {
  const [selectedEthan, setSelectedEthan] = useState<Ethan | null>(null);

  if (selectedEthan) {
    return <TitleScreen ethan={selectedEthan} onBack={() => setSelectedEthan(null)} />;
  }

  return (
    <div>
      <StageSelectionScreen 
        ethans={ethans} 
        onSelect={(ethan: Ethan) => {
          setSelectedEthan(ethan);
        }} 
      />
    </div>
  );
}
