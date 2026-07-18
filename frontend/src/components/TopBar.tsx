"use client";

import { useUser } from "@/lib/user-context";

export function TopBar() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-duo-gray bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900 sm:px-8">
      <div className="text-2xl font-extrabold tracking-tight text-duo-green">duolingo</div>

      <div className="flex items-center gap-3 sm:gap-5">
        <Stat icon="🔥" value={user.streak_count} color="text-[#ff9600]" />
        <Stat icon="💎" value={user.gems} color="text-duo-blue" />
        <Stat icon="⭐" value={user.current_xp} color="text-duo-yellow-dark" />
        <Stat icon="❤️" value={user.hearts} color="text-duo-red" />
      </div>
    </header>
  );
}

function Stat({ icon, value, color }: { icon: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-2xl border-2 border-duo-gray bg-white px-3 py-1.5 font-extrabold dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
      <span className="text-lg leading-none">{icon}</span>
      <span className={color}>{value}</span>
    </div>
  );
}