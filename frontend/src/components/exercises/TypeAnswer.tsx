"use client";

import { useState } from "react";

export function TypeAnswer({
  disabled,
  onSubmit,
}: {
  disabled: boolean;
  onSubmit: (answer: string) => void;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <input
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your answer"
        className="rounded-xl border-2 border-duo-gray bg-white px-4 py-3 font-bold text-duo-text outline-none focus:border-duo-blue dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:placeholder:text-gray-500"
      />
      <button
        disabled={!value.trim() || disabled}
        onClick={() => onSubmit(value.trim())}
        className="btn-duo mt-2 rounded-xl bg-duo-green border-duo-green-dark px-6 py-3 font-extrabold text-white disabled:bg-duo-gray disabled:border-duo-gray-dark"
      >
        Check
      </button>
    </div>
  );
}