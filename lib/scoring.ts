import type { Category, CategoryBreakdown, Question, ResultsData } from "./types";

const DIFFICULTY_WEIGHT: Record<Question["difficulty"], number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

const CATEGORY_ORDER: Category[] = ["pattern", "logic", "math", "verbal"];

/**
 * There's no real age-normed data behind this app (that data is proprietary
 * to clinical test publishers), so instead of a fake precise formula we
 * assume a rough population distribution for the weighted score and map it
 * onto the familiar IQ scale (mean 100, SD 15) with a z-score. These two
 * constants are the editable assumption: "a typical 10-year-old scores
 * around this % of weighted points, with about this much spread."
 */
const ASSUMED_MEAN_PERCENT = 55;
const ASSUMED_SD_PERCENT = 17;

const MIN_DISPLAY_IQ = 55;
const MAX_DISPLAY_IQ = 145;

function tierLabelFor(estimatedIQ: number): string {
  if (estimatedIQ < 90) return "Sharp Thinker in Training";
  if (estimatedIQ < 110) return "Great Thinker";
  if (estimatedIQ < 125) return "Super Sharp Thinker";
  return "Puzzle Master";
}

export function computeResults(
  answers: (number | null)[],
  questions: Question[],
): ResultsData {
  let earnedPoints = 0;
  let maxPoints = 0;
  let totalCorrect = 0;

  const breakdownMap = new Map<Category, CategoryBreakdown>(
    CATEGORY_ORDER.map((category) => [category, { category, correct: 0, total: 0 }]),
  );

  questions.forEach((question, index) => {
    const weight = DIFFICULTY_WEIGHT[question.difficulty];
    maxPoints += weight;

    const entry = breakdownMap.get(question.category)!;
    entry.total += 1;

    const isCorrect = answers[index] === question.correctIndex;
    if (isCorrect) {
      earnedPoints += weight;
      totalCorrect += 1;
      entry.correct += 1;
    }
  });

  const rawPercent = maxPoints === 0 ? 0 : (earnedPoints / maxPoints) * 100;
  const z = (rawPercent - ASSUMED_MEAN_PERCENT) / ASSUMED_SD_PERCENT;
  const estimatedIQRaw = Math.round(100 + z * 15);
  const estimatedIQ = Math.min(MAX_DISPLAY_IQ, Math.max(MIN_DISPLAY_IQ, estimatedIQRaw));

  return {
    estimatedIQ,
    tierLabel: tierLabelFor(estimatedIQ),
    rawPercent: Math.round(rawPercent),
    totalCorrect,
    totalQuestions: questions.length,
    categoryBreakdown: CATEGORY_ORDER.map((category) => breakdownMap.get(category)!),
  };
}
