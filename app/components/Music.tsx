"use client";

import { useEffect, useRef, useState } from "react";
import type { Ethan } from "@/app/page";

export type Screen = "selection" | "title" | "projects";

type MusicProps = {
  screen: Screen;
  selectedCharacter: Ethan | null;
};

const FADE_DURATION = 800;
const TARGET_VOLUME = 0.5;

function getMusicForScreen(screen: Screen, character: Ethan | null): string {
  if ((screen === "title" || screen === "projects") && character) {
    // Special case for adventurer (file is "adventure.mp3" not "adventurer.mp3")
    if (character.name === "adventurer") {
      return "/music/adventure.mp3";
    }
    // Replace spaces with hyphens for file names (e.g., "misc dude" -> "misc-dude.mp3")
    const filename = character.name.replace(/\s+/g, "-");
    return `/music/${filename}.mp3`;
  }
  return "/music/characterSelectSong.mp3";
}

function stopFade(fadeIntervalRef: { current: NodeJS.Timeout | null }) {
  if (fadeIntervalRef.current) {
    clearInterval(fadeIntervalRef.current);
    fadeIntervalRef.current = null;
  }
}

function playWithFadeIn(
  audio: HTMLAudioElement,
  fadeIntervalRef: { current: NodeJS.Timeout | null }
) {
  stopFade(fadeIntervalRef);
  audio.play().catch(() => {
    // Autoplay blocked - SoundToggle only turns sound on after a user interaction
  });

  // Fade in from the current volume over 2 seconds
  const fadeSteps = 50;
  const fadeInterval = 2000 / fadeSteps;
  const startVolume = audio.volume;
  const volumeStep = (TARGET_VOLUME - startVolume) / fadeSteps;

  let currentStep = 0;
  fadeIntervalRef.current = setInterval(() => {
    currentStep++;
    audio.volume = Math.min(startVolume + volumeStep * currentStep, TARGET_VOLUME);
    if (currentStep >= fadeSteps) stopFade(fadeIntervalRef);
  }, fadeInterval);
}

export default function Music({ screen, selectedCharacter }: MusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const isSoundOnRef = useRef(false);

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

  // Start or stop the current track when sound is toggled
  useEffect(() => {
    isSoundOnRef.current = isSoundOn;
    const audio = audioRef.current;
    if (!audio) return;

    if (isSoundOn) {
      playWithFadeIn(audio, fadeIntervalRef);
    } else {
      stopFade(fadeIntervalRef);
      audio.volume = 0;
      audio.pause();
    }
  }, [isSoundOn]);

  // Handle music changes based on screen and character
  useEffect(() => {
    const targetTrack = getMusicForScreen(screen, selectedCharacter);

    // If same track, no need to change
    if (audioRef.current && audioRef.current.src.endsWith(targetTrack)) {
      return;
    }

    stopFade(fadeIntervalRef);

    const previousAudio = audioRef.current;
    const previousVolume = previousAudio?.volume ?? 0;

    // Fade out the previous track
    if (previousAudio && previousVolume > 0 && !previousAudio.paused) {
      const fadeSteps = 40;
      const fadeInterval = FADE_DURATION / fadeSteps;
      const volumeStep = previousVolume / fadeSteps;

      let currentStep = 0;
      const fadeOutInterval = setInterval(() => {
        currentStep++;
        const newVolume = Math.max(previousVolume - volumeStep * currentStep, 0);
        previousAudio.volume = newVolume;

        if (currentStep >= fadeSteps || newVolume <= 0) {
          clearInterval(fadeOutInterval);
          previousAudio.pause();
          previousAudio.currentTime = 0;
        }
      }, fadeInterval);
    } else if (previousAudio) {
      previousAudio.pause();
      previousAudio.currentTime = 0;
    }

    // Create the new track; it starts once it can play (if sound is on)
    const newAudio = new Audio(targetTrack);
    newAudio.loop = true;
    newAudio.volume = 0;
    audioRef.current = newAudio;

    const handleError = (e: Event) => {
      console.error(`Failed to load ${targetTrack}`, e);
    };

    const startPlayback = () => {
      // Skip if sound is off or this track was replaced before it loaded
      if (!isSoundOnRef.current || audioRef.current !== newAudio) return;
      playWithFadeIn(newAudio, fadeIntervalRef);
    };

    // Not removed on cleanup: startPlayback already ignores replaced tracks, and
    // removing it would strand the track if the effect re-runs before it loads
    newAudio.addEventListener("error", handleError, { once: true });
    newAudio.addEventListener("canplaythrough", startPlayback, { once: true });
  }, [screen, selectedCharacter]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopFade(fadeIntervalRef);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return null;
}
