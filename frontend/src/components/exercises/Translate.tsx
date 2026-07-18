"use client";

import { useState } from "react";

export function Translate({
  wordBank,
  disabled,
  onSubmit,
}: {
  wordBank: string[];
  disabled: boolean;
  onSubmit: (answer: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>(wordBank);

  function pick(word: string, index: number) {
    setSelected((s) => [...s, word]);
    setAvailable((a) => a.filter((_, i) => i !== index));
  }

  function unpick(word: string, index: number) {
    setSelected((s) => s.filter((_, i) => i !== index));
    setAvailable((a) => [...a, word]);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex min-h-[3rem] flex-wrap gap-2 border-b-2 border-duo-gray pb-3 dark:border-gray-700">
        {selected.map((w, i) => (
          <button
            key={i}
            disabled={disabled}
            onClick={() => unpick(w, i)}
            className="rounded-xl border-2 border-b-4 border-duo-gray bg-white px-3 py-2 font-bold dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >
            {w}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {available.map((w, i) => (
          <button
            key={i}
            disabled={disabled}
            onClick={() => pick(w, i)}
            className="rounded-xl border-2 border-b-4 border-duo-gray bg-white px-3 py-2 font-bold hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {w}
          </button>
        ))}
      </div>
      <button
        disabled={selected.length === 0 || disabled}
        onClick={() => onSubmit(selected)}
        className="btn-duo mt-2 rounded-xl bg-duo-green border-duo-green-dark px-6 py-3 font-extrabold text-white disabled:bg-duo-gray disabled:border-duo-gray-dark"
      >
        Check
      </button>
    </div>
  );
}