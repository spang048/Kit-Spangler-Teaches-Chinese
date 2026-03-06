export type HistoryCategory = "history" | "culture" | "politics";
export type HistoryDifficulty = "beginner" | "intermediate" | "advanced";

export interface VocabHighlight {
  word: string;
  zh: string;
  pinyin: string;
}

export interface ArticleParagraph {
  id: string;
  text: string;
  vocab_highlights: VocabHighlight[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface HistoryTopic {
  id: string;
  title: string;
  title_zh: string;
  category: HistoryCategory;
  difficulty: HistoryDifficulty;
  estimated_read_minutes: number;
  xp_reward: number;
  thumbnail_emoji: string;
  kit_commentary: string;
  article: {
    paragraphs: ArticleParagraph[];
  };
  quiz: {
    questions: QuizQuestion[];
  };
}

export interface HistoryTopicSummary {
  id: string;
  title: string;
  title_zh: string;
  category: HistoryCategory;
  order: number;
  thumbnail_emoji: string;
}

export interface HistoryIndex {
  topics: HistoryTopicSummary[];
}
