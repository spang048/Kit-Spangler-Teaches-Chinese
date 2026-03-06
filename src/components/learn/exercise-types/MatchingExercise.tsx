"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { HydratedMatching } from "@/types/lesson";
import { useTTS } from "@/hooks/useTTS";

interface Props {
  exercise: HydratedMatching;
  onAnswer: (correct: boolean) => void;
}

type CardState = "idle" | "selected" | "matched" | "wrong";

export function MatchingExercise({ exercise, onAnswer }: Props) {
  const { speak } = useTTS();

  // Shuffle English side once on mount
  const [engOrder] = useState(() => [...exercise.pairs].sort(() => Math.random() - 0.5));

  // Which Chinese card is selected (word id)
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  // Set of matched word ids
  const [matched, setMatched] = useState<Set<string>>(new Set());
  // Set of word ids in a "wrong" flash state
  const [wrong, setWrong] = useState<Set<string>>(new Set());
  // Whether we've called onAnswer yet
  const [done, setDone] = useState(false);

  const allMatched = matched.size === exercise.pairs.length;

  function getCharState(wordId: string): CardState {
    if (matched.has(wordId)) return "matched";
    if (wrong.has(wordId)) return "wrong";
    if (selectedChar === wordId) return "selected";
    return "idle";
  }

  function getEngState(wordId: string): CardState {
    if (matched.has(wordId)) return "matched";
    if (wrong.has(wordId)) return "wrong";
    return "idle";
  }

  function handleCharClick(wordId: string) {
    if (matched.has(wordId) || wrong.size > 0) return;
    setSelectedChar(prev => prev === wordId ? null : wordId);
  }

  function handleEngClick(wordId: string) {
    if (matched.has(wordId) || wrong.size > 0) return;

    // Must select a Chinese card first
    if (!selectedChar) return;

    if (selectedChar === wordId) {
      // Correct match!
      const word = exercise.pairs.find(p => p.word.id === wordId)?.word;
      if (word) speak(word.simplified);

      setMatched(prev => new Set([...prev, wordId]));
      setSelectedChar(null);
    } else {
      // Wrong match — flash both cards red briefly
      const wrongIds = new Set([selectedChar, wordId]);
      setWrong(wrongIds);
      setSelectedChar(null);
      setTimeout(() => setWrong(new Set()), 700);
    }
  }

  function handleContinue() {
    if (!done) {
      setDone(true);
      onAnswer(true);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 px-4 pt-4 pb-4">
      <div className="text-center">
        <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
          Match the pairs
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {allMatched ? "All matched! 🎉" : "Tap a Chinese word, then its English meaning"}
        </p>
      </div>

      <div className="flex gap-3 w-full max-w-sm">
        {/* Chinese column */}
        <div className="flex-1 flex flex-col gap-2">
          {exercise.pairs.map(({ word }) => {
            const state = getCharState(word.id);
            return (
              <button
                key={word.id}
                onClick={() => handleCharClick(word.id)}
                disabled={state === "matched"}
                className={cn(
                  "py-4 rounded-2xl border-2 flex flex-col items-center gap-0.5 transition-all duration-150",
                  state === "idle" && "border-gray-200 bg-white",
                  state === "selected" && "border-red-500 bg-red-50 scale-95",
                  state === "matched" && "border-green-300 bg-green-50 opacity-50 cursor-default",
                  state === "wrong" && "border-red-400 bg-red-100 shake"
                )}
              >
                <span className="chinese text-2xl font-bold text-gray-800">{word.simplified}</span>
                <span className="pinyin text-xs text-gray-500">{word.pinyin}</span>
              </button>
            );
          })}
        </div>

        {/* English column */}
        <div className="flex-1 flex flex-col gap-2">
          {engOrder.map(({ word }) => {
            const state = getEngState(word.id);
            return (
              <button
                key={word.id}
                onClick={() => handleEngClick(word.id)}
                disabled={state === "matched"}
                className={cn(
                  "py-4 px-2 rounded-2xl border-2 text-sm font-semibold text-center transition-all duration-150",
                  state === "idle" && selectedChar
                    ? "border-gray-300 bg-gray-50 text-gray-700"
                    : "border-gray-200 bg-white text-gray-600",
                  state === "matched" && "border-green-300 bg-green-50 text-green-700 opacity-50 cursor-default",
                  state === "wrong" && "border-red-400 bg-red-100 text-red-700 shake"
                )}
              >
                {word.english}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress */}
      <p className="text-xs text-gray-400">
        {matched.size} / {exercise.pairs.length} matched
      </p>

      {/* Continue button — appears when all matched */}
      {allMatched && (
        <button
          onClick={handleContinue}
          className="w-full max-w-sm py-4 rounded-2xl font-bold text-white text-base transition-transform active:scale-95 animate-slide-up"
          style={{ background: "#C8102E" }}
        >
          Continue →
        </button>
      )}
    </div>
  );
}
