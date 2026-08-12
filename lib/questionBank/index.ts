import { mulberry32 } from "../rng";
import type { Question } from "../types";
import { generateMathQuestions } from "./math";
import { generatePatternQuestions } from "./pattern";
import { generateLogicQuestions } from "./logic";
import { generateVerbalQuestions } from "./verbal";

/**
 * Fixed seed so the 500-question pool is generated identically every time
 * (same on server and client, same across restarts/deploys) — only the
 * per-attempt draw of 60 (see lib/selectTest.ts) uses real randomness.
 */
const BANK_SEED = 20260812;

function buildPool(): Question[] {
  const rng = mulberry32(BANK_SEED);
  return [
    ...generatePatternQuestions(rng),
    ...generateLogicQuestions(rng),
    ...generateMathQuestions(rng),
    ...generateVerbalQuestions(rng),
  ];
}

export const questionPool: Question[] = buildPool();

if (process.env.NODE_ENV !== "production" && questionPool.length !== 500) {
  console.warn(`Expected 500 questions in the pool, found ${questionPool.length}`);
}
