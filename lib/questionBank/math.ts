import type { Question } from "../types";
import { finalizePool, numberOptions } from "./helpers";

type Candidate = Omit<Question, "id" | "category" | "difficulty">;

function ascendingSeq(rng: () => number, a: number, d: number): Candidate {
  const terms = [a, a + d, a + 2 * d, a + 3 * d];
  const correct = a + 4 * d;
  const { options, correctIndex } = numberOptions(rng, correct, [
    correct + d,
    correct - d,
    correct + 2 * d,
    correct - 2 * d,
    correct + 1,
    correct - 1,
  ]);
  return { prompt: `${terms.join(", ")}, ?`, options, correctIndex };
}

function descendingSeq(rng: () => number, a: number, d: number): Candidate {
  const terms = [a, a - d, a - 2 * d, a - 3 * d];
  const correct = a - 4 * d;
  const { options, correctIndex } = numberOptions(rng, correct, [
    correct + d,
    correct - d,
    correct + 2 * d,
    correct - 2 * d,
    correct + 1,
  ]);
  return { prompt: `${terms.join(", ")}, ?`, options, correctIndex };
}

function additionWordProblem(rng: () => number, have: number, more: number): Candidate {
  const correct = have + more;
  const { options, correctIndex } = numberOptions(rng, correct, [
    correct + 1,
    correct - 1,
    have,
    more,
    correct + 2,
  ]);
  return {
    prompt: `You have ${have} stickers and get ${more} more. How many stickers do you have now?`,
    options,
    correctIndex,
  };
}

function subtractionWordProblem(rng: () => number, have: number, give: number): Candidate {
  const correct = have - give;
  const { options, correctIndex } = numberOptions(rng, correct, [
    correct + 1,
    correct - 1,
    give,
    correct + 2,
    correct - 2,
  ]);
  return {
    prompt: `You have ${have} marbles and give away ${give}. How many marbles are left?`,
    options,
    correctIndex,
  };
}

function gridMultiply(rng: () => number, rows: number, cols: number): Candidate {
  const correct = rows * cols;
  const { options, correctIndex } = numberOptions(rng, correct, [
    correct + rows,
    correct - rows,
    correct + cols,
    correct - cols,
    rows + cols,
  ]);
  return {
    prompt: `A box has ${rows} rows of ${cols} eggs. How many eggs in total?`,
    options,
    correctIndex,
  };
}

function geometricSeq(rng: () => number, a: number, r: number, terms: number): Candidate {
  const seq: number[] = [a];
  for (let i = 1; i < terms; i++) seq.push(seq[i - 1] * r);
  const correct = seq[terms - 1] * r;
  const { options, correctIndex } = numberOptions(rng, correct, [
    correct + seq[terms - 1],
    correct - seq[terms - 1],
    Math.round(correct / r),
    correct + r,
    correct - r,
  ]);
  return { prompt: `${seq.join(", ")}, ?`, options, correctIndex };
}

function unitPriceWordProblem(rng: () => number, n: number, price: number, m: number): Candidate {
  const cost = n * price;
  const correct = m * price;
  const { options, correctIndex } = numberOptions(rng, correct, [
    correct + price,
    correct - price,
    cost,
    correct + 1,
    correct - 1,
  ]);
  return {
    prompt: `If ${n} pencils cost $${cost}, how much do ${m} pencils cost?`,
    options,
    correctIndex,
  };
}

function squareSeq(rng: () => number, startBase: number): Candidate {
  const bases = [startBase, startBase + 1, startBase + 2, startBase + 3];
  const terms = bases.map((b) => b * b);
  const correctBase = startBase + 4;
  const correct = correctBase * correctBase;
  const { options, correctIndex } = numberOptions(rng, correct, [
    correct + correctBase,
    correct - correctBase,
    correct + 1,
    correct - 1,
    (correctBase - 1) * (correctBase - 1),
  ]);
  return { prompt: `${terms.join(", ")}, ?`, options, correctIndex };
}

function fractionOfNumber(rng: () => number, num: number, den: number, whole: number): Candidate {
  const correct = (whole / den) * num;
  const { options, correctIndex } = numberOptions(rng, correct, [
    whole,
    correct + den,
    correct - den,
    whole / den,
    correct + 1,
  ]);
  return {
    prompt: `What is ${num}/${den} of ${whole}?`,
    options,
    correctIndex,
  };
}

function fibonacciLike(rng: () => number, a: number, b: number): Candidate {
  const seq = [a, b];
  for (let i = 2; i < 5; i++) seq.push(seq[i - 1] + seq[i - 2]);
  const correct = seq[4] + seq[3];
  const { options, correctIndex } = numberOptions(rng, correct, [
    correct + 1,
    correct - 1,
    seq[4] + seq[4],
    correct + seq[3],
    correct - seq[3],
  ]);
  return { prompt: `${seq.join(", ")}, ?`, options, correctIndex };
}

function discountWordProblem(rng: () => number, price: number, pct: number): Candidate {
  const correct = price - (price * pct) / 100;
  const { options, correctIndex } = numberOptions(rng, correct, [
    price,
    (price * pct) / 100,
    correct + 5,
    correct - 5,
    correct + 10,
  ]);
  return {
    prompt: `A shirt costs $${price}. It's on sale for ${pct}% off. What's the new price?`,
    options,
    correctIndex,
  };
}

function orderOfOperations(
  rng: () => number,
  a: number,
  b: number,
  c: number,
  variant: "addMul" | "parenMul" | "mulSub",
): Candidate {
  let prompt: string;
  let correct: number;
  if (variant === "addMul") {
    prompt = `${a} + ${b} × ${c} = ?`;
    correct = a + b * c;
  } else if (variant === "parenMul") {
    prompt = `(${a} + ${b}) × ${c} = ?`;
    correct = (a + b) * c;
  } else {
    prompt = `${a} × ${b} - ${c} = ?`;
    correct = a * b - c;
  }
  const { options, correctIndex } = numberOptions(rng, correct, [
    correct + c,
    correct - c,
    correct + 1,
    correct - 1,
    a + b + c,
  ]);
  return { prompt, options, correctIndex };
}

