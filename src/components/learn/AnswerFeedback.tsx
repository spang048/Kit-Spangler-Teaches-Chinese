"use client";

import { cn } from "@/lib/utils/cn";

interface Props {
  correct: boolean;
  correctAnswer: string;
  correctPinyin?: string;
  xpEarned: number;
  onContinue: () => void;
}

export function AnswerFeedback({ correct, correctAnswer, correctPinyin, xpEarned, onContinue }: Props) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-6 pt-5 pb-10 shadow-2xl animate-slide-up",
        correct ? "bg-green-50 border-t-4 border-green-400" : "bg-red-50 border-t-4 border-red-400"
      )}
    >
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{correct ? "✓" : "✗"}</span>
          <div>
            <p className={cn("font-bold text-lg", correct ? "text-green-700" : "text-red-700")}>
              {correct ? "Correct!" : "Not quite"}
            </p>
            {!correct && (
              <p className="text-sm text-gray-600">
                Correct answer:{" "}
                <span className="chinese font-bold">{correctAnswer}</span>
                {correctPinyin && (
                  <span className="pinyin text-gray-500 ml-1">({correctPinyin})</span>
                )}
              </p>
            )}
          </div>

          {correct && xpEarned > 0 && (
            <div className="ml-auto flex items-center gap-1 bg-yellow-100 border border-yellow-300 rounded-full px-3 py-1 animate-xp-pop">
              <span className="text-yellow-600 font-bold text-sm">+{xpEarned} XP</span>
            </div>
          )}
        </div>

        <button
          onClick={onContinue}
          className={cn(
            "w-full py-4 rounded-2xl font-bold text-white text-base active:scale-95 transition-transform",
            correct ? "bg-green-500" : "bg-red-500"
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
