export function FeedbackBar({
  correct,
  correctAnswer,
  onContinue,
}: {
  correct: boolean;
  correctAnswer: any;
  onContinue: () => void;
}) {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t-2 p-4 sm:p-6 ${
        correct
          ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/40"
          : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40"
      }`}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <div>
          <p className={`text-lg font-extrabold ${correct ? "text-duo-green-dark" : "text-duo-red-dark"}`}>
            {correct ? "Nicely done!" : "Correct solution:"}
          </p>
          {!correct && (
            <p className="text-sm font-bold text-duo-red-dark">
              {Array.isArray(correctAnswer) ? correctAnswer.join(" ") : String(correctAnswer)}
            </p>
          )}
        </div>
        <button
          onClick={onContinue}
          className={`btn-duo rounded-xl px-8 py-3 text-white ${
            correct ? "bg-duo-green border-duo-green-dark" : "bg-duo-red border-duo-red-dark"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}