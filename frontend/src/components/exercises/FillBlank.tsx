"use client";

import { useState } from "react";

export function FillBlank({
  sentence,
  options,
  disabled,
  onSubmit,
}: {
  sentence: string;
  options: string[];
  disabled: boolean;
  onSubmit: (answer: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl font-bold dark:text-gray-100">{sentence}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            disabled={disabled}
            onClick={() => setSelected(opt)}
            className={`rounded-xl border-2 border-b-4 px-4 py-2 font-bold ${
              selected === opt
                ? "border-duo-blue-dark bg-blue-50 text-duo-blue dark:bg-blue-950/40"
                : "border-duo-gray bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <button
        disabled={!selected || disabled}
        onClick={() => selected && onSubmit(selected)}
        className="btn-duo mt-4 rounded-xl bg-duo-green border-duo-green-dark px-6 py-3 font-extrabold text-white disabled:bg-duo-gray disabled:border-duo-gray-dark"
      >
        Check
      </button>
    </div>
  );
}