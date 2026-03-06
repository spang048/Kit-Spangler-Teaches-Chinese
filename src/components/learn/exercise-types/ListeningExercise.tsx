"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import type { HydratedChoiceExercise } from "@/types/lesson";
import { useTTS } from "@/hooks/useTTS";

interface Props {
  exercise: HydratedChoiceExercise;
  onAnswer: (correct: boolean) => void;
}

export function ListeningExercise({ exercise, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const { speak, available: ttsAvailable } = useTTS();

  // Auto-play on mount
  useEffect(() => {
    if (ttsAvailable) {
      setTimeout(() => speak(exercise.word.simplified, 0.75), 400);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelect(index: number) {
    if (selected !== null) return;
    setSelected(index);
    const correct = index === exercise.correctIndex;
    setTimeout(() => onAnswer(correct), 600);
  }

  if (!ttsAvailable) {
    // Graceful degradation: show the character, treat as recognition exercise
    return (
      <div className="flex flex-col items-center gap-6 px-4 pt-4">
        <p className="text-sm text-gray-400 text-center">
          (Audio not available on this device — reading exercise instead)
        </p>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 w-full max-w-sm p-8 text-center">
          <p className="chinese text-5xl font-bold">{exercise.word.simplified}</p>
          <p className="pinyin text-lg text-gray-500 mt-2">{exercise.word.pinyin}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
          {exercise.options.map((option, i) => (
            <button key={option.id} onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={cn("py-4 px-3 rounded-2xl border-2 text-sm font-medium transition-all",
                selected === null && "border-gray-200 bg-white active:scale-95",
                selected !== null && i === exercise.correctIndex && "border-green-400 bg-green-50 text-green-800",
                selected === i && i !== exercise.correctIndex && "border-red-400 bg-red-50 text-red-800 shake",
                selected !== null && selected !== i && i !== exercise.correctIndex && "opacity-40"
              )}>
              {option.english}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 px-4 pt-4">
      <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
        What did you hear?
      </p>

      {/* Play button */}
      <button
        onClick={() => speak(exercise.word.simplified, 0.75)}
        className="w-28 h-28 rounded-full flex flex-col items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
        style={{ background: "#C8102E" }}
      >
        <span className="text-4xl">🔊</span>
        <span className="text-white text-xs font-semibold">Play again</span>
      </button>

      {/* Options — show English meanings */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {exercise.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = i === exercise.correctIndex;
          const showResult = selected !== null;

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={cn(
                "py-4 px-3 rounded-2xl border-2 text-sm font-semibold transition-all",
                !showResult && "border-gray-200 bg-white active:scale-95",
                showResult && isCorrect && "border-green-400 bg-green-50 text-green-800",
                showResult && isSelected && !isCorrect && "border-red-400 bg-red-50 text-red-800 shake",
                showResult && !isSelected && !isCorrect && "border-gray-200 bg-gray-50 opacity-50"
              )}
            >
              {option.english}
            </button>
          );
        })}
      </div>
    </div>
  );
}
