"use client";

import { useUser } from "@/lib/user-context";

export function TopBar() {
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between overflow-hidden border-b-2 border-duo-gray bg-white px-3 py-3 dark:border-gray-700 dark:bg-gray-900 sm:px-8">
      <div className="shrink-0 text-xl font-extrabold tracking-tight text-duo-green sm:text-2xl">
     🦉<span className="hidden sm:inline"> duolingo</span>
      </div>

      <div className="flex min-w-0 items-center gap-1.5 sm:gap-5">
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
    <div className="flex items-center gap-1 rounded-2xl border-2 border-duo-gray bg-white px-2 py-1 font-extrabold dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 sm:gap-1.5 sm:px-3 sm:py-1.5">
      <span className="text-base leading-none sm:text-lg">{icon}</span>
      <span className={`text-sm sm:text-base ${color}`}>{value}</span>
    </div>
  );
}
