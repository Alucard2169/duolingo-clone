from datetime import datetime, date

from sqlalchemy import String, Integer, DateTime, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)

    current_xp: Mapped[int] = mapped_column(Integer, default=0)
    streak_count: Mapped[int] = mapped_column(Integer, default=0)
    last_activity_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    hearts: Mapped[int] = mapped_column(Integer, default=5)
    max_hearts: Mapped[int] = mapped_column(Integer, default=5)
    next_heart_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    gems: Mapped[int] = mapped_column(Integer, default=0)
    daily_xp_goal: Mapped[int] = mapped_column(Integer, default=20)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    skill_progress: Mapped[list["UserSkillProgress"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    lesson_attempts: Mapped[list["UserLessonAttempt"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    achievements: Mapped[list["UserAchievement"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )