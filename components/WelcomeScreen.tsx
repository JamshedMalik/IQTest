"use client";

import { useState } from "react";

interface WelcomeScreenProps {
  totalQuestions: number;
  onStart: (name: string) => void;
}

export default function WelcomeScreen({ totalQuestions, onStart }: WelcomeScreenProps) {
  const [name, setName] = useState("");
  const trimmedName = name.trim();

  const handleStart = () => {
    if (!trimmedName) return;
    onStart(trimmedName);
  };

  return (
    <div className="flex flex-col items-center text-center gap-6 py-8">
      <div className="text-7xl">🧠✨</div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800">
        The Big Brain Challenge
      </h1>
      <p className="max-w-md text-lg text-slate-600">
        Ready to test your thinking skills? You&apos;ll answer {totalQuestions} fun puzzles about
        patterns, logic, numbers, and words.
      </p>
      <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
        <span className="rounded-full bg-purple-100 text-purple-700 px-3 py-1">🧩 Pattern</span>
        <span className="rounded-full bg-blue-100 text-blue-700 px-3 py-1">🧠 Logic</span>
        <span className="rounded-full bg-green-100 text-green-700 px-3 py-1">🔢 Math</span>
        <span className="rounded-full bg-amber-100 text-amber-700 px-3 py-1">💬 Words</span>
      </div>
      <p className="max-w-sm text-slate-500">
        Takes about 25–30 minutes. There&apos;s no timer, so take your time and just do your best!
      </p>

      <div className="flex w-full max-w-xs flex-col gap-1.5">
        <label htmlFor="player-name" className="text-sm font-semibold text-slate-600">
          What&apos;s your name?
        </label>
        <input
          id="player-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleStart();
          }}
          placeholder="Type your name"
          maxLength={40}
          className="w-full rounded-full border-4 border-slate-200 px-5 py-3 text-center text-lg font-semibold text-slate-800 focus:border-fuchsia-400 focus:outline-none"
        />
      </div>

      <button
        type="button"
        onClick={handleStart}
        disabled={!trimmedName}
        className="mt-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-orange-400 px-10 py-4 text-xl font-bold text-white shadow-lg transition-transform enabled:hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        Start the Challenge! 🚀
      </button>
      <p className="max-w-sm text-xs text-slate-400">
        This is just a fun activity for practicing thinking skills — it is not a real or clinical
        IQ test.
      </p>
    </div>
  );
}
