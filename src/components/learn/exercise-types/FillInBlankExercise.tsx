"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { HydratedFillInBlank } from "@/types/lesson";
import { useTTS } from "@/hooks/useTTS";

interface Props {
  exercise: HydratedFillInBlank;
  onAnswer: (correct: boolean) => void;
}

export function FillInBlankExercise({ exercise, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const { speak } = useTTS();

  // Replace ___ with a styled blank
  const parts = exercise.sentenceTemplate.split("___");

  function handleSelect(index: number) {
    if (selected !== null) return;
    setSelected(index);
    const correct = index === exercise.correctIndex;
    if (correct) speak(exercise.correctWord.simplified);
    setTimeout(() => onAnswer(correct), 700);
  }

  const filledWord = selected !== null ? exercise.options[selected] : null;

  return (
    <div className="flex flex-col items-center gap-6 px-4 pt-4">
      <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
        Fill in the blank
      </p>

      {/* Sentence display */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 w-full max-w-sm p-6 text-center">
        <p className="chinese text-2xl leading-relaxed text-gray-800">
          {parts[0]}
          <span
            className={cn(
              "inline-block min-w-16 mx-1 px-2 rounded-lg border-b-2 font-bold transition-all",
              selected === null && "border-gray-400 text-gray-400",
              selected !== null && selected === exercise.correctIndex && "border-green-500 text-green-700 bg-green-50",
              selected !== null && selected !== exercise.correctIndex && "border-red-500 text-red-700 bg-red-50"
            )}
          >
            {filledWord ? filledWord.simplified : "＿＿"}
          </span>
          {parts[1]}
        </p>
        {filledWord && (
          <p className="pinyin text-sm text-gray-500 mt-2">{filledWord.pinyin}</p>
        )}
        <p className="text-sm text-gray-500 mt-2 italic">
          {exercise.sentenceTemplate.replace("___", `"${exercise.correctWord.english}"`)}
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
                "py-4 px-3 rounded-2xl border-2 flex flex-col items-center gap-0.5 transition-all",
                !showResult && "border-gray-200 bg-white active:scale-95",
                showResult && isCorrect && "border-green-400 bg-green-50",
                showResult && isSelected && !isCorrect && "border-red-400 bg-red-50 shake",
                showResult && !isSelected && !isCorrect && "border-gray-100 bg-gray-50 opacity-50"
              )}
            >
              <span className="chinese text-2xl font-bold text-gray-800">{option.simplified}</span>
              <span className="pinyin text-xs text-gray-500">{option.pinyin}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
