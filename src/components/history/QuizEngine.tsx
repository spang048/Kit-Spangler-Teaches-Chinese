"use client";

import { useState } from "react";
import { useSound } from "@/hooks/useSound";
import { cn } from "@/lib/utils/cn";
import { calculateHistoryQuizXP } from "@/lib/lesson-engine/scoring";
import type { QuizQuestion } from "@/types/history";

interface Props {
  questions: QuizQuestion[];
  topicId: string;
  xpReward: number;
  onComplete: (xpEarned: number, score: number) => void;
}

export function QuizEngine({ questions, topicId, xpReward, onComplete }: Props) {
  const { play } = useSound();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [phase, setPhase] = useState<"answering" | "feedback">("answering");

  const question = questions[index];

  function handleSelect(optIndex: number) {
    if (phase !== "answering") return;
    const correct = optIndex === question.correct_index;
    play(correct ? "correct" : "wrong");
    if (correct) setCorrectCount((c) => c + 1);
    setSelected(optIndex);
    setPhase("feedback");
  }

  function handleNext() {
    if (index + 1 >= questions.length) {
      // Done
      const score = Math.round(((correctCount + (selected === question.correct_index ? 1 : 0)) / questions.length) * 100);
      const xp = calculateHistoryQuizXP(
        correctCount + (selected === question.correct_index ? 1 : 0),
        questions.length,
        xpReward
      );

      fetch("/api/progress/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId, score, xpEarned: xp }),
      }).catch(() => {});

      onComplete(xp, score);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setPhase("answering");
    }
  }

  const isCorrect = selected === question.correct_index;

  return (
    <div className="px-4 py-4 flex flex-col gap-5">
      {/* Progress */}
      <div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${(index / questions.length) * 100}%`, background: "#C8102E" }}
          />
        </div>
        <p className="text-xs text-gray-400 text-right mt-1">{index + 1} / {questions.length}</p>
      </div>

      {/* Question */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
        <p className="text-base font-semibold text-gray-800 leading-snug">{question.question}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {question.options.map((opt, i) => {
          const isSelected = selected === i;
          const isRight = i === question.correct_index;
          const showResult = phase === "feedback";

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={phase === "feedback"}
              className={cn(
                "w-full py-4 px-4 rounded-2xl border-2 text-sm font-medium text-left transition-all",
                !showResult && "border-gray-200 bg-white active:scale-98",
                showResult && isRight && "border-green-400 bg-green-50 text-green-800",
                showResult && isSelected && !isRight && "border-red-400 bg-red-50 text-red-800 shake",
                showResult && !isSelected && !isRight && "border-gray-100 bg-gray-50 text-gray-400"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {phase === "feedback" && (
        <div className={cn(
          "rounded-2xl p-4",
          isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
        )}>
          <p className={cn("font-bold text-sm mb-1", isCorrect ? "text-green-700" : "text-red-700")}>
            {isCorrect ? "Correct!" : "Not quite"}
          </p>
          <p className="text-sm text-gray-600">{question.explanation}</p>
        </div>
      )}

      {phase === "feedback" && (
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl font-bold text-white active:scale-95 transition-transform"
          style={{ background: "#C8102E" }}
        >
          {index + 1 >= questions.length ? "See results →" : "Next question →"}
        </button>
      )}
    </div>
  );
}
