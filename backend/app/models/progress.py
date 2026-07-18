import enum
from datetime import datetime

from sqlalchemy import (
    Integer,
    ForeignKey,
    DateTime,
    Boolean,
    JSON,
    Enum as SAEnum,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class SkillStatus(str, enum.Enum):
    locked = "locked"
    available = "available"
    completed = "completed"


class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"
    __table_args__ = (UniqueConstraint("user_id", "skill_id", name="uq_user_skill"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id"))

    status: Mapped[SkillStatus] = mapped_column(SAEnum(SkillStatus), default=SkillStatus.locked)
    crowns: Mapped[int] = mapped_column(Integer, default=0)
    last_practiced_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    user: Mapped["User"] = relationship(back_populates="skill_progress")
    skill: Mapped["Skill"] = relationship(back_populates="progress_entries")


class UserLessonAttempt(Base):
    __tablename__ = "user_lesson_attempts"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    lesson_id: Mapped[int] = mapped_column(ForeignKey("lessons.id"))

    xp_earned: Mapped[int] = mapped_column(Integer, default=0)
    hearts_lost: Mapped[int] = mapped_column(Integer, default=0)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)

    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    user: Mapped["User"] = relationship(back_populates="lesson_attempts")
    lesson: Mapped["Lesson"] = relationship()
    exercise_attempts: Mapped[list["UserExerciseAttempt"]] = relationship(
        back_populates="lesson_attempt", cascade="all, delete-orphan"
    )


class UserExerciseAttempt(Base):
    __tablename__ = "user_exercise_attempts"

    id: Mapped[int] = mapped_column(primary_key=True)
    lesson_attempt_id: Mapped[int] = mapped_column(ForeignKey("user_lesson_attempts.id"))
    exercise_id: Mapped[int] = mapped_column(ForeignKey("exercises.id"))

    user_answer: Mapped[dict] = mapped_column(JSON, default=dict)
    is_correct: Mapped[bool] = mapped_column(Boolean, default=False)
    answered_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    lesson_attempt: Mapped["UserLessonAttempt"] = relationship(back_populates="exercise_attempts")
    exercise: Mapped["Exercise"] = relationship()
