"use client";

import { useCallback, useEffect } from "react";
import { speakChinese, stopSpeaking, isTTSAvailable } from "@/lib/audio/tts";

export function useTTS() {
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const speak = useCallback((text: string, rate?: number) => {
    speakChinese(text, rate);
  }, []);

  const stop = useCallback(() => {
    stopSpeaking();
  }, []);

  return { speak, stop, available: isTTSAvailable() };
}
