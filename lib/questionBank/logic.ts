import type { Question } from "../types";
import { rngShuffle } from "../rng";
import { finalizePool, stringOptions } from "./helpers";

type Candidate = Omit<Question, "id" | "category" | "difficulty">;

const NAMES = [
  "Tom", "Sam", "Ann", "Mia", "Jack", "Leo", "Ben", "Cara", "Dan", "Ella",
  "Zara", "Wendy", "Sara", "Max", "Ivy", "Noah", "Ruby", "Kai", "Luna", "Finn",
  "Owen", "Nora", "Theo", "Amy", "Cody", "Dana", "Josh", "Wren", "Milo", "Ava",
];

interface Attribute {
  cmp: string;
  high: string;
  low: string;
}

const ATTRIBUTES: Attribute[] = [
  { cmp: "taller than", high: "tallest", low: "shortest" },
  { cmp: "older than", high: "oldest", low: "youngest" },
  { cmp: "faster than", high: "fastest", low: "slowest" },
  { cmp: "heavier than", high: "heaviest", low: "lightest" },
  { cmp: "richer than", high: "richest", low: "poorest" },
];

function orderingChain(
  rng: () => number,
  chainLength: number,
  shuffleClueOrder: boolean,
): Candidate {
  const attribute = ATTRIBUTES[Math.floor(rng() * ATTRIBUTES.length)];
  const chosen = rngShuffle(rng, NAMES).slice(0, chainLength);
  const clues = chosen.slice(0, -1).map((name, i) => `${name} is ${attribute.cmp} ${chosen[i + 1]}.`);
  const orderedClues = shuffleClueOrder ? rngShuffle(rng, clues) : clues;
  const askHigh = rng() > 0.5;
  const correct = askHigh ? chosen[0] : chosen[chosen.length - 1];
  const questionWord = askHigh ? attribute.high : attribute.low;
  const filler = NAMES.filter((n) => !chosen.includes(n));
  const distractorPool = [...chosen.filter((n) => n !== correct), ...rngShuffle(rng, filler).slice(0, 3)];
  const { options, correctIndex } = stringOptions(rng, correct, distractorPool);
  return {
    prompt: `${orderedClues.join(" ")} Who is the ${questionWord}?`,
    options,
    correctIndex,
  };
}

function raceRanking(rng: () => number): Candidate {
  const chosen = rngShuffle(rng, NAMES).slice(0, 5);
  const clues = chosen.slice(0, -1).map((name, i) => `${name} beat ${chosen[i + 1]}.`);
  const shuffledClues = rngShuffle(rng, clues);
  const askFirst = rng() > 0.5;
  const correct = askFirst ? chosen[0] : chosen[chosen.length - 1];
  const filler = NAMES.filter((n) => !chosen.includes(n));
  const distractorPool = [...chosen.filter((n) => n !== correct), ...rngShuffle(rng, filler).slice(0, 3)];
  const { options, correctIndex } = stringOptions(rng, correct, distractorPool);
  return {
    prompt: `In a race: ${shuffledClues.join(" ")} Who finished ${askFirst ? "first" : "last"}?`,
    options,
    correctIndex,
  };
}

const NONSENSE_WORDS = [
  "Zib", "Wob", "Glim", "Fenn", "Dax", "Morp", "Quix", "Snib", "Trog", "Vex",
  "Plunk", "Zorn", "Blip", "Crake", "Doff", "Nurb", "Yelp", "Grix", "Halp", "Ivo",
  "Splot", "Wrenk", "Fozzle", "Grimp", "Nazzle", "Pelt", "Quorn", "Rask", "Slonk", "Twiggle",
];

const YES_NO_OPTIONS = ["Yes", "No", "Maybe", "Not enough info"];

