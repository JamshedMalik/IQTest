import type { Question } from "../types";
import { rngShuffle, rngPick } from "../rng";
import { finalizePool, stringOptions } from "./helpers";

type Candidate = Omit<Question, "id" | "category" | "difficulty">;

const COLORS = ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠", "⚫", "⚪"];
const SHAPES = ["🔺", "🔻", "🔷", "🔶", "⬛", "⬜", "⭐", "🔘", "🔳", "🔲"];
const ANIMALS = ["🐱", "🐶", "🐭", "🐰", "🦊", "🐻", "🐼", "🐨"];
const FRUITS = ["🍎", "🍌", "🍇", "🍊", "🍓", "🍒", "🍉", "🥝"];
const PALETTES = [COLORS, SHAPES, ANIMALS, FRUITS];

const PAIR_TOKENS = SHAPES.flatMap((shape) => COLORS.map((color) => `${shape}${color}`));

/**
 * Builds a repeating-cycle pattern question. `patternShape` maps each shown
 * position to a distinct-symbol slot, e.g. [0,1] is A-B-A-B, [0,1,1] is
 * A-B-B repeating. `displayLen` terms are shown; the question asks for the
 * next one.
 */
function cyclePattern(
  rng: () => number,
  palette: readonly string[],
  patternShape: number[],
  displayLen: number,
): Candidate {
  const distinctCount = Math.max(...patternShape) + 1;
  const symbols = rngShuffle(rng, palette).slice(0, distinctCount);
  const cycle = patternShape.map((idx) => symbols[idx]);
  const sequence = Array.from({ length: displayLen }, (_, i) => cycle[i % cycle.length]);
  const correct = cycle[displayLen % cycle.length];
  const distractorPool = palette.filter((s) => !symbols.includes(s));
  const { options, correctIndex } = stringOptions(rng, correct, distractorPool);
  return {
    prompt: `What comes next in the pattern?\n\n${sequence.join("")} ?`,
    options,
    correctIndex,
  };
}

function growingCountArithmetic(
  rng: () => number,
  palette: readonly string[],
  startCount: number,
  step: number,
): Candidate {
  const symbol = rngPick(rng, palette);
  const counts = [startCount, startCount + step, startCount + 2 * step, startCount + 3 * step];
  const correctCount = startCount + 4 * step;
  const terms = counts.map((n) => symbol.repeat(n));
  const correct = symbol.repeat(correctCount);
  const distractorCounts = Array.from(
    new Set(
      [
        correctCount - 1,
        correctCount + 1,
        correctCount - 2,
        correctCount + 2,
        correctCount - 3,
        startCount,
      ].filter((n) => n > 0 && n !== correctCount),
    ),
  );
  const distractors = distractorCounts.map((n) => symbol.repeat(n));
  const { options, correctIndex } = stringOptions(rng, correct, distractors);
  return {
    prompt: `What comes next?\n\n${terms.join(" , ")} , ?`,
    options,
    correctIndex,
  };
}

function growingCountGeometric(
  rng: () => number,
  palette: readonly string[],
  startCount: number,
  ratio: number,
): Candidate {
  const symbol = rngPick(rng, palette);
  const counts = [startCount, startCount * ratio, startCount * ratio * ratio];
  const correctCount = startCount * ratio * ratio * ratio;
  const terms = counts.map((n) => symbol.repeat(n));
  const correct = symbol.repeat(correctCount);
  const distractorCounts = [
    correctCount - 1,
    correctCount + 1,
    Math.round(correctCount / ratio),
    correctCount + ratio,
  ].filter((n) => n > 0 && n !== correctCount);
  const distractors = distractorCounts.map((n) => symbol.repeat(n));
  const { options, correctIndex } = stringOptions(rng, correct, distractors);
  return {
    prompt: `What comes next?\n\n${terms.join(" , ")} , ?`,
    options,
    correctIndex,
  };
}

interface MatrixMask {
  grid: [[number, number, number], [number, number, number], [number, number, number]];
}

const MATRIX_MASKS: MatrixMask[] = [
  {
    grid: [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ],
  },
  {
    grid: [
      [0, 0, 1],
      [1, 0, 0],
      [0, 1, 0],
    ],
  },
];

function matrixQuestion(rng: () => number, palette: readonly string[], mask: MatrixMask): Candidate {
  const symbols = rngShuffle(rng, palette).slice(0, 2);
  const rows = mask.grid.map((row, r) =>
    row.map((v, c) => (r === 2 && c === 2 ? "?" : symbols[v])).join(""),
  );
  const correct = symbols[mask.grid[2][2]];
  const distractorPool = palette.filter((s) => s !== correct);
  const { options, correctIndex } = stringOptions(rng, correct, distractorPool);
  return {
    prompt: `What shape completes the grid?\n\n${rows.join("\n")}`,
    options,
    correctIndex,
  };
}

export function generatePatternQuestions(rng: () => number): Question[] {
  const easy: Candidate[] = [];
  for (const palette of PALETTES) {
    for (let i = 0; i < 30; i++) easy.push(cyclePattern(rng, palette, [0, 1], 5));
    for (let i = 0; i < 30; i++) easy.push(cyclePattern(rng, palette, [0, 1, 2], 6));
    for (const startCount of [1, 2]) {
      for (let i = 0; i < 10; i++) easy.push(growingCountArithmetic(rng, palette, startCount, 1));
    }
  }

  const medium: Candidate[] = [];
  for (const palette of PALETTES) {
    for (let i = 0; i < 30; i++) medium.push(cyclePattern(rng, palette, [0, 1, 1], 7));
    for (let i = 0; i < 30; i++) medium.push(cyclePattern(rng, palette, [0, 1, 2, 3], 8));
    for (const startCount of [1, 2]) {
      for (let i = 0; i < 10; i++) medium.push(growingCountArithmetic(rng, palette, startCount, 2));
    }
  }

  const hard: Candidate[] = [];
  for (const palette of PALETTES) {
    for (let i = 0; i < 20; i++) hard.push(cyclePattern(rng, palette, [0, 1, 2, 3], 9));
    for (const mask of MATRIX_MASKS) {
      for (let i = 0; i < 15; i++) hard.push(matrixQuestion(rng, palette, mask));
    }
    for (let i = 0; i < 10; i++) hard.push(growingCountGeometric(rng, palette, 1, 2));
  }
  for (let i = 0; i < 60; i++) hard.push(cyclePattern(rng, PAIR_TOKENS, [0, 1], 5));

  return [
    ...finalizePool(rng, easy, "pattern", "easy", 25),
    ...finalizePool(rng, medium, "pattern", "medium", 50),
    ...finalizePool(rng, hard, "pattern", "hard", 50),
  ];
}
