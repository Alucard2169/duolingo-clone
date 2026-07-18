"use client";

import { useState, useMemo } from "react";

export function MatchPairs({
  pairs,
  disabled,
  onSubmit,
}: {
  pairs: [string, string][];
  disabled: boolean;
  onSubmit: (answer: [string, string][]) => void;
}) {
  const left = useMemo(() => shuffle(pairs.map((p) => p[0])), [pairs]);
  const right = useMemo(() => shuffle(pairs.map((p) => p[1])), [pairs]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<[string, string][]>([]);

  function handleRightClick(word: string) {
    if (!selectedLeft) return;
    setMatched((m) => [...m, [selectedLeft, word]]);
    setSelectedLeft(null);
  }

  const matchedLeftSet = new Set(matched.map((m) => m[0]));
  const matchedRightSet = new Set(matched.map((m) => m[1]));
  const allMatched = matched.length === pairs.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-8">
        <div className="flex flex-1 flex-col gap-2">
          {left.map((word) => (
            <button
              key={word}
              disabled={disabled || matchedLeftSet.has(word)}
              onClick={() => setSelectedLeft(word)}
              className={`rounded-xl border-2 border-b-4 px-3 py-2 font-bold ${
                matchedLeftSet.has(word)
                  ? "border-duo-gray bg-gray-100 opacity-40 dark:bg-gray-800 dark:border-gray-700"
                  : selectedLeft === word
                  ? "border-duo-blue-dark bg-blue-50 text-duo-blue dark:bg-blue-950/40"
                  : "border-duo-gray bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
              }`}
            >
              {word}
            </button>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          {right.map((word) => (
            <button
              key={word}
              disabled={disabled || matchedRightSet.has(word) || !selectedLeft}
              onClick={() => handleRightClick(word)}
              className={`rounded-xl border-2 border-b-4 px-3 py-2 font-bold ${
                matchedRightSet.has(word)
                  ? "border-duo-gray bg-gray-100 opacity-40 dark:bg-gray-800 dark:border-gray-700"
                  : "border-duo-gray bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
              }`}
            >
              {word}
            </button>
          ))}
        </div>
      </div>
      <button
        disabled={!allMatched || disabled}
        onClick={() => onSubmit(matched)}
        className="btn-duo mt-2 rounded-xl bg-duo-green border-duo-green-dark px-6 py-3 font-extrabold text-white disabled:bg-duo-gray disabled:border-duo-gray-dark"
      >
        Check
      </button>
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}