import type { Category, Difficulty, Question } from "./types";

type Bank = Record<Category, Record<Difficulty, Question[]>>;

function q(
  id: string,
  category: Category,
  difficulty: Difficulty,
  prompt: string,
  options: [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
): Question {
  return { id, category, difficulty, prompt, options, correctIndex };
}

const bank: Bank = {
  pattern: {
    easy: [
      q("pattern-easy-1", "pattern", "easy", "What comes next in the pattern?\n\n🔴🔵🔴🔵🔴 ?", ["🔴", "🔵", "🟢", "🟡"], 1),
      q("pattern-easy-2", "pattern", "easy", "What comes next in the pattern?\n\n⭐⭐🌙⭐⭐🌙⭐⭐ ?", ["⭐", "🌙", "☀️", "🌈"], 1),
      q("pattern-easy-3", "pattern", "easy", "What comes next in the pattern?\n\n🟦🟨🟦🟨🟦 ?", ["🟦", "🟨", "🟩", "⬛"], 1),
      q("pattern-easy-4", "pattern", "easy", "What comes next in the pattern?\n\n🔺🔺🔻🔺🔺🔻🔺🔺 ?", ["🔺", "🔻", "🔷", "🔶"], 1),
      q("pattern-easy-5", "pattern", "easy", "What comes next in the pattern?\n\n🍎🍌🍌🍎🍌🍌🍎🍌 ?", ["🍎", "🍌", "🍇", "🍊"], 1),
    ],
    medium: [
      q("pattern-medium-1", "pattern", "medium", "What comes next?\n\n⚪ , ⚪⚪ , ⚪⚪⚪ , ⚪⚪⚪⚪ , ?", ["⚪⚪⚪", "⚪⚪⚪⚪", "⚪⚪⚪⚪⚪", "⚪⚪⚪⚪⚪⚪"], 2),
      q("pattern-medium-2", "pattern", "medium", "What comes next in the pattern?\n\n🔴🔵🔵🔴🔵🔵🔴🔵 ?", ["🔴", "🔵", "🟢", "🟡"], 1),
      q("pattern-medium-3", "pattern", "medium", "What comes next in the pattern?\n\n🟥🟧🟨🟥🟧🟨🟥🟧 ?", ["🟥", "🟧", "🟨", "🟩"], 2),
      q("pattern-medium-4", "pattern", "medium", "What comes next in the pattern?\n\n🐱🐱🐶🐱🐱🐶🐱🐱 ?", ["🐱", "🐶", "🐭", "🐰"], 1),
      q("pattern-medium-5", "pattern", "medium", "What comes next?\n\n🔷 , 🔷🔷 , 🔷🔷🔷 , 🔷🔷🔷🔷 , ?", ["🔷🔷🔷", "🔷🔷🔷🔷", "🔷🔷🔷🔷🔷", "🔷🔷🔷🔷🔷🔷"], 2),
    ],
    hard: [
      q("pattern-hard-1", "pattern", "hard", "What comes next in the pattern?\n\n🔺⬜🔻⬛🔺⬜🔻⬛🔺 ?", ["⬜", "🔺", "🔻", "⬛"], 0),
      q("pattern-hard-2", "pattern", "hard", "What shape completes the grid?\n\n🔴🔵🔴\n🔵🔴🔵\n🔴🔵 ?", ["🔴", "🔵", "🟢", "🟡"], 0),
      q("pattern-hard-3", "pattern", "hard", "What comes next?\n\n🔵🔵 , 🔵🔵🔵🔵 , 🔵🔵🔵🔵🔵🔵 , ?", ["🔵🔵🔵🔵🔵🔵🔵", "🔵🔵🔵🔵🔵🔵🔵🔵", "🔵🔵🔵🔵🔵🔵🔵🔵🔵", "🔵🔵🔵🔵🔵🔵"], 1),
      q("pattern-hard-4", "pattern", "hard", "What comes next in the pattern?\n\n🔺🟥 , 🔻🟦 , 🔺🟥 , 🔻🟦 , 🔺🟥 , ?", ["🔺🟥", "🔻🟦", "🔺🟦", "🔻🟥"], 1),
      q("pattern-hard-5", "pattern", "hard", "What shape completes the grid?\n\n🟢🟢🔴\n🔴🟢🟢\n🟢🔴 ?", ["🟢", "🔴", "🔵", "🟡"], 0),
    ],
  },
  logic: {
    easy: [
      q("logic-easy-1", "logic", "easy", "Tom is taller than Sam. Sam is taller than Ann. Who is the shortest?", ["Tom", "Sam", "Ann", "Can't tell"], 2),
      q("logic-easy-2", "logic", "easy", "If today is Monday, what day will it be in 2 days?", ["Tuesday", "Wednesday", "Thursday", "Friday"], 1),
      q("logic-easy-3", "logic", "easy", "All dogs bark. Rex is a dog. Does Rex bark?", ["Yes", "No", "Maybe", "Not enough info"], 0),
      q("logic-easy-4", "logic", "easy", "Which one doesn't belong?", ["Apple", "Banana", "Carrot", "Orange"], 2),
      q("logic-easy-5", "logic", "easy", "Mia has more marbles than Jack. Jack has more marbles than Leo. Who has the most marbles?", ["Mia", "Jack", "Leo", "Can't tell"], 0),
    ],
    medium: [
      q("logic-medium-1", "logic", "medium", "All Zibs are Wobs. Max is a Zib. Is Max a Wob?", ["Yes", "No", "Maybe", "Not enough info"], 0),
      q("logic-medium-2", "logic", "medium", "If it rains, the ground gets wet. The ground is wet. Did it definitely rain?", ["Yes", "No", "Maybe", "Always"], 2),
      q("logic-medium-3", "logic", "medium", "Ben is older than Cara. Cara is older than Dan. Dan is older than Ella. Who is the youngest?", ["Ben", "Cara", "Dan", "Ella"], 3),
      q("logic-medium-4", "logic", "medium", "Which one doesn't belong?", ["Triangle", "Square", "Circle", "Red"], 3),
      q("logic-medium-5", "logic", "medium", "Every student in the class has a red backpack. Sam is a student in the class. What color is Sam's backpack?", ["Red", "Blue", "Green", "Can't tell"], 0),
    ],
    hard: [
      q("logic-hard-1", "logic", "hard", "Three friends — Ann, Ben, and Cara — each like a different fruit: apple, banana, cherry. Ann doesn't like banana. Ben likes cherry. What does Ann like?", ["Apple", "Banana", "Cherry", "Can't tell"], 0),
      q("logic-hard-2", "logic", "hard", "In a race: Amy finishes before Ben. Ben finishes before Cody. Dana finishes before Amy. Who finishes first?", ["Amy", "Ben", "Cody", "Dana"], 3),
      q("logic-hard-3", "logic", "hard", "All Bloops are Razzies. All Razzies are Lazzies. Are all Bloops definitely Lazzies?", ["Yes", "No", "Maybe", "Not enough info"], 0),
      q("logic-hard-4", "logic", "hard", "In a race, Sara beat Tom. Tom beat Wendy. Wendy beat Zara. Who came in last place?", ["Sara", "Tom", "Wendy", "Zara"], 3),
      q("logic-hard-5", "logic", "hard", "Only one of these is true: 'It is sunny', 'It is raining', 'It is snowing'. It is not sunny and not snowing. Which one is true?", ["It is sunny", "It is raining", "It is snowing", "Can't tell"], 1),
    ],
  },
  math: {
    easy: [
      q("math-easy-1", "math", "easy", "2, 4, 6, 8, ?", ["9", "10", "12", "14"], 1),
      q("math-easy-2", "math", "easy", "5 + 7 = ?", ["11", "12", "13", "14"], 1),
      q("math-easy-3", "math", "easy", "10, 20, 30, ?", ["35", "40", "45", "50"], 1),
      q("math-easy-4", "math", "easy", "If you have 3 apples and get 4 more, how many apples do you have?", ["6", "7", "8", "9"], 1),
      q("math-easy-5", "math", "easy", "20, 18, 16, ?", ["15", "14", "13", "12"], 1),
    ],
    medium: [
      q("math-medium-1", "math", "medium", "If 3 pencils cost 6 dollars, how much do 5 pencils cost?", ["$8", "$9", "$10", "$12"], 2),
      q("math-medium-2", "math", "medium", "3, 6, 12, 24, ?", ["36", "42", "48", "30"], 2),
      q("math-medium-3", "math", "medium", "A box has 4 rows of 5 apples. How many apples in total?", ["16", "18", "20", "24"], 2),
      q("math-medium-4", "math", "medium", "1, 4, 9, 16, ?", ["20", "24", "25", "30"], 2),
      q("math-medium-5", "math", "medium", "Half of 50, plus 10 = ?", ["25", "30", "35", "45"], 2),
    ],
    hard: [
      q("math-hard-1", "math", "hard", "5, 10, 20, 40, ?", ["45", "60", "70", "80"], 3),
      q("math-hard-2", "math", "hard", "A train travels 60 miles in 1 hour. How far does it go in 2.5 hours?", ["120", "130", "150", "160"], 2),
      q("math-hard-3", "math", "hard", "2, 3, 5, 8, 13, ?", ["18", "20", "21", "24"], 2),
      q("math-hard-4", "math", "hard", "A shirt costs $40. It's on sale for 25% off. What's the new price?", ["$25", "$28", "$30", "$35"], 2),
      q("math-hard-5", "math", "hard", "7, 14, 28, 56, ?", ["84", "98", "100", "112"], 3),
    ],
  },
  verbal: {
    easy: [
      q("verbal-easy-1", "verbal", "easy", "Dog is to Puppy as Cat is to ___?", ["Kitten", "Cub", "Chick", "Foal"], 0),
      q("verbal-easy-2", "verbal", "easy", "Big is to Small as Fast is to ___?", ["Slow", "Loud", "High", "Heavy"], 0),
      q("verbal-easy-3", "verbal", "easy", "Sun is to Day as Moon is to ___?", ["Night", "Star", "Sky", "Cloud"], 0),
      q("verbal-easy-4", "verbal", "easy", "Which word means the opposite of Happy?", ["Sad", "Glad", "Kind", "Calm"], 0),
      q("verbal-easy-5", "verbal", "easy", "Bird is to Fly as Fish is to ___?", ["Swim", "Walk", "Jump", "Crawl"], 0),
    ],
    medium: [
      q("verbal-medium-1", "verbal", "medium", "Hot is to Cold as Up is to ___?", ["Down", "Left", "Fast", "Loud"], 0),
      q("verbal-medium-2", "verbal", "medium", "Pen is to Write as Knife is to ___?", ["Cut", "Draw", "Read", "Cook"], 0),
      q("verbal-medium-3", "verbal", "medium", "Which word means almost the same as 'Happy'?", ["Joyful", "Angry", "Tired", "Bored"], 0),
      q("verbal-medium-4", "verbal", "medium", "Teacher is to School as Doctor is to ___?", ["Hospital", "Book", "Car", "Farm"], 0),
      q("verbal-medium-5", "verbal", "medium", "Which word doesn't belong?", ["Apple", "Peach", "Grape", "Chair"], 3),
    ],
    hard: [
      q("verbal-hard-1", "verbal", "hard", "Author is to Book as Painter is to ___?", ["Painting", "Brush", "Museum", "Frame"], 0),
      q("verbal-hard-2", "verbal", "hard", "Which word means the opposite of 'Generous'?", ["Selfish", "Kind", "Friendly", "Gentle"], 0),
      q("verbal-hard-3", "verbal", "hard", "Ocean is to Wave as Volcano is to ___?", ["Lava", "Mountain", "Ash", "Rock"], 0),
      q("verbal-hard-4", "verbal", "hard", "Which word means almost the same as 'Enormous'?", ["Huge", "Tiny", "Narrow", "Quiet"], 0),
      q("verbal-hard-5", "verbal", "hard", "Key is to Lock as Password is to ___?", ["Account", "Door", "Letter", "Book"], 0),
    ],
  },
};

const CATEGORY_ORDER: Category[] = ["pattern", "logic", "math", "verbal"];
const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard"];

/**
 * Questions are interleaved (round-robin across categories) within each
 * difficulty tier, and tiers run easy -> medium -> hard. This mixes
 * categories throughout the test while still easing a 10-year-old in with
 * easier questions first. The order is fixed at module load (not
 * re-shuffled per render), so it stays stable across reloads and keeps
 * localStorage-saved answer indices valid.
 */
function buildQuestionOrder(): Question[] {
  const ordered: Question[] = [];
  for (const difficulty of DIFFICULTY_ORDER) {
    for (let round = 0; round < 5; round++) {
      for (const category of CATEGORY_ORDER) {
        ordered.push(bank[category][difficulty][round]);
      }
    }
  }
  return ordered;
}

export const questions: Question[] = buildQuestionOrder();

if (process.env.NODE_ENV !== "production" && questions.length !== 60) {
  console.warn(`Expected 60 questions, found ${questions.length}`);
}
