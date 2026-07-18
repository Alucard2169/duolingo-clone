import Link from "next/link";
import type { CompleteLessonResponse } from "@/lib/api";

export function LessonCompleteModal({ result }: { result: CompleteLessonResponse }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <div className="mx-4 flex max-w-sm flex-col items-center rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-gray-900">
        <div className="mb-4 text-5xl">🎉</div>
        <h2 className="mb-4 text-2xl font-extrabold text-duo-green-dark">Lesson Complete!</h2>

        <div className="mb-6 flex w-full justify-around">
          <Stat label="XP" value={`+${result.xp_earned}`} color="text-duo-yellow-dark" />
          <Stat label="Streak" value={`${result.streak_count} 🔥`} color="text-orange-500" />
          <Stat label="Crowns" value={`👑${result.crowns}`} color="text-duo-yellow-dark" />
        </div>

        {result.newly_earned_achievements.length > 0 && (
          <div className="mb-6 w-full rounded-xl bg-yellow-50 p-3 dark:bg-yellow-950/30">
            <p className="mb-1 text-sm font-extrabold text-duo-yellow-dark">Achievement unlocked!</p>
            {result.newly_earned_achievements.map((a) => (
              <p key={a} className="text-sm font-bold dark:text-gray-100">🏆 {a}</p>
            ))}
          </div>
        )}

        <Link
          href="/path"
          className="btn-duo w-full rounded-xl bg-duo-green border-duo-green-dark px-6 py-3 text-center text-white"
        >
          Continue
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`text-xl font-extrabold ${color}`}>{value}</span>
      <span className="text-xs font-bold text-gray-400 dark:text-gray-500">{label}</span>
    </div>
  );
}