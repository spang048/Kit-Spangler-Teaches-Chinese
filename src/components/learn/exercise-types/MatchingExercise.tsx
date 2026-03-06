"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { HydratedMatching } from "@/types/lesson";
import { useTTS } from "@/hooks/useTTS";

interface Props {
  exercise: HydratedMatching;
  onAnswer: (correct: boolean) => void;
}

export function MatchingExercise({ exercise, onAnswer }: Props) {
  const { speak } = useTTS();
  const [selectedChar, setSelectedChar] = useState<string | null>(null); // word id
  const [selectedEng, setSelectedEng] = useState<string | null>(null); // word id (match side)
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<string | null>(null);

  // Shuffle English side order independently
  const [engOrder] = useState(() => [...exercise.pairs].sort(() => Math.random() - 0.5));

  function handleCharSelect(wordId: string) {
    if (matched.has(wordId)) return;
    setSelectedChar(wordId === selectedChar ? null : wordId);
  }

  function handleEngSelect(wordId: string) {
    if (matched.has(wordId)) return;
    setSelectedEng(wordId === selectedEng ? null : wordId);
  }

  // Check for match whenever both sides are selected
  function checkMatch(charId: string, engId: string) {
    if (charId === engId) {
      // Correct pair
      const word = exercise.pairs.find(p => p.word.id === charId)?.word;
      if (word) speak(word.simplified);

      const newMatched = new Set(matched);
      newMatched.add(charId);
      setMatched(newMatched);
      setSelectedChar(null);
      setSelectedEng(null);

      // All matched?
      if (newMatched.size === exercise.pairs.length) {
        setTimeout(() => onAnswer(true), 400);
      }
    } else {
      // Wrong pair — flash red briefly
      setWrongPair(`${charId}-${engId}`);
      setTimeout(() => {
        setWrongPair(null);
        setSelectedChar(null);
        setSelectedEng(null);
      }, 700);
    }
  }

  // Trigger match check when both selected
  function handleEngSelectWithCheck(wordId: string) {
    if (matched.has(wordId)) return;
    if (selectedChar) {
      checkMatch(selectedChar, wordId);
    } else {
      setSelectedEng(wordId === selectedEng ? null : wordId);
    }
  }

  function handleCharSelectWithCheck(wordId: string) {
    if (matched.has(wordId)) return;
    if (selectedEng) {
      checkMatch(wordId, selectedEng);
    } else {
      setSelectedChar(wordId === selectedChar ? null : wordId);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 px-4 pt-4">
      <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
        Match the pairs
      </p>
      <p className="text-xs text-gray-400">Tap a character, then its meaning</p>

      <div className="flex gap-3 w-full max-w-sm">
        {/* Chinese column */}
        <div className="flex-1 flex flex-col gap-2">
          {exercise.pairs.map(({ word }) => {
            const isMatched = matched.has(word.id);
            const isSelected = selectedChar === word.id;
            const isWrong = wrongPair?.startsWith(word.id);

            return (
              <button
                key={word.id}
                onClick={() => handleCharSelectWithCheck(word.id)}
                disabled={isMatched}
                className={cn(
                  "py-4 rounded-2xl border-2 flex flex-col items-center gap-0.5 transition-all",
                  isMatched && "border-green-300 bg-green-50 opacity-60",
                  !isMatched && !isSelected && !isWrong && "border-gray-200 bg-white active:scale-95",
                  isSelected && !isWrong && "border-2 bg-red-50",
                  isWrong && "border-red-400 bg-red-50 shake"
                )}
                style={{ borderColor: isSelected && !isWrong ? "#C8102E" : undefined }}
              >
                <span className="chinese text-2xl font-bold">{word.simplified}</span>
                <span className="pinyin text-xs text-gray-500">{word.pinyin}</span>
              </button>
            );
          })}
        </div>

        {/* English column */}
        <div className="flex-1 flex flex-col gap-2">
          {engOrder.map(({ word }) => {
            const isMatched = matched.has(word.id);
            const isSelected = selectedEng === word.id;
            const isWrong = wrongPair?.endsWith(word.id) && !wrongPair?.startsWith(word.id);

            return (
              <button
                key={word.id}
                onClick={() => handleEngSelectWithCheck(word.id)}
                disabled={isMatched}
                className={cn(
                  "py-4 px-2 rounded-2xl border-2 text-sm font-medium text-center transition-all",
                  isMatched && "border-green-300 bg-green-50 text-green-700 opacity-60",
                  !isMatched && !isSelected && !isWrong && "border-gray-200 bg-white active:scale-95 text-gray-700",
                  isSelected && !isWrong && "bg-red-50 text-gray-800",
                  isWrong && "border-red-400 bg-red-50 shake"
                )}
                style={{ borderColor: isSelected && !isWrong ? "#C8102E" : undefined }}
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
    </div>
  );
}
