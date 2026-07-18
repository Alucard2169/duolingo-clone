import { ThemeToggle } from "@/components/ThemeToggle";

export default function SettingsPage() {
  const comingSoonRows = [
    { icon: "🔔", label: "Notifications" },
    { icon: "🌐", label: "Learning Language" },
    { icon: "💳", label: "Super Duolingo" },
    { icon: "👥", label: "Friends & Following" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-extrabold dark:text-white">Settings</h1>
      <div className="overflow-hidden rounded-2xl border-2 border-duo-gray bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="border-b border-duo-gray dark:border-gray-700">
          <ThemeToggle />
        </div>
        {comingSoonRows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-5 py-4 dark:text-gray-200 ${
              i !== comingSoonRows.length - 1 ? "border-b border-duo-gray dark:border-gray-700" : ""
            }`}
          >
            <div className="flex items-center gap-3 font-bold">
              <span className="text-xl">{row.icon}</span>
              {row.label}
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-400 dark:bg-gray-800">
              Coming Soon
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}