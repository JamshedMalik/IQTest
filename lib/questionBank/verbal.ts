import type { Question } from "../types";
import { rngShuffle } from "../rng";
import { finalizePool, stringOptions } from "./helpers";

type Candidate = Omit<Question, "id" | "category" | "difficulty">;
type Pair = [string, string];

const ANIMAL_BABY: Pair[] = [
  ["Dog", "Puppy"], ["Cat", "Kitten"], ["Cow", "Calf"], ["Horse", "Foal"],
  ["Sheep", "Lamb"], ["Chicken", "Chick"], ["Frog", "Tadpole"], ["Kangaroo", "Joey"],
  ["Bear", "Cub"], ["Lion", "Cub"], ["Duck", "Duckling"], ["Goose", "Gosling"],
  ["Pig", "Piglet"], ["Deer", "Fawn"],
];

const TOOL_ACTION: Pair[] = [
  ["Pen", "Write"], ["Knife", "Cut"], ["Brush", "Paint"], ["Spoon", "Eat"],
  ["Hammer", "Build"], ["Key", "Unlock"], ["Needle", "Sew"], ["Broom", "Sweep"],
  ["Camera", "Photograph"], ["Pencil", "Draw"], ["Oven", "Bake"], ["Telephone", "Call"],
];

const PROFESSION_WORKPLACE: Pair[] = [
  ["Teacher", "School"], ["Doctor", "Hospital"], ["Chef", "Kitchen"], ["Farmer", "Farm"],
  ["Pilot", "Airplane"], ["Judge", "Courtroom"], ["Librarian", "Library"], ["Firefighter", "Fire Station"],
  ["Astronaut", "Spaceship"], ["Actor", "Theater"], ["Artist", "Studio"], ["Scientist", "Laboratory"],
  ["Athlete", "Stadium"], ["Sailor", "Ship"],
];

const CREATOR_CREATION: Pair[] = [
  ["Author", "Book"], ["Painter", "Painting"], ["Composer", "Symphony"], ["Sculptor", "Statue"],
  ["Architect", "Building"], ["Director", "Movie"], ["Baker", "Cake"], ["Photographer", "Photograph"],
  ["Poet", "Poem"], ["Singer", "Song"], ["Designer", "Dress"], ["Inventor", "Invention"],
];

const OPPOSITES_EASY: Pair[] = [
  ["Hot", "Cold"], ["Big", "Small"], ["Fast", "Slow"], ["Up", "Down"], ["Happy", "Sad"],
  ["Day", "Night"], ["Wet", "Dry"], ["Full", "Empty"], ["Heavy", "Light"], ["Loud", "Quiet"],
  ["Open", "Closed"], ["Young", "Old"], ["High", "Low"], ["Clean", "Dirty"], ["Near", "Far"],
];

const OPPOSITES_MEDIUM: Pair[] = [
  ["Rich", "Poor"], ["Hard", "Soft"], ["Early", "Late"], ["Strong", "Weak"], ["Wide", "Narrow"],
  ["Thick", "Thin"], ["Brave", "Scared"], ["Gentle", "Rough"], ["Calm", "Wild"], ["Polite", "Rude"],
  ["Begin", "End"], ["Love", "Hate"], ["Giant", "Tiny"], ["Smooth", "Bumpy"], ["Simple", "Difficult"],
];

const OPPOSITES_HARD: Pair[] = [
  ["Generous", "Selfish"], ["Ancient", "Modern"], ["Honest", "Dishonest"], ["Careful", "Careless"],
  ["Patient", "Impatient"], ["Cheerful", "Gloomy"], ["Humble", "Proud"], ["Flexible", "Rigid"],
  ["Frequent", "Rare"], ["Visible", "Hidden"],
];

const SYNONYMS_EASY: Pair[] = [
  ["Happy", "Joyful"], ["Big", "Large"], ["Small", "Tiny"], ["Fast", "Quick"], ["Smart", "Clever"],
  ["Sad", "Unhappy"], ["Tired", "Exhausted"], ["Cold", "Chilly"], ["Pretty", "Beautiful"], ["Loud", "Noisy"],
];

const SYNONYMS_MEDIUM: Pair[] = [
  ["Funny", "Hilarious"], ["Angry", "Furious"], ["Scared", "Frightened"], ["Strong", "Powerful"],
  ["Quiet", "Silent"], ["Begin", "Start"], ["End", "Finish"], ["Jump", "Leap"], ["Run", "Dash"], ["Talk", "Speak"],
];

const SYNONYMS_HARD: Pair[] = [
  ["Brave", "Courageous"], ["Rich", "Wealthy"], ["Kind", "Generous"], ["Ancient", "Antique"],
  ["Enormous", "Colossal"], ["Bright", "Radiant"], ["Silent", "Hushed"], ["Weary", "Fatigued"],
  ["Fragile", "Delicate"], ["Swift", "Rapid"],
];

interface OddGroup {
  items: [string, string, string, string];
  oddIndex: 0 | 1 | 2 | 3;
}

