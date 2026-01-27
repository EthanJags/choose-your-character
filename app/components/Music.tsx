"use client";

import { useEffect, useRef, useState } from "react";
import type { Ethan } from "@/app/page";

export type Screen = "selection" | "title";

type MusicProps = {
  screen: Screen;
  selectedCharacter: Ethan | null;
};

const FADE_DURATION = 800;
const TARGET_VOLUME = 0.5;

function getMusicForScreen(screen: Screen, character: Ethan | null): string {
  if (screen === "title" && character) {
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

export default function Music({ screen, selectedCharacter }: MusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const currentTrackRef = useRef<string>("");
  const hasUserInteracted = useRef(false);

  // Initialize sound state from localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem("soundEnabled");
    if (savedPreference !== null) {
      setIsSoundOn(savedPreference === "true");
    }
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

  // Update volume when sound toggle changes (but only if not currently fading)
  useEffect(() => {
    if (audioRef.current && !fadeIntervalRef.current) {
      audioRef.current.volume = isSoundOn ? TARGET_VOLUME : 0;
    }
  }, [isSoundOn]);

  // Handle user interaction for autoplay
  useEffect(() => {
    const handleInteraction = () => {
      hasUserInteracted.current = true;
      if (audioRef.current && audioRef.current.paused && isSoundOn) {
        audioRef.current.play().catch(() => {
          // Ignore errors
        });
      }
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, [isSoundOn]);

  // Handle music changes based on screen and character
  useEffect(() => {
    const targetTrack = getMusicForScreen(screen, selectedCharacter);

    // If same track, no need to change
    if (targetTrack === currentTrackRef.current && audioRef.current) {
      return;
    }

    // Clear any existing fade interval
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    const previousAudio = audioRef.current;
    const previousVolume = previousAudio?.volume ?? 0;

    // Fade out the previous track
    if (previousAudio && previousVolume > 0) {
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

    // Create and play the new track
    const newAudio = new Audio(targetTrack);
    newAudio.loop = true;
    newAudio.volume = 0;
    audioRef.current = newAudio;
    currentTrackRef.current = targetTrack;

    const handleError = (e: Event) => {
      console.error(`Failed to load ${targetTrack}`, e);
    };

    const startPlayback = () => {
      if (!isSoundOn) return;

      newAudio.play().catch(() => {
        // Autoplay blocked - will play on user interaction
      });

      // Fade in the new track
      const fadeSteps = 50;
      const fadeInterval = 2000 / fadeSteps; // 2 second fade in
      const volumeStep = TARGET_VOLUME / fadeSteps;

      let currentStep = 0;
      fadeIntervalRef.current = setInterval(() => {
        currentStep++;
        const newVolume = Math.min(volumeStep * currentStep, TARGET_VOLUME);
        newAudio.volume = newVolume;

        if (currentStep >= fadeSteps) {
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
        }
      }, fadeInterval);
    };

    newAudio.addEventListener("error", handleError);
    newAudio.addEventListener("canplaythrough", startPlayback, { once: true });

    return () => {
      newAudio.removeEventListener("error", handleError);
    };
  }, [screen, selectedCharacter, isSoundOn]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return null;
}
