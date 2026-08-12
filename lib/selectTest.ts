import { shuffle } from "./shuffle";
import type { Category, Question } from "./types";

const CATEGORY_ORDER: Category[] = ["pattern", "logic", "math", "verbal"];
const PER_CATEGORY = 15;

export const TEST_LENGTH = CATEGORY_ORDER.length * PER_CATEGORY;

/**
 * Draws a fresh 60-question test from the full question pool: exactly 15
 * per category (so every attempt still covers all four skill areas evenly),
 * but which 15 — and their difficulty mix, since each category's pool is
 * intentionally weighted toward medium/hard — is different every time.
 */
export function pickTestQuestions(pool: Question[]): Question[] {
  const byCategory = new Map<Category, Question[]>(CATEGORY_ORDER.map((c) => [c, []]));
  for (const question of pool) {
    byCategory.get(question.category)?.push(question);
  }

  const selected = CATEGORY_ORDER.flatMap((category) =>
    shuffle(byCategory.get(category) ?? []).slice(0, PER_CATEGORY),
  );

  return shuffle(selected);
}
