interface AnswerCardProps {
  label: string;
  letter: string;
  selected: boolean;
  onClick: () => void;
}

export default function AnswerCard({ label, letter, selected, onClick }: AnswerCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 w-full rounded-2xl border-4 px-5 py-4 text-left text-lg font-semibold transition-all cursor-pointer whitespace-pre-line ${
        selected
          ? "border-fuchsia-500 bg-fuchsia-50 text-fuchsia-800 shadow-md scale-[1.02]"
          : "border-slate-200 bg-white text-slate-700 hover:border-fuchsia-300 hover:bg-fuchsia-50/40"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
          selected ? "bg-fuchsia-500 text-white" : "bg-slate-100 text-slate-500"
        }`}
      >
        {selected ? "✓" : letter}
      </span>
      <span>{label}</span>
    </button>
  );
}