function syllogismDirect(rng: () => number, valid: boolean): Candidate {
  const [x, y] = rngShuffle(rng, NONSENSE_WORDS).slice(0, 2);
  const name = NAMES[Math.floor(rng() * NAMES.length)];
  const quantifier = valid ? "All" : "Some";
  const correct = valid ? "Yes" : "Not enough info";
  const { options, correctIndex } = stringOptions(
    rng,
    correct,
    YES_NO_OPTIONS.filter((o) => o !== correct),
  );
  return {
    prompt: `${quantifier} ${x}s are ${y}s. ${name} is a ${x}. Is ${name} definitely a ${y}?`,
    options,
    correctIndex,
  };
}

function syllogismTransitive(rng: () => number, valid: boolean): Candidate {
  const [a, b, c] = rngShuffle(rng, NONSENSE_WORDS).slice(0, 3);
  const firstQuantifier = valid ? "All" : "Some";
  const correct = valid ? "Yes" : "Not enough info";
  const { options, correctIndex } = stringOptions(
    rng,
    correct,
    YES_NO_OPTIONS.filter((o) => o !== correct),
  );
  return {
    prompt: `${firstQuantifier} ${a}s are ${b}s. All ${b}s are ${c}s. Are all ${a}s definitely ${c}s?`,
    options,
    correctIndex,
  };
}

interface OddGroup {
  items: [string, string, string, string];
  oddIndex: 0 | 1 | 2 | 3;
}

const ODD_ONE_OUT_EASY: OddGroup[] = [
  { items: ["Apple", "Banana", "Carrot", "Orange"], oddIndex: 2 },
  { items: ["Triangle", "Square", "Circle", "Red"], oddIndex: 3 },
  { items: ["Dog", "Cat", "Rose", "Rabbit"], oddIndex: 2 },
  { items: ["Car", "Bus", "Bicycle", "House"], oddIndex: 3 },
  { items: ["Monday", "Tuesday", "January", "Friday"], oddIndex: 2 },
  { items: ["Red", "Blue", "Green", "Chair"], oddIndex: 3 },
  { items: ["Milk", "Juice", "Water", "Bread"], oddIndex: 3 },
  { items: ["Eyes", "Nose", "Ears", "Table"], oddIndex: 3 },
];

const ODD_ONE_OUT_MEDIUM: OddGroup[] = [
  { items: ["Salmon", "Trout", "Dolphin", "Tuna"], oddIndex: 2 },
  { items: ["Violin", "Guitar", "Drum", "Painting"], oddIndex: 3 },
  { items: ["Gold", "Silver", "Iron", "Wood"], oddIndex: 3 },
  { items: ["Sparrow", "Eagle", "Bat", "Robin"], oddIndex: 2 },
  { items: ["Football", "Basketball", "Chess", "Tennis"], oddIndex: 2 },
  { items: ["Mercury", "Venus", "Moon", "Mars"], oddIndex: 2 },
  { items: ["Novel", "Poem", "Essay", "Sculpture"], oddIndex: 3 },
  { items: ["Ant", "Bee", "Spider", "Butterfly"], oddIndex: 2 },
];

function oddOneOut(rng: () => number, group: OddGroup): Candidate {
  const correct = group.items[group.oddIndex];
  const shuffled = rngShuffle(rng, group.items);
  const distractorPool = shuffled.filter((item) => item !== correct);
  const { options, correctIndex } = stringOptions(rng, correct, distractorPool);
  return {
    prompt: `Which one doesn't belong: ${shuffled.join(", ")}?`,
    options,
    correctIndex,
  };
}

interface ConditionalScenario {
  ifClause: string;
  thenClause: string;
  thenFact: string;
}

const CONDITIONAL_SCENARIOS: ConditionalScenario[] = [
  { ifClause: "it rains", thenClause: "the ground gets wet", thenFact: "The ground is wet" },
  { ifClause: "you study hard", thenClause: "you learn a lot", thenFact: "You learned a lot" },
  { ifClause: "the sun sets", thenClause: "it gets dark outside", thenFact: "It is dark outside" },
  { ifClause: "you touch a hot stove", thenClause: "you get burned", thenFact: "You got burned" },
  { ifClause: "a plant gets enough water", thenClause: "it grows well", thenFact: "The plant grew well" },
  { ifClause: "the alarm rings", thenClause: "everyone leaves the building", thenFact: "Everyone left the building" },
  { ifClause: "you drop a glass", thenClause: "it might break", thenFact: "The glass broke" },
  { ifClause: "the battery dies", thenClause: "the toy stops working", thenFact: "The toy stopped working" },
  { ifClause: "you practice piano every day", thenClause: "you get better at it", thenFact: "You got better at piano" },
  { ifClause: "it snows", thenClause: "the streets turn white", thenFact: "The streets are white" },
];

