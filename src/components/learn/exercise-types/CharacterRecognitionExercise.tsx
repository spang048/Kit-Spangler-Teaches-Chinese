"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { HydratedChoiceExercise } from "@/types/lesson";
import { useTTS } from "@/hooks/useTTS";

interface Props {
  exercise: HydratedChoiceExercise;
  onAnswer: (correct: boolean) => void;
}

export function CharacterRecognitionExercise({ exercise, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const { speak } = useTTS();

  function handleSelect(index: number) {
    if (selected !== null) return;
    setSelected(index);
    const correct = index === exercise.correctIndex;
    speak(exercise.options[exercise.correctIndex].simplified);
    setTimeout(() => onAnswer(correct), 600);
  }

  return (
    <div className="flex flex-col items-center gap-6 px-4 pt-4">
      <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
        Choose the character
      </p>

      {/* Prompt */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 w-full max-w-sm p-8 text-center">
        <p className="text-2xl font-bold text-gray-800">{exercise.prompt.replace("Which means", "Which character means")}</p>
        <p className="text-lg text-gray-600 mt-2">
          &ldquo;{exercise.word.english}&rdquo;
        </p>
      </div>

      {/* Options */}
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
                "py-5 px-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all",
                !showResult && "border-gray-200 bg-white active:scale-95",
                showResult && isCorrect && "border-green-400 bg-green-50",
                showResult && isSelected && !isCorrect && "border-red-400 bg-red-50 shake",
                showResult && !isSelected && !isCorrect && "border-gray-200 bg-gray-50 opacity-50"
              )}
            >
              <span className="chinese text-3xl font-bold" style={{ color: "#1A1A1A" }}>
                {option.simplified}
              </span>
              <span className="pinyin text-xs text-gray-500">{option.pinyin}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
