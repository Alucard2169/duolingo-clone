const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json();
}

export const api = {
  getMe: () => request<UserOut>("/api/users/me"),
  getLeaderboard: () => request<LeaderboardEntry[]>("/api/users/leaderboard"),
  getPath: () => request<CourseOut>("/api/path"),
  getAchievements: () => request<AchievementOut[]>("/api/achievements"),

  startLesson: (lessonId: number) =>
    request<StartLessonResponse>(`/api/lessons/${lessonId}/start`, { method: "POST" }),

  submitAnswer: (payload: AnswerRequest) =>
    request<AnswerResponse>("/api/lessons/answer", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  completeLesson: (attemptId: number) =>
    request<CompleteLessonResponse>(`/api/lessons/${attemptId}/complete`, { method: "POST" }),
};

// ---- Types (mirroring backend Pydantic schemas) ----

export interface UserOut {
  id: number;
  username: string;
  current_xp: number;
  streak_count: number;
  last_activity_date: string | null;
  hearts: number;
  max_hearts: number;
  next_heart_at: string | null;
  gems: number;
  daily_xp_goal: number;
  daily_xp_earned: number;
}

export interface LeaderboardEntry {
  username: string;
  current_xp: number;
}

export interface SkillOut {
  id: number;
  title: string;
  order_index: number;
  icon: string;
  total_levels: number;
  status: "locked" | "available" | "completed";
  crowns: number;
}

export interface UnitOut {
  id: number;
  title: string;
  order_index: number;
  skills: SkillOut[];
}

export interface CourseOut {
  id: number;
  name: string;
  language_code: string;
  units: UnitOut[];
}

export interface ExerciseOut {
  id: number;
  order_index: number;
  type: "multiple_choice" | "translate" | "match_pairs" | "fill_blank" | "type_answer";
  prompt: string;
  content: Record<string, any>;
}

export interface LessonOut {
  id: number;
  skill_id: number;
  exercises: ExerciseOut[];
}

export interface StartLessonResponse {
  attempt_id: number;
  lesson: LessonOut;
  hearts: number;
}

export interface AnswerRequest {
  attempt_id: number;
  exercise_id: number;
  answer: any;
}

export interface AnswerResponse {
  correct: boolean;
  correct_answer: any;
  hearts_remaining: number;
  out_of_hearts: boolean;
}

export interface CompleteLessonResponse {
  xp_earned: number;
  new_total_xp: number;
  streak_count: number;
  crowns: number;
  skill_completed: boolean;
  newly_unlocked_skill_ids: number[];
  newly_earned_achievements: string[];
}

export interface AchievementOut {
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earned_at: string | null;
}
