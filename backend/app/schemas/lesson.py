from pydantic import BaseModel
from typing import Any


class ExerciseOut(BaseModel):
    id: int
    order_index: int
    type: str
    prompt: str
    content: dict[str, Any]
    # correct_answer is intentionally excluded — never send answers to the client

    class Config:
        from_attributes = True


class LessonOut(BaseModel):
    id: int
    skill_id: int
    exercises: list[ExerciseOut]

    class Config:
        from_attributes = True


class StartLessonResponse(BaseModel):
    attempt_id: int
    lesson: LessonOut
    hearts: int


class AnswerRequest(BaseModel):
    attempt_id: int
    exercise_id: int
    answer: Any


class AnswerResponse(BaseModel):
    correct: bool
    correct_answer: Any
    hearts_remaining: int
    out_of_hearts: bool


class CompleteLessonResponse(BaseModel):
    xp_earned: int
    new_total_xp: int
    streak_count: int
    crowns: int
    skill_completed: bool
    newly_unlocked_skill_ids: list[int]
    newly_earned_achievements: list[str]