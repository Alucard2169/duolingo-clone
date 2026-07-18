from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import (
    Lesson, Exercise, User, UserLessonAttempt, UserExerciseAttempt,
    UserSkillProgress, SkillStatus, Skill,
)
from app.schemas.lesson import (
    StartLessonResponse, LessonOut, ExerciseOut,
    AnswerRequest, AnswerResponse, CompleteLessonResponse,
)
from app.routers.users import get_current_user
from app.services.hearts import regenerate_hearts, lose_heart
from app.services.streak import update_streak_on_activity
from app.services.path_logic import unlock_next_skill
from app.services.achievements import check_and_award_achievements

router = APIRouter(prefix="/api/lessons", tags=["lessons"])

XP_PER_LESSON = 10
XP_PERFECT_BONUS = 5  # bonus if no mistakes made


def _check_answer(exercise: Exercise, submitted) -> bool:
    correct = exercise.correct_answer.get("answer") or exercise.correct_answer.get("pairs")
    exercise_type = exercise.type.value

    if exercise_type in ("multiple_choice", "fill_blank"):
        return str(submitted).strip().lower() == str(correct).strip().lower()
    if exercise_type == "type_answer":
        return str(submitted).strip().lower() == str(correct).strip().lower()
    if exercise_type == "translate":
        # correct is a list of words in order
        return [w.lower() for w in submitted] == [w.lower() for w in correct]
    if exercise_type == "match_pairs":
        # submitted expected as list of [a, b] pairs; compare as sets since order may vary
        submitted_set = {tuple(p) for p in submitted}
        correct_set = {tuple(p) for p in correct}
        return submitted_set == correct_set
    return False


@router.post("/{lesson_id}/start", response_model=StartLessonResponse)
def start_lesson(lesson_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    regenerate_hearts(user)
    db.commit()

    if user.hearts <= 0:
        raise HTTPException(status_code=400, detail="Out of hearts")

    lesson = (
        db.query(Lesson)
        .options(joinedload(Lesson.exercises))
        .filter(Lesson.id == lesson_id)
        .first()
    )
    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")

    attempt = UserLessonAttempt(user_id=user.id, lesson_id=lesson.id)
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    exercises_out = [
        ExerciseOut(
            id=e.id, order_index=e.order_index, type=e.type.value,
            prompt=e.prompt, content=e.content,
        )
        for e in sorted(lesson.exercises, key=lambda e: e.order_index)
    ]

    return StartLessonResponse(
        attempt_id=attempt.id,
        lesson=LessonOut(id=lesson.id, skill_id=lesson.skill_id, exercises=exercises_out),
        hearts=user.hearts,
    )


@router.post("/answer", response_model=AnswerResponse)
def submit_answer(payload: AnswerRequest, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    attempt = db.query(UserLessonAttempt).filter(UserLessonAttempt.id == payload.attempt_id).first()
    if attempt is None or attempt.user_id != user.id:
        raise HTTPException(status_code=404, detail="Lesson attempt not found")
    if attempt.completed:
        raise HTTPException(status_code=400, detail="Lesson attempt already completed")

    exercise = db.query(Exercise).filter(Exercise.id == payload.exercise_id).first()
    if exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")

    is_correct = _check_answer(exercise, payload.answer)

    db.add(UserExerciseAttempt(
        lesson_attempt_id=attempt.id, exercise_id=exercise.id,
        user_answer={"value": payload.answer}, is_correct=is_correct,
    ))

    out_of_hearts = False
    if not is_correct:
        lose_heart(user)
        attempt.hearts_lost += 1
        out_of_hearts = user.hearts <= 0

    db.commit()

    return AnswerResponse(
        correct=is_correct,
        correct_answer=exercise.correct_answer.get("answer") or exercise.correct_answer.get("pairs"),
        hearts_remaining=user.hearts,
        out_of_hearts=out_of_hearts,
    )


@router.post("/{attempt_id}/complete", response_model=CompleteLessonResponse)
def complete_lesson(attempt_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    from datetime import datetime

    attempt = db.query(UserLessonAttempt).filter(UserLessonAttempt.id == attempt_id).first()
    if attempt is None or attempt.user_id != user.id:
        raise HTTPException(status_code=404, detail="Lesson attempt not found")
    if attempt.completed:
        raise HTTPException(status_code=400, detail="Already completed")

    is_first_lesson_ever = (
        db.query(UserLessonAttempt)
        .filter(UserLessonAttempt.user_id == user.id, UserLessonAttempt.completed == True)  # noqa: E712
        .count() == 0
    )

    xp = XP_PER_LESSON + (XP_PERFECT_BONUS if attempt.hearts_lost == 0 else 0)
    attempt.xp_earned = xp
    attempt.completed = True
    attempt.completed_at = datetime.utcnow()

    user.current_xp += xp
    update_streak_on_activity(user, xp)

    lesson = db.query(Lesson).filter(Lesson.id == attempt.lesson_id).first()
    skill = db.query(Skill).filter(Skill.id == lesson.skill_id).first()

    progress = (
        db.query(UserSkillProgress)
        .filter(UserSkillProgress.user_id == user.id, UserSkillProgress.skill_id == skill.id)
        .first()
    )
    if progress is None:
        progress = UserSkillProgress(user_id=user.id, skill_id=skill.id, status=SkillStatus.available)
        db.add(progress)

    progress.status = SkillStatus.completed
    progress.crowns = min(progress.crowns + 1, skill.total_levels)
    progress.last_practiced_at = datetime.utcnow()

    newly_unlocked_ids = unlock_next_skill(db, user.id, skill)

    db.commit()
    db.refresh(user)

    newly_earned = check_and_award_achievements(db, user, is_first_lesson_ever)
    db.commit()

    return CompleteLessonResponse(
        xp_earned=xp,
        new_total_xp=user.current_xp,
        streak_count=user.streak_count,
        crowns=progress.crowns,
        skill_completed=True,
        newly_unlocked_skill_ids=newly_unlocked_ids,
        newly_earned_achievements=newly_earned,
    )
