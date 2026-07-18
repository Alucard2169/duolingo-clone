"use client";

import { useEffect, useState } from "react";
import { api, type ExerciseOut, type CompleteLessonResponse } from "@/lib/api";
import { useUser } from "@/lib/user-context";
import { MultipleChoice } from "./exercises/MultipleChoice";
import { TypeAnswer } from "./exercises/TypeAnswer";
import { FillBlank } from "./exercises/FillBlank";
import { Translate } from "./exercises/Translate";
import { MatchPairs } from "./exercises/MatchPairs";
import { FeedbackBar } from "./FeedbackBar";
import { ProgressBar } from "./ProgressBar";
import { OutOfHeartsModal } from "./OutOfHeartsModal";
import { LessonCompleteModal } from "./LessonCompleteModal";

export function LessonPlayer({ lessonId }: { lessonId: number }) {
  const { setHeartsLocally, refreshUser } = useUser();
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [exercises, setExercises] = useState<ExerciseOut[]>([]);
  const [index, setIndex] = useState(0);
  const [hearts, setHearts] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; correctAnswer: any } | null>(null);
  const [outOfHearts, setOutOfHearts] = useState(false);
  const [completeResult, setCompleteResult] = useState<CompleteLessonResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .startLesson(lessonId)
      .then((res) => {
        setAttemptId(res.attempt_id);
        setExercises(res.lesson.exercises);
        setHearts(res.hearts);
        setHeartsLocally(res.hearts);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [lessonId, setHeartsLocally]);

  async function handleSubmit(answer: any) {
    if (!attemptId) return;
    const exercise = exercises[index];
    const res = await api.submitAnswer({ attempt_id: attemptId, exercise_id: exercise.id, answer });
    setHearts(res.hearts_remaining);
    setHeartsLocally(res.hearts_remaining); // instantly reflected in TopBar
    setFeedback({ correct: res.correct, correctAnswer: res.correct_answer });
    if (res.out_of_hearts) {
      setOutOfHearts(true);
    }
  }

  async function handleContinue() {
    setFeedback(null);
    if (index + 1 >= exercises.length) {
      if (!attemptId) return;
      const result = await api.completeLesson(attemptId);
      setCompleteResult(result);
      await refreshUser(); // pulls fresh XP/streak/gems from the server after completion
    } else {
      setIndex((i) => i + 1);
    }
  }

  if (loading) return <div className="p-8 text-center font-bold text-gray-400 dark:text-gray-500">Loading lesson…</div>;
  if (error) return <div className="p-8 text-center font-bold text-duo-red">{error}</div>;
  if (outOfHearts) return <OutOfHeartsModal />;
  if (completeResult) return <LessonCompleteModal result={completeResult} />;
  if (exercises.length === 0) return <div className="p-8 text-center dark:text-gray-300">No exercises found.</div>;

  const exercise = exercises[index];
  const disabled = feedback !== null;

  return (
    <div className="pb-32">
      <div className="mb-8 flex items-center gap-4">
        <ProgressBar current={index} total={exercises.length} />
        <span className="whitespace-nowrap font-extrabold text-duo-red">❤️ {hearts}</span>
      </div>

      <h2 className="mb-8 text-2xl font-extrabold dark:text-white">{exercise.prompt}</h2>

      {exercise.type === "multiple_choice" && (
        <MultipleChoice options={exercise.content.options} disabled={disabled} onSubmit={handleSubmit} />
      )}
      {exercise.type === "type_answer" && <TypeAnswer disabled={disabled} onSubmit={handleSubmit} />}
      {exercise.type === "fill_blank" && (
        <FillBlank
          sentence={exercise.content.sentence}
          options={exercise.content.options}
          disabled={disabled}
          onSubmit={handleSubmit}
        />
      )}
      {exercise.type === "translate" && (
        <Translate wordBank={exercise.content.word_bank} disabled={disabled} onSubmit={handleSubmit} />
      )}
      {exercise.type === "match_pairs" && (
        <MatchPairs pairs={exercise.content.pairs} disabled={disabled} onSubmit={handleSubmit} />
      )}

      {feedback && (
        <FeedbackBar correct={feedback.correct} correctAnswer={feedback.correctAnswer} onContinue={handleContinue} />
      )}
    </div>
  );
}