function distanceWordProblem(rng: () => number, speed: number, timeHalves: number): Candidate {
  const time = timeHalves / 2;
  const correct = speed * time;
  const { options, correctIndex } = numberOptions(rng, correct, [
    correct + speed / 2,
    correct - speed / 2,
    speed,
    correct + 10,
    correct - 10,
  ]);
  return {
    prompt: `A car travels ${speed} miles in 1 hour. How far does it go in ${time} hours?`,
    options,
    correctIndex,
  };
}

function oneStepAlgebra(rng: () => number, coef: number, x: number): Candidate {
  const total = coef * x;
  const correct = x;
  const { options, correctIndex } = numberOptions(rng, correct, [
    correct + 1,
    correct - 1,
    correct + 2,
    coef,
    total,
  ]);
  return { prompt: `If ${coef}x = ${total}, what is x?`, options, correctIndex };
}

function bigMultiply(rng: () => number, a: number, b: number): Candidate {
  const correct = a * b;
  const { options, correctIndex } = numberOptions(rng, correct, [
    correct + a,
    correct - a,
    correct + b,
    correct - b,
    correct + 10,
  ]);
  return { prompt: `${a} × ${b} = ?`, options, correctIndex };
}

export function generateMathQuestions(rng: () => number): Question[] {
  const easy: Candidate[] = [];
  for (let a = 1; a <= 20; a += 1) {
    for (let d = 1; d <= 6; d += 1) {
      easy.push(ascendingSeq(rng, a, d));
    }
  }
  for (let a = 25; a <= 60; a += 3) {
    for (let d = 1; d <= 5; d += 1) {
      easy.push(descendingSeq(rng, a, d));
    }
  }
  for (let have = 1; have <= 15; have += 1) {
    for (let more = 1; more <= 12; more += 2) {
      easy.push(additionWordProblem(rng, have, more));
    }
  }
  for (let have = 5; have <= 20; have += 1) {
    for (let give = 1; give <= have - 1; give += 3) {
      easy.push(subtractionWordProblem(rng, have, give));
    }
  }
  for (let rows = 2; rows <= 6; rows += 1) {
    for (let cols = 2; cols <= 6; cols += 1) {
      easy.push(gridMultiply(rng, rows, cols));
    }
  }

  const medium: Candidate[] = [];
  for (let a = 1; a <= 6; a += 1) {
    for (const r of [2, 3]) {
      medium.push(geometricSeq(rng, a, r, 3));
    }
  }
  for (let n = 2; n <= 6; n += 1) {
    for (let price = 2; price <= 10; price += 1) {
      for (let m = n + 1; m <= n + 6; m += 2) {
        medium.push(unitPriceWordProblem(rng, n, price, m));
      }
    }
  }
  for (let rows = 7; rows <= 14; rows += 1) {
    for (let cols = 7; cols <= 14; cols += 1) {
      medium.push(gridMultiply(rng, rows, cols));
    }
  }
  for (let start = 1; start <= 8; start += 1) {
    medium.push(squareSeq(rng, start));
  }
  for (const [num, den] of [
    [1, 2],
    [1, 4],
    [3, 4],
    [1, 5],
    [2, 5],
    [1, 10],
  ] as const) {
    for (let whole = den * 2; whole <= den * 20; whole += den) {
      medium.push(fractionOfNumber(rng, num, den, whole));
    }
  }

  const hard: Candidate[] = [];
  for (let a = 1; a <= 5; a += 1) {
    for (const r of [2, 3]) {
      hard.push(geometricSeq(rng, a, r, 4));
    }
  }
  for (let a = 1; a <= 10; a += 1) {
    for (let b = a + 1; b <= a + 8; b += 1) {
      hard.push(fibonacciLike(rng, a, b));
    }
  }
  for (let price = 20; price <= 100; price += 10) hard.push(discountWordProblem(rng, price, 10));
  for (let price = 20; price <= 100; price += 5) hard.push(discountWordProblem(rng, price, 20));
  for (let price = 20; price <= 100; price += 4) hard.push(discountWordProblem(rng, price, 25));
  for (let price = 20; price <= 100; price += 2) hard.push(discountWordProblem(rng, price, 50));
  for (let a = 2; a <= 12; a += 1) {
    for (let b = 2; b <= 9; b += 1) {
      for (let c = 2; c <= 9; c += 1) {
        hard.push(orderOfOperations(rng, a, b, c, "addMul"));
        hard.push(orderOfOperations(rng, a, b, c, "parenMul"));
        hard.push(orderOfOperations(rng, a, b, c, "mulSub"));
      }
    }
  }
  for (const speed of [20, 30, 40, 50, 60, 70, 80]) {
    for (const timeHalves of [3, 5, 7, 9]) {
      hard.push(distanceWordProblem(rng, speed, timeHalves));
    }
  }
  for (let coef = 2; coef <= 9; coef += 1) {
    for (let x = 2; x <= 12; x += 1) {
      hard.push(oneStepAlgebra(rng, coef, x));
    }
  }
  for (let a = 11; a <= 30; a += 1) {
    for (let b = 3; b <= 9; b += 1) {
      hard.push(bigMultiply(rng, a, b));
    }
  }

  return [
    ...finalizePool(rng, easy, "math", "easy", 25),
    ...finalizePool(rng, medium, "math", "medium", 50),
    ...finalizePool(rng, hard, "math", "hard", 50),
  ];
}
