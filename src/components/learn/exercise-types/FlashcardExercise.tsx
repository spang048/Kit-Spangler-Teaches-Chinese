"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { HydratedFlashcard } from "@/types/lesson";
import { useTTS } from "@/hooks/useTTS";

interface FlashcardExerciseProps {
  exercise: HydratedFlashcard;
  onAnswer: (correct: boolean) => void;
}

export function FlashcardExercise({ exercise, onAnswer }: FlashcardExerciseProps) {
  const [flipped, setFlipped] = useState(false);
  const { speak, available: ttsAvailable } = useTTS();
  const { word } = exercise;

  function handleFlip() {
    if (!flipped) {
      setFlipped(true);
      speak(word.simplified);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 px-4 pt-4">
      <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
        Flashcard
      </p>

      {/* Card */}
      <button
        onClick={handleFlip}
        className={cn(
          "w-full max-w-sm min-h-48 rounded-3xl shadow-md border-2 flex flex-col items-center justify-center gap-4 p-8 transition-all active:scale-98",
          flipped ? "bg-white border-gray-200" : "border-gray-200 bg-white"
        )}
        style={{ borderColor: flipped ? "#C8102E" : "#E5E7EB" }}
      >
        {/* Front — always visible */}
        <div className="text-center">
          <p className="chinese text-6xl font-bold" style={{ color: "#1A1A1A" }}>
            {word.simplified}
          </p>
          {flipped && (
            <p className="pinyin text-lg text-gray-500 mt-2">{word.pinyin}</p>
          )}
        </div>

        {/* Back — revealed on flip */}
        {flipped ? (
          <div className="text-center border-t border-gray-100 pt-4 w-full">
            <p className="text-xl font-semibold text-gray-800">{word.english}</p>
            <p className="text-sm text-gray-500 mt-1 italic">{word.part_of_speech}</p>
            <div className="mt-3 bg-gray-50 rounded-xl p-3 text-left">
              <p className="chinese text-sm text-gray-800">{word.example_sentence.simplified}</p>
              <p className="pinyin text-xs text-gray-500 mt-1">{word.example_sentence.pinyin}</p>
              <p className="text-xs text-gray-600 mt-1 italic">{word.example_sentence.english}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 mt-2">Tap to reveal →</p>
        )}
      </button>

      {/* TTS button */}
      {ttsAvailable && !flipped && (
        <button
          onClick={() => speak(word.simplified)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm"
        >
          🔊 Listen
        </button>
      )}

      {/* Self-rating buttons (shown after flip) */}
      {flipped && (
        <div className="w-full max-w-sm flex gap-3">
          <button
            onClick={() => onAnswer(false)}
            className="flex-1 py-4 rounded-2xl border-2 border-red-200 bg-red-50 text-red-600 font-semibold text-sm active:scale-95 transition-transform"
          >
            😕 Not quite
          </button>
          <button
            onClick={() => onAnswer(true)}
            className="flex-1 py-4 rounded-2xl border-2 font-semibold text-sm active:scale-95 transition-transform text-white"
            style={{ background: "#C8102E", borderColor: "#C8102E" }}
          >
            ✓ Got it!
          </button>
        </div>
      )}
    </div>
  );
}
