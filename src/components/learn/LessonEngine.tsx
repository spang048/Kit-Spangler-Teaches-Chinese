"use client";

import { useReducer, useCallback } from "react";
import type { HydratedLesson, HydratedExercise } from "@/types/lesson";
import { FlashcardExercise } from "./exercise-types/FlashcardExercise";
import { CharacterRecognitionExercise } from "./exercise-types/CharacterRecognitionExercise";
import { ListeningExercise } from "./exercise-types/ListeningExercise";
import { FillInBlankExercise } from "./exercise-types/FillInBlankExercise";
import { MatchingExercise } from "./exercise-types/MatchingExercise";
import { AnswerFeedback } from "./AnswerFeedback";
import { LessonComplete } from "./LessonComplete";
import { useSound } from "@/hooks/useSound";
import { calculateLessonXP } from "@/lib/lesson-engine/scoring";

// ─── State machine ────────────────────────────────────────────────────────────

type Phase = "exercising" | "feedback" | "complete";

interface State {
  phase: Phase;
  exerciseIndex: number;
  correctCount: number;
  lastCorrect: boolean;
}

type Action =
  | { type: "ANSWER"; correct: boolean }
  | { type: "CONTINUE" };

// We need total count to detect "last" so we initialise with a closure:
function makeReducer(total: number) {
  return function (state: State, action: Action): State {
    switch (action.type) {
      case "ANSWER":
        return {
          ...state,
          phase: "feedback",
          lastCorrect: action.correct,
          correctCount: state.correctCount + (action.correct ? 1 : 0),
        };

      case "CONTINUE": {
        const nextIndex = state.exerciseIndex + 1;
        if (nextIndex >= total) {
          return { ...state, phase: "complete", exerciseIndex: nextIndex };
        }
        return { ...state, phase: "exercising", exerciseIndex: nextIndex };
      }

      default:
        return state;
    }
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCorrectWordForExercise(exercise: HydratedExercise) {
  switch (exercise.type) {
    case "flashcard":
      return exercise.word;
    case "character_recognition":
    case "listening":
      return exercise.options[exercise.correctIndex];
    case "fill_in_blank":
      return exercise.correctWord;
    case "matching":
      return exercise.pairs[0]?.word ?? null;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  lesson: HydratedLesson;
  lessonId: string;
  onComplete: (xpEarned: number, score: number) => void;
}

export function LessonEngine({ lesson, lessonId, onComplete }: Props) {
  const { play } = useSound();
  const total = lesson.exercises.length;

  const [state, dispatch] = useReducer(makeReducer(total), {
    phase: "exercising",
    exerciseIndex: 0,
    correctCount: 0,
    lastCorrect: false,
  });

  const handleAnswer = useCallback(
    (correct: boolean) => {
      play(correct ? "correct" : "wrong");
      dispatch({ type: "ANSWER", correct });
    },
    [play]
  );

  const handleContinue = useCallback(() => {
    dispatch({ type: "CONTINUE" });
  }, []);

  // ── Complete screen ────────────────────────────────────────────────────────
  if (state.phase === "complete") {
    const score = Math.round((state.correctCount / total) * 100);
    const xpEarned = calculateLessonXP(state.correctCount, total, lesson.xp_reward);

    // Fire-and-forget API call to persist progress
    fetch("/api/progress/lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, score, xpEarned }),
    }).catch(() => {/* ignore — best-effort */});

    return (
      <LessonComplete
        score={score}
        xpEarned={xpEarned}
        correctCount={state.correctCount}
        totalCount={total}
        onContinue={() => onComplete(xpEarned, score)}
      />
    );
  }

  // ── Exercise ───────────────────────────────────────────────────────────────
  const exercise = lesson.exercises[state.exerciseIndex];
  const correctWord = getCorrectWordForExercise(exercise);

  // Progress bar
  const progress = state.exerciseIndex / total;

  return (
    <div className="flex flex-col min-h-full">
      {/* Progress bar */}
      <div className="px-4 pt-3 pb-1">
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%`, background: "#C8102E" }}
          />
        </div>
        <p className="text-xs text-gray-400 text-right mt-1">
          {state.exerciseIndex} / {total}
        </p>
      </div>

      {/* Exercise content */}
      <div className="flex-1">
        {exercise.type === "flashcard" && (
          <FlashcardExercise exercise={exercise} onAnswer={handleAnswer} />
        )}
        {exercise.type === "character_recognition" && (
          <CharacterRecognitionExercise exercise={exercise} onAnswer={handleAnswer} />
        )}
        {exercise.type === "listening" && (
          <ListeningExercise exercise={exercise} onAnswer={handleAnswer} />
        )}
        {exercise.type === "fill_in_blank" && (
          <FillInBlankExercise exercise={exercise} onAnswer={handleAnswer} />
        )}
        {exercise.type === "matching" && (
          <MatchingExercise exercise={exercise} onAnswer={handleAnswer} />
        )}
      </div>

      {/* Feedback overlay */}
      {state.phase === "feedback" && (
        <AnswerFeedback
          correct={state.lastCorrect}
          correctAnswer={correctWord?.simplified ?? ""}
          correctPinyin={correctWord?.pinyin}
          xpEarned={state.lastCorrect ? Math.ceil(lesson.xp_reward / total) : 0}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
