export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="h-4 w-full overflow-hidden rounded-full bg-duo-gray dark:bg-gray-700">
      <div
        className="h-full rounded-full bg-duo-green transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}