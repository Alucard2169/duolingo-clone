
import { api } from "@/lib/api";
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const [user, achievements] = await Promise.all([api.getMe(), api.getAchievements()]);

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-duo-blue text-3xl font-extrabold text-white">
          {user.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold dark:text-white">{user.username}</h1>
          <p className="text-gray-500 dark:text-gray-400">Learning Spanish 🇪🇸</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <StatCard label="Total XP" value={user.current_xp} icon="⭐" />
        <StatCard label="Day Streak" value={user.streak_count} icon="🔥" />
        <StatCard label="Gems" value={user.gems} icon="💎" />
      </div>

      <h2 className="mb-4 text-xl font-extrabold dark:text-white">Achievements</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {achievements.map((a) => (
          <div
            key={a.title}
            className={`flex flex-col items-center rounded-2xl border-2 p-4 text-center ${
              a.earned
                ? "border-duo-yellow-dark bg-yellow-50 dark:bg-yellow-950/30"
                : "border-duo-gray bg-gray-50 opacity-60 dark:border-gray-700 dark:bg-gray-900"
            }`}
          >
            <span className="mb-2 text-3xl">{a.earned ? "🏆" : "🔒"}</span>
            <span className="text-sm font-extrabold dark:text-gray-100">{a.title}</span>
            <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">{a.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border-2 border-duo-gray bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <span className="text-2xl">{icon}</span>
      <span className="text-xl font-extrabold dark:text-gray-100">{value}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  );
}