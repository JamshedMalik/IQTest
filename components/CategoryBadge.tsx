import type { Category } from "@/lib/types";

const CATEGORY_INFO: Record<Category, { label: string; emoji: string; classes: string }> = {
  pattern: { label: "Pattern", emoji: "🧩", classes: "bg-purple-100 text-purple-700" },
  logic: { label: "Logic", emoji: "🧠", classes: "bg-blue-100 text-blue-700" },
  math: { label: "Math", emoji: "🔢", classes: "bg-green-100 text-green-700" },
  verbal: { label: "Words", emoji: "💬", classes: "bg-amber-100 text-amber-700" },
};

export default function CategoryBadge({ category }: { category: Category }) {
  const info = CATEGORY_INFO[category];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${info.classes}`}
    >
      <span aria-hidden>{info.emoji}</span>
      {info.label}
    </span>
  );
}
