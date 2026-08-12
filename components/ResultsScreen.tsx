import type { ResultsData } from "@/lib/types";
import CategoryBadge from "./CategoryBadge";

interface ResultsScreenProps {
  name: string;
  results: ResultsData;
  onRetake: () => void;
}

export default function ResultsScreen({ name, results, onRetake }: ResultsScreenProps) {
  return (
    <div className="flex flex-col items-center text-center gap-6 py-6">
      <div className="text-6xl">🏆</div>
      <h1 className="text-2xl font-bold text-slate-700">
        Great job, {name}!
      </h1>

      <div className="flex flex-col items-center gap-1">
        <div className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          {name}&apos;s Score
        </div>
        <div className="text-7xl font-extrabold bg-gradient-to-r from-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
          {results.estimatedIQ}
        </div>
        <div className="text-xl font-bold text-slate-700">{results.tierLabel}</div>
        <div className="text-sm text-slate-500">
          {results.totalCorrect} of {results.totalQuestions} correct ({results.rawPercent}%)
        </div>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 text-left">
        <h2 className="mb-3 text-center text-sm font-bold uppercase tracking-wide text-slate-500">
          Category Breakdown
        </h2>
        <div className="flex flex-col gap-3">
          {results.categoryBreakdown.map((entry) => (
            <div key={entry.category} className="flex items-center justify-between gap-3">
              <CategoryBadge category={entry.category} />
              <div className="flex flex-1 items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-orange-400"
                    style={{ width: `${(entry.correct / entry.total) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-right text-sm font-semibold text-slate-600">
                  {entry.correct}/{entry.total}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="max-w-sm rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
        This score is just a fun estimate from this homemade quiz — it is not a real or clinical
        IQ test. Real IQ testing is done in person by a qualified professional.
      </p>

      <button
        type="button"
        onClick={onRetake}
        className="mt-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-orange-400 px-10 py-4 text-xl font-bold text-white shadow-lg transition-transform hover:scale-105 cursor-pointer"
      >
        Take the Test Again 🔄
      </button>
    </div>
  );
}
