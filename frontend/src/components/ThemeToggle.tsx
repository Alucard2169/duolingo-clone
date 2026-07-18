"use client";

import { useTheme } from "@/lib/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-3 rounded-xl px-4 py-3 font-bold text-duo-text dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      <span className="text-xl">{theme === "dark" ? "🌙" : "☀️"}</span>
      Dark Mode
      <span
        className={`ml-auto h-6 w-11 rounded-full p-1 transition-colors ${
          theme === "dark" ? "bg-duo-green" : "bg-duo-gray"
        }`}
      >
        <span
          className={`block h-4 w-4 rounded-full bg-white shadow transition-transform ${
            theme === "dark" ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}