"use client";

let zhVoice: SpeechSynthesisVoice | null = null;
let ttsSupported = false;

function initVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  ttsSupported = true;

  function pickVoice() {
    const voices = window.speechSynthesis.getVoices();
    // Prefer zh-CN, fall back to any zh voice
    zhVoice =
      voices.find((v) => v.lang === "zh-CN") ??
      voices.find((v) => v.lang.startsWith("zh")) ??
      null;
  }

  pickVoice();
  if (!zhVoice) {
    window.speechSynthesis.addEventListener("voiceschanged", pickVoice, {
      once: false,
    });
  }
}

if (typeof window !== "undefined") {
  initVoice();
}

export function isTTSAvailable(): boolean {
  return ttsSupported && zhVoice !== null;
}

export function speakChinese(text: string, rate = 0.85): void {
  if (!ttsSupported) return;

  // Cancel any ongoing speech first
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = rate;
  utterance.pitch = 1;

  if (zhVoice) {
    utterance.voice = zhVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
