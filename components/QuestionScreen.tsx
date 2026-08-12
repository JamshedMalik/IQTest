import type { Question } from "@/lib/types";
import ProgressBar from "./ProgressBar";
import CategoryBadge from "./CategoryBadge";
import AnswerCard from "./AnswerCard";

const LETTERS = ["A", "B", "C", "D"];

interface QuestionScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: number | null;
  onSelect: (optionIndex: number) => void;
  onNext: () => void;
}

export default function QuestionScreen({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelect,
  onNext,
}: QuestionScreenProps) {
  const isLast = questionNumber === totalQuestions;

  return (
    <div className="flex flex-col gap-6">
      <ProgressBar current={questionNumber} total={totalQuestions} />

      <div className="flex justify-center">
        <CategoryBadge category={question.category} />
      </div>

      <p className="text-center text-2xl font-bold text-slate-800 whitespace-pre-line">
        {question.prompt}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((option, index) => (
          <AnswerCard
            key={index}
            label={option}
            letter={LETTERS[index]}
            selected={selectedOption === index}
            onClick={() => onSelect(index)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={selectedOption === null}
        className="self-center mt-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-orange-400 px-10 py-3 text-lg font-bold text-white shadow-lg transition-transform enabled:hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {isLast ? "See My Results 🎉" : "Next ➡️"}
      </button>
    </div>
  );
}