const ODD_WORD_EASY: OddGroup[] = [
  { items: ["Chair", "Table", "Sofa", "Banana"], oddIndex: 3 },
  { items: ["Car", "Truck", "Bicycle", "Apple"], oddIndex: 3 },
  { items: ["Piano", "Guitar", "Drum", "Pizza"], oddIndex: 3 },
  { items: ["Hand", "Foot", "Knee", "Pencil"], oddIndex: 3 },
  { items: ["Rain", "Snow", "Sunshine", "Angry"], oddIndex: 3 },
  { items: ["Pot", "Pan", "Spoon", "Lion"], oddIndex: 3 },
  { items: ["One", "Two", "Three", "Cat"], oddIndex: 3 },
  { items: ["Red", "Blue", "Green", "Square"], oddIndex: 3 },
];

const ODD_WORD_MEDIUM: OddGroup[] = [
  { items: ["Math", "Science", "Art", "Soccer"], oddIndex: 3 },
  { items: ["Shark", "Whale", "Dolphin", "Horse"], oddIndex: 3 },
  { items: ["Ice", "Snow", "Frost", "Fire"], oddIndex: 3 },
  { items: ["Summer", "Winter", "Spring", "Monday"], oddIndex: 3 },
  { items: ["Novel", "Poem", "Essay", "Sculpture"], oddIndex: 3 },
  { items: ["Violin", "Cello", "Flute", "Easel"], oddIndex: 3 },
  { items: ["Whisper", "Mumble", "Shout", "Glance"], oddIndex: 3 },
  { items: ["Joy", "Anger", "Fear", "Chair"], oddIndex: 3 },
];

function crossPairAnalogy(rng: () => number, pairs: Pair[]): Candidate {
  const [p1, p2] = rngShuffle(rng, pairs).slice(0, 2);
  const [x, y] = p1;
  const [a, b] = p2;
  const correct = b;
  const otherWords = pairs.filter((p) => p !== p1 && p !== p2).map((p) => p[1]);
  const { options, correctIndex } = stringOptions(rng, correct, otherWords);
  return { prompt: `${x} is to ${y} as ${a} is to ___?`, options, correctIndex };
}

function opposite(rng: () => number, pairs: Pair[]): Candidate {
  const pair = pairs[Math.floor(rng() * pairs.length)];
  const askFirst = rng() > 0.5;
  const word = askFirst ? pair[0] : pair[1];
  const correct = askFirst ? pair[1] : pair[0];
  const otherWords = pairs.filter((p) => p !== pair).flatMap((p) => p);
  const { options, correctIndex } = stringOptions(rng, correct, otherWords);
  return { prompt: `Which word means the opposite of '${word}'?`, options, correctIndex };
}

function synonym(rng: () => number, pairs: Pair[]): Candidate {
  const pair = pairs[Math.floor(rng() * pairs.length)];
  const askFirst = rng() > 0.5;
  const word = askFirst ? pair[0] : pair[1];
  const correct = askFirst ? pair[1] : pair[0];
  const otherWords = pairs.filter((p) => p !== pair).flatMap((p) => p);
  const { options, correctIndex } = stringOptions(rng, correct, otherWords);
  return { prompt: `Which word means almost the same as '${word}'?`, options, correctIndex };
}

function oddOneOutWord(rng: () => number, group: OddGroup): Candidate {
  const correct = group.items[group.oddIndex];
  const shuffled = rngShuffle(rng, group.items);
  const distractorPool = shuffled.filter((item) => item !== correct);
  const { options, correctIndex } = stringOptions(rng, correct, distractorPool);
  return { prompt: `Which word doesn't belong: ${shuffled.join(", ")}?`, options, correctIndex };
}

export function generateVerbalQuestions(rng: () => number): Question[] {
  const easy: Candidate[] = [];
  for (let i = 0; i < 60; i++) easy.push(crossPairAnalogy(rng, ANIMAL_BABY));
  for (let i = 0; i < 40; i++) easy.push(opposite(rng, OPPOSITES_EASY));
  for (let i = 0; i < 40; i++) easy.push(synonym(rng, SYNONYMS_EASY));
  for (const group of ODD_WORD_EASY) {
    for (let i = 0; i < 10; i++) easy.push(oddOneOutWord(rng, group));
  }

  const medium: Candidate[] = [];
  for (let i = 0; i < 60; i++) medium.push(crossPairAnalogy(rng, TOOL_ACTION));
  for (let i = 0; i < 60; i++) medium.push(crossPairAnalogy(rng, PROFESSION_WORKPLACE));
  for (let i = 0; i < 40; i++) medium.push(opposite(rng, OPPOSITES_MEDIUM));
  for (let i = 0; i < 40; i++) medium.push(synonym(rng, SYNONYMS_MEDIUM));
  for (const group of ODD_WORD_MEDIUM) {
    for (let i = 0; i < 10; i++) medium.push(oddOneOutWord(rng, group));
  }

  const hard: Candidate[] = [];
  for (let i = 0; i < 80; i++) hard.push(crossPairAnalogy(rng, CREATOR_CREATION));
  for (let i = 0; i < 40; i++) hard.push(opposite(rng, OPPOSITES_HARD));
  for (let i = 0; i < 40; i++) hard.push(synonym(rng, SYNONYMS_HARD));

  return [
    ...finalizePool(rng, easy, "verbal", "easy", 25),
    ...finalizePool(rng, medium, "verbal", "medium", 50),
    ...finalizePool(rng, hard, "verbal", "hard", 50),
  ];
}
