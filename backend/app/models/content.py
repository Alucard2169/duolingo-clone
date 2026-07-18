import enum

from sqlalchemy import String, Integer, ForeignKey, JSON, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ExerciseType(str, enum.Enum):
    multiple_choice = "multiple_choice"
    translate = "translate"
    match_pairs = "match_pairs"
    fill_blank = "fill_blank"
    type_answer = "type_answer"


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    language_code: Mapped[str] = mapped_column(String(10))

    units: Mapped[list["Unit"]] = relationship(
        back_populates="course", cascade="all, delete-orphan", order_by="Unit.order_index"
    )


class Unit(Base):
    __tablename__ = "units"

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"))
    title: Mapped[str] = mapped_column(String(100))
    order_index: Mapped[int] = mapped_column(Integer)

    course: Mapped["Course"] = relationship(back_populates="units")
    skills: Mapped[list["Skill"]] = relationship(
        back_populates="unit", cascade="all, delete-orphan", order_by="Skill.order_index"
    )


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(primary_key=True)
    unit_id: Mapped[int] = mapped_column(ForeignKey("units.id"))
    title: Mapped[str] = mapped_column(String(100))
    order_index: Mapped[int] = mapped_column(Integer)
    icon: Mapped[str] = mapped_column(String(20), default="star")
    total_levels: Mapped[int] = mapped_column(Integer, default=1)

    unit: Mapped["Unit"] = relationship(back_populates="skills")
    lessons: Mapped[list["Lesson"]] = relationship(
        back_populates="skill", cascade="all, delete-orphan", order_by="Lesson.order_index"
    )
    progress_entries: Mapped[list["UserSkillProgress"]] = relationship(
        back_populates="skill", cascade="all, delete-orphan"
    )


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(primary_key=True)
    skill_id: Mapped[int] = mapped_column(ForeignKey("skills.id"))
    order_index: Mapped[int] = mapped_column(Integer)

    skill: Mapped["Skill"] = relationship(back_populates="lessons")
    exercises: Mapped[list["Exercise"]] = relationship(
        back_populates="lesson", cascade="all, delete-orphan", order_by="Exercise.order_index"
    )


class Exercise(Base):
    __tablename__ = "exercises"

    id: Mapped[int] = mapped_column(primary_key=True)
    lesson_id: Mapped[int] = mapped_column(ForeignKey("lessons.id"))
    order_index: Mapped[int] = mapped_column(Integer)
    type: Mapped[ExerciseType] = mapped_column(SAEnum(ExerciseType))
    prompt: Mapped[str] = mapped_column(String(500))
    content: Mapped[dict] = mapped_column(JSON, default=dict)
    correct_answer: Mapped[dict] = mapped_column(JSON, default=dict)

    lesson: Mapped["Lesson"] = relationship(back_populates="exercises")