"use client";

export type SoundName = "correct" | "wrong" | "lessonComplete" | "streakMilestone";

const soundPaths: Record<SoundName, string> = {
  correct: "/sounds/correct.mp3",
  wrong: "/sounds/wrong.mp3",
  lessonComplete: "/sounds/lesson-complete.mp3",
  streakMilestone: "/sounds/streak-milestone.mp3",
};

const audioCache = new Map<SoundName, HTMLAudioElement>();

function getAudio(name: SoundName): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;

  if (!audioCache.has(name)) {
    const audio = new Audio(soundPaths[name]);
    audio.preload = "auto";
    audioCache.set(name, audio);
  }

  return audioCache.get(name) ?? null;
}

export function playSound(name: SoundName): void {
  const audio = getAudio(name);
  if (!audio) return;

  // Reset to start so rapid replays work
  audio.currentTime = 0;
  audio.play().catch(() => {
    // Autoplay blocked — user hasn't interacted yet, ignore silently
  });
}

export function preloadSounds(): void {
  if (typeof window === "undefined") return;
  (Object.keys(soundPaths) as SoundName[]).forEach(getAudio);
}
