import { api } from "@/lib/api";

export default async function LeaderboardPage() {
  const entries = await api.getLeaderboard();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold dark:text-white">🏆 Leaderboard</h1>
      <div className="overflow-hidden rounded-2xl border-2 border-duo-gray bg-white dark:border-gray-700 dark:bg-gray-900">
        {entries.map((entry, i) => (
          <div
            key={entry.username}
            className={`flex items-center justify-between px-5 py-4 ${
              i !== entries.length - 1 ? "border-b border-duo-gray dark:border-gray-700" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="w-6 text-center font-extrabold text-gray-400 dark:text-gray-500">{i + 1}</span>
              <span className="font-bold dark:text-gray-100">{entry.username}</span>
            </div>
            <span className="font-extrabold text-duo-yellow-dark">{entry.current_xp} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}