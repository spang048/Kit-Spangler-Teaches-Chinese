"use client";

import { useCallback } from "react";
import { playSound, preloadSounds, type SoundName } from "@/lib/audio/sfx";

export function useSound() {
  const play = useCallback((name: SoundName) => {
    playSound(name);
  }, []);

  return { play, preload: preloadSounds };
}
