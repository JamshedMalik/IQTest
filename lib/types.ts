export type Category = "pattern" | "logic" | "math" | "verbal";

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  category: Category;
  difficulty: Difficulty;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
}

export type Screen = "welcome" | "test" | "results";

export interface CategoryBreakdown {
  category: Category;
  correct: number;
  total: number;
}

export interface ResultsData {
  estimatedIQ: number;
  tierLabel: string;
  rawPercent: number;
  totalCorrect: number;
  totalQuestions: number;
  categoryBreakdown: CategoryBreakdown[];
}
