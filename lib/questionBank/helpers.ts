import { rngShuffle } from "../rng";
import type { Category, Difficulty, Question } from "../types";

export function numberOptions(
  rng: () => number,
  correct: number,
  distractorPool: number[],
  format: (n: number) => string = (n) => n.toLocaleString("en-US"),
): { options: [string, string, string, string]; correctIndex: 0 | 1 | 2 | 3 } {
  const unique = Array.from(new Set(distractorPool.filter((n) => n !== correct)));
  const picked = rngShuffle(rng, unique).slice(0, 3);

  // Defensive fallback in case a template didn't supply enough unique distractors.
  let offset = 1;
  while (picked.length < 3) {
    const candidate = correct + offset;
    if (candidate !== correct && !picked.includes(candidate)) picked.push(candidate);
    offset = offset > 0 ? -offset : -offset + 1;
  }

  const all = rngShuffle(rng, [correct, ...picked]);
  const options = all.map(format) as [string, string, string, string];
  const correctIndex = all.indexOf(correct) as 0 | 1 | 2 | 3;
  return { options, correctIndex };
}

export function stringOptions(
  rng: () => number,
  correct: string,
  distractorPool: string[],
): { options: [string, string, string, string]; correctIndex: 0 | 1 | 2 | 3 } {
  const unique = Array.from(new Set(distractorPool.filter((s) => s !== correct)));
  if (unique.length < 3) {
    throw new Error(
      `stringOptions needs >= 3 unique distractors, got ${unique.length} for "${correct}"`,
    );
  }
  const picked = rngShuffle(rng, unique).slice(0, 3);
  const all = rngShuffle(rng, [correct, ...picked]);
  const options = all as [string, string, string, string];
  const correctIndex = all.indexOf(correct) as 0 | 1 | 2 | 3;
  return { options, correctIndex };
}

/** Dedupes by prompt, shuffles deterministically, and slices to the exact quota. */
export function finalizePool(
  rng: () => number,
  candidates: Omit<Question, "id" | "category" | "difficulty">[],
  category: Category,
  difficulty: Difficulty,
  quota: number,
): Question[] {
  const seen = new Set<string>();
  const deduped = candidates.filter((c) => {
    // Some templates (e.g. "Which one doesn't belong?") reuse the same
    // prompt text and vary only the options, so the dedup key must include
    // both.
    const key = `${c.prompt}::${c.options.join("|")}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (deduped.length < quota) {
    throw new Error(
      `Not enough unique ${category}/${difficulty} candidates: need ${quota}, have ${deduped.length}`,
    );
  }

  return rngShuffle(rng, deduped)
    .slice(0, quota)
    .map((c, i) => ({
      id: `${category}-${difficulty}-${i + 1}`,
      category,
      difficulty,
      ...c,
    }));
}
