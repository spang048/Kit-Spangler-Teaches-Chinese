export type ExerciseType =
  | "flashcard"
  | "character_recognition"
  | "listening"
  | "fill_in_blank"
  | "matching";

export interface ExampleSentence {
  simplified: string;
  pinyin: string;
  english: string;
}

export interface VocabWord {
  id: string;
  simplified: string;
  traditional?: string;
  pinyin: string;
  english: string;
  part_of_speech: string;
  example_sentence: ExampleSentence;
  hsk_level: number;
  tags?: string[];
}

export interface FlashcardExercise {
  id: string;
  type: "flashcard";
  word_id: string;
}

export interface CharacterRecognitionExercise {
  id: string;
  type: "character_recognition";
  word_id: string;
  prompt: string;
  distractors: string[];
}

export interface ListeningExercise {
  id: string;
  type: "listening";
  word_id: string;
  prompt: string;
  distractors: string[];
}

export interface FillInBlankExercise {
  id: string;
  type: "fill_in_blank";
  sentence_template: string;
  correct_word_id: string;
  distractors: string[];
}

export interface MatchingPair {
  word_id: string;
  match: string;
}

export interface MatchingExercise {
  id: string;
  type: "matching";
  pairs: MatchingPair[];
}

export type Exercise =
  | FlashcardExercise
  | CharacterRecognitionExercise
  | ListeningExercise
  | FillInBlankExercise
  | MatchingExercise;

export interface Lesson {
  id: string;
  lesson_index: number;
  title: string;
  title_zh: string;
  xp_reward: number;
  estimated_minutes: number;
  exercises: Exercise[];
}

export interface Unit {
  id: string;
  hsk_level: number;
  unit_index: number;
  title: string;
  title_zh: string;
  description: string;
  kit_intro: string;
  vocabulary_ids: string[];
  lessons: Lesson[];
}

export interface VocabularyFile {
  level: number;
  words: VocabWord[];
}

// Hydrated exercise (word_id resolved to full VocabWord)
export interface HydratedFlashcard extends Omit<FlashcardExercise, "word_id"> {
  word: VocabWord;
}

export interface HydratedChoiceExercise {
  id: string;
  type: "character_recognition" | "listening";
  word: VocabWord;
  prompt: string;
  options: VocabWord[]; // [correct, ...distractors] shuffled
  correctIndex: number;
}

export interface HydratedFillInBlank {
  id: string;
  type: "fill_in_blank";
  sentenceTemplate: string;
  correctWord: VocabWord;
  options: VocabWord[];
  correctIndex: number;
}

export interface HydratedMatchingPair {
  word: VocabWord;
  match: string;
}

export interface HydratedMatching {
  id: string;
  type: "matching";
  pairs: HydratedMatchingPair[];
}

export type HydratedExercise =
  | HydratedFlashcard
  | HydratedChoiceExercise
  | HydratedFillInBlank
  | HydratedMatching;

export interface HydratedLesson {
  id: string;
  xp_reward: number;
  exercises: HydratedExercise[];
}

export type LessonPhase = "exercising" | "feedback" | "complete";

export interface LessonState {
  phase: LessonPhase;
  exercises: HydratedExercise[];
  currentIndex: number;
  score: number; // correct answers
  total: number;
  xpEarned: number;
  lastAnswerCorrect: boolean | null;
  startTime: number;
}