function conditionalReasoning(rng: () => number, scenario: ConditionalScenario): Candidate {
  const correct = "Maybe";
  const { options, correctIndex } = stringOptions(rng, correct, ["Yes", "No", "Always"]);
  return {
    prompt: `If ${scenario.ifClause}, ${scenario.thenClause}. ${scenario.thenFact}. Did ${scenario.ifClause} definitely happen?`,
    options,
    correctIndex,
  };
}

const EXCLUSIVE_TOPICS: [string, string, string][] = [
  ["It is sunny", "It is raining", "It is snowing"],
  ["The cat is sleeping", "The cat is eating", "The cat is playing"],
  ["She is reading a book", "She is watching TV", "She is riding a bike"],
  ["The light is red", "The light is yellow", "The light is green"],
  ["He ordered pizza", "He ordered pasta", "He ordered a salad"],
  ["The store is open", "The store is closed", "The store is being painted"],
  ["It is morning", "It is afternoon", "It is night"],
  ["The team won the game", "The team lost the game", "The team tied the game"],
];

function onlyOneTrue(rng: () => number, topics: [string, string, string]): Candidate {
  const trueIdx = Math.floor(rng() * 3);
  const falseIdxs = [0, 1, 2].filter((i) => i !== trueIdx);
  const correct = topics[trueIdx];
  const distractorPool = [...topics.filter((t) => t !== correct), "Can't tell"];
  const { options, correctIndex } = stringOptions(rng, correct, distractorPool);
  return {
    prompt: `Only one of these statements is true: '${topics[0]}', '${topics[1]}', '${topics[2]}'. '${topics[falseIdxs[0]]}' is false. '${topics[falseIdxs[1]]}' is false. Which one is true?`,
    options,
    correctIndex,
  };
}

export function generateLogicQuestions(rng: () => number): Question[] {
  const easy: Candidate[] = [];
  for (let i = 0; i < 80; i++) easy.push(orderingChain(rng, 3, false));
  for (let i = 0; i < 40; i++) easy.push(syllogismDirect(rng, true));
  for (const group of ODD_ONE_OUT_EASY) {
    for (let i = 0; i < 10; i++) easy.push(oddOneOut(rng, group));
  }

  const medium: Candidate[] = [];
  for (let i = 0; i < 80; i++) medium.push(orderingChain(rng, 4, false));
  for (let i = 0; i < 40; i++) medium.push(syllogismTransitive(rng, true));
  for (let i = 0; i < 30; i++) medium.push(syllogismDirect(rng, false));
  for (const group of ODD_ONE_OUT_MEDIUM) {
    for (let i = 0; i < 10; i++) medium.push(oddOneOut(rng, group));
  }
  for (const scenario of CONDITIONAL_SCENARIOS) {
    medium.push(conditionalReasoning(rng, scenario));
  }

  const hard: Candidate[] = [];
  for (let i = 0; i < 80; i++) hard.push(orderingChain(rng, 5, true));
  for (let i = 0; i < 80; i++) hard.push(raceRanking(rng));
  for (let i = 0; i < 30; i++) hard.push(syllogismTransitive(rng, false));
  for (const topics of EXCLUSIVE_TOPICS) {
    for (let i = 0; i < 4; i++) hard.push(onlyOneTrue(rng, topics));
  }

  return [
    ...finalizePool(rng, easy, "logic", "easy", 25),
    ...finalizePool(rng, medium, "logic", "medium", 50),
    ...finalizePool(rng, hard, "logic", "hard", 50),
  ];
}
