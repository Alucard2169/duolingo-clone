import Link from "next/link";

export function OutOfHeartsModal() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <div className="mx-4 flex max-w-sm flex-col items-center rounded-2xl bg-white p-8 text-center shadow-xl dark:bg-gray-900">
        <div className="mb-4 text-5xl">💔</div>
        <h2 className="mb-2 text-xl font-extrabold dark:text-white">You&apos;re out of hearts!</h2>
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          Wait for your hearts to refill, or practice earlier skills to earn more.
        </p>
        <Link
          href="/path"
          className="btn-duo w-full rounded-xl bg-duo-blue border-duo-blue-dark px-6 py-3 text-center text-white"
        >
          Back to path
        </Link>
      </div>
    </div>
  );
}