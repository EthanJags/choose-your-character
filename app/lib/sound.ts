// Stored only when the user explicitly toggles sound (or it auto-enables on first
// interaction). Renamed from "soundEnabled", which was overwritten with "false" on
// every page load and so permanently disabled auto-enable for returning visitors.
export const SOUND_PREF_KEY = "soundPreference";

export function readSoundPref(): boolean | null {
  try {
    const saved = localStorage.getItem(SOUND_PREF_KEY);
    return saved === null ? null : saved === "true";
  } catch {
    return null;
  }
}

export function writeSoundPref(enabled: boolean) {
  try {
    localStorage.setItem(SOUND_PREF_KEY, String(enabled));
  } catch {
    // Storage unavailable (private mode, blocked site data) — preference just won't persist
  }
}

export function playSfx(src: string, startAt = 0) {
  const audio = new Audio(src);
  if (startAt) audio.currentTime = startAt;
  audio.play().catch(() => {
    // Autoplay blocked
  });
}
