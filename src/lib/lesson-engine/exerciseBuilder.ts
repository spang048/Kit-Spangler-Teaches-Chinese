import type {
  Exercise,
  HydratedExercise,
  HydratedFlashcard,
  HydratedChoiceExercise,
  HydratedFillInBlank,
  HydratedMatching,
  VocabWord,
} from "@/types/lesson";
import { getWordById, getWordsByIds } from "./dataAccess";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildChoiceOptions(
  correctWord: VocabWord,
  distractorIds: string[]
): { options: VocabWord[]; correctIndex: number } {
  const distractors = getWordsByIds(distractorIds).slice(0, 3);
  const allOptions = shuffleArray([correctWord, ...distractors]);
  return {
    options: allOptions,
    correctIndex: allOptions.findIndex((w) => w.id === correctWord.id),
  };
}

export function hydrateExercise(exercise: Exercise): HydratedExercise | null {
  switch (exercise.type) {
    case "flashcard": {
      const word = getWordById(exercise.word_id);
      if (!word) return null;
      return { id: exercise.id, type: "flashcard", word } as HydratedFlashcard;
    }

    case "character_recognition":
    case "listening": {
      const word = getWordById(exercise.word_id);
      if (!word) return null;
      const { options, correctIndex } = buildChoiceOptions(
        word,
        exercise.distractors
      );
      return {
        id: exercise.id,
        type: exercise.type,
        word,
        prompt: exercise.prompt,
        options,
        correctIndex,
      } as HydratedChoiceExercise;
    }

    case "fill_in_blank": {
      const correct = getWordById(exercise.correct_word_id);
      if (!correct) return null;
      const { options, correctIndex } = buildChoiceOptions(
        correct,
        exercise.distractors
      );
      return {
        id: exercise.id,
        type: "fill_in_blank",
        sentenceTemplate: exercise.sentence_template,
        correctWord: correct,
        options,
        correctIndex,
      } as HydratedFillInBlank;
    }

    case "matching": {
      const pairs = exercise.pairs
        .map((p) => {
          const word = getWordById(p.word_id);
          return word ? { word, match: p.match } : null;
        })
        .filter((p): p is { word: VocabWord; match: string } => p !== null);

      if (pairs.length === 0) return null;
      return {
        id: exercise.id,
        type: "matching",
        pairs: shuffleArray(pairs),
      } as HydratedMatching;
    }

    default:
      return null;
  }
}

export function hydrateLesson(exercises: Exercise[]): HydratedExercise[] {
  return exercises
    .map(hydrateExercise)
    .filter((e): e is HydratedExercise => e !== null);
}
