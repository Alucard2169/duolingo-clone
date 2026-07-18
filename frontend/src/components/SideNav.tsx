"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/path", label: "Learn", icon: "🏠" },
  { href: "/leaderboard", label: "Leaderboard", icon: "🏆" },
  { href: "/profile", label: "Profile", icon: "👤" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-16 hidden h-full w-56 flex-col gap-2 border-r-2 border-duo-gray  dark:border-gray-700 bg-white dark:bg-gray-900 p-4 sm:flex">
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 font-extrabold ${
              active ? "bg-blue-50 dark:bg-blue-950 text-duo-blue" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 hover:dark:bg-gray-950"
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}