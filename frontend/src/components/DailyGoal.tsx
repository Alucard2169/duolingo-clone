export function DailyGoal({ currentXp, goalXp }: { currentXp: number; goalXp: number }) {
  const pct = Math.min(100, Math.round((currentXp / goalXp) * 100));

  return (
    <div className="mb-6 flex items-center gap-4 rounded-2xl border-2 border-duo-gray bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="relative h-14 w-14 shrink-0">
        <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e5e5" strokeWidth="4" className="dark:stroke-gray-700" />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="#ffc800"
            strokeWidth="4"
            strokeDasharray={`${pct * 0.973} 100`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg">🎯</span>
      </div>
      <div>
        <p className="font-extrabold dark:text-white">Daily Goal</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {Math.min(currentXp, goalXp)} / {goalXp} XP today
        </p>
      </div>
    </div>
  );
}