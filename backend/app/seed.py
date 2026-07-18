"""
Seed script: populates the database with a demo course, units, skills,
lessons, exercises, a sample learner with some progress, and achievement
definitions.

Run with:  python -m app.seed
"""

from datetime import datetime, timedelta, date

from app.database import Base, engine, SessionLocal
from app import models
from app.models import (
    User, Course, Unit, Skill, Lesson, Exercise, ExerciseType,
    UserSkillProgress, SkillStatus, Achievement,
)


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Wipe existing data for idempotent re-seeding (dev convenience only)
        for model in [
            models.UserExerciseAttempt, models.UserLessonAttempt,
            models.UserAchievement, models.UserSkillProgress,
            models.Exercise, models.Lesson, models.Skill, models.Unit,
            models.Course, models.Achievement, models.User,
        ]:
            db.query(model).delete()
        db.commit()

        # --- Demo learner ---
        user = User(
            username="demo_learner",
            current_xp=150,
            streak_count=3,
            last_activity_date=date.today() - timedelta(days=1),
            hearts=5,
            max_hearts=5,
            gems=50,
            daily_xp_goal=20,
        )
        db.add(user)
        db.commit()
        db.refresh(user)# --- Additional seeded users for a populated leaderboard ---
        other_learners = [
            User(username="maria_g", current_xp=420, streak_count=12, gems=80, hearts=5, max_hearts=5),
            User(username="carlos_r", current_xp=310, streak_count=5, gems=60, hearts=3, max_hearts=5),
            User(username="aisha_k", current_xp=275, streak_count=8, gems=45, hearts=5, max_hearts=5),
            User(username="tom_b", current_xp=90, streak_count=1, gems=15, hearts=4, max_hearts=5),
        ]
        db.add_all(other_learners)
        db.commit()

        # --- Course ---
        course = Course(name="Spanish", language_code="es")
        db.add(course)
        db.commit()
        db.refresh(course)

        # --- Unit 1: Basics ---
        unit1 = Unit(course_id=course.id, title="Basics 1", order_index=1)
        db.add(unit1)
        db.commit()
        db.refresh(unit1)

        skill1 = Skill(unit_id=unit1.id, title="Greetings", order_index=1, icon="wave")
        skill2 = Skill(unit_id=unit1.id, title="Food", order_index=2, icon="apple")
        skill3 = Skill(unit_id=unit1.id, title="Animals", order_index=3, icon="paw")
        db.add_all([skill1, skill2, skill3])
        db.commit()
        db.refresh(skill1)
        db.refresh(skill2)
        db.refresh(skill3)

        # --- Unit 2: Phrases ---
        unit2 = Unit(course_id=course.id, title="Phrases", order_index=2)
        db.add(unit2)
        db.commit()
        db.refresh(unit2)

        skill4 = Skill(unit_id=unit2.id, title="Family", order_index=1, icon="people")
        db.add(skill4)
        db.commit()
        db.refresh(skill4)

        # --- Lesson + exercises for skill1 (Greetings) ---
        lesson1 = Lesson(skill_id=skill1.id, order_index=1)
        db.add(lesson1)
        db.commit()
        db.refresh(lesson1)

        exercises_lesson1 = [
            Exercise(
                lesson_id=lesson1.id, order_index=1,
                type=ExerciseType.multiple_choice,
                prompt="Which word means 'hello'?",
                content={"options": ["Hola", "Adiós", "Gracias", "Por favor"]},
                correct_answer={"answer": "Hola"},
            ),
            Exercise(
                lesson_id=lesson1.id, order_index=2,
                type=ExerciseType.translate,
                prompt="Translate: 'Good morning'",
                content={"word_bank": ["Buenos", "días", "noches", "Buenas", "tardes"]},
                correct_answer={"answer": ["Buenos", "días"]},
            ),
            Exercise(
                lesson_id=lesson1.id, order_index=3,
                type=ExerciseType.match_pairs,
                prompt="Match the pairs",
                content={"pairs": [["Hola", "Hello"], ["Adiós", "Goodbye"], ["Gracias", "Thank you"]]},
                correct_answer={"pairs": [["Hola", "Hello"], ["Adiós", "Goodbye"], ["Gracias", "Thank you"]]},
            ),
            Exercise(
                lesson_id=lesson1.id, order_index=4,
                type=ExerciseType.fill_blank,
                prompt="Complete: 'Buenas ___' (Good night)",
                content={"sentence": "Buenas ___", "options": ["noches", "días", "tardes"]},
                correct_answer={"answer": "noches"},
            ),
            Exercise(
                lesson_id=lesson1.id, order_index=5,
                type=ExerciseType.type_answer,
                prompt="Type the Spanish word for 'thank you'",
                content={},
                correct_answer={"answer": "gracias"},
            ),
        ]
        db.add_all(exercises_lesson1)

        # --- Lesson + exercises for skill2 (Food) ---
        lesson2 = Lesson(skill_id=skill2.id, order_index=1)
        db.add(lesson2)
        db.commit()
        db.refresh(lesson2)

        exercises_lesson2 = [
            Exercise(
                lesson_id=lesson2.id, order_index=1,
                type=ExerciseType.multiple_choice,
                prompt="Which word means 'apple'?",
                content={"options": ["Manzana", "Pan", "Agua", "Leche"]},
                correct_answer={"answer": "Manzana"},
            ),
            Exercise(
                lesson_id=lesson2.id, order_index=2,
                type=ExerciseType.translate,
                prompt="Translate: 'I eat bread'",
                content={"word_bank": ["Yo", "como", "pan", "el", "agua"]},
                correct_answer={"answer": ["Yo", "como", "pan"]},
            ),
            Exercise(
                lesson_id=lesson2.id, order_index=3,
                type=ExerciseType.type_answer,
                prompt="Type the Spanish word for 'water'",
                content={},
                correct_answer={"answer": "agua"},
            ),
        ]
        db.add_all(exercises_lesson2)

        # --- Lesson for skill3 (Animals) — minimal ---
        lesson3 = Lesson(skill_id=skill3.id, order_index=1)
        db.add(lesson3)
        db.commit()
        db.refresh(lesson3)

        exercises_lesson3 = [
            Exercise(
                lesson_id=lesson3.id, order_index=1,
                type=ExerciseType.multiple_choice,
                prompt="Which word means 'cat'?",
                content={"options": ["Gato", "Perro", "Pájaro", "Pez"]},
                correct_answer={"answer": "Gato"},
            ),
            Exercise(
                lesson_id=lesson3.id, order_index=2,
                type=ExerciseType.type_answer,
                prompt="Type the Spanish word for 'dog'",
                content={},
                correct_answer={"answer": "perro"},
            ),
        ]
        db.add_all(exercises_lesson3)

        # --- Lesson for skill4 (Family) ---
        lesson4 = Lesson(skill_id=skill4.id, order_index=1)
        db.add(lesson4)
        db.commit()
        db.refresh(lesson4)

        exercises_lesson4 = [
            Exercise(
                lesson_id=lesson4.id, order_index=1,
                type=ExerciseType.multiple_choice,
                prompt="Which word means 'mother'?",
                content={"options": ["Madre", "Padre", "Hermano", "Hijo"]},
                correct_answer={"answer": "Madre"},
            ),
        ]
        db.add_all(exercises_lesson4)
        db.commit()

        # --- Seed learner progress ---
        # Skill 1 completed, skill 2 available (in progress), skill 3 + 4 locked
        progress_entries = [
            UserSkillProgress(
                user_id=user.id, skill_id=skill1.id,
                status=SkillStatus.completed, crowns=1,
                last_practiced_at=datetime.utcnow() - timedelta(days=1),
            ),
            UserSkillProgress(
                user_id=user.id, skill_id=skill2.id,
                status=SkillStatus.available, crowns=0,
            ),
            UserSkillProgress(
                user_id=user.id, skill_id=skill3.id,
                status=SkillStatus.locked, crowns=0,
            ),
            UserSkillProgress(
                user_id=user.id, skill_id=skill4.id,
                status=SkillStatus.locked, crowns=0,
            ),
        ]
        db.add_all(progress_entries)

        # --- Achievement definitions ---
        achievements = [
            Achievement(title="First Steps", description="Complete your first lesson", icon="footprints", criteria_key="first_lesson"),
            Achievement(title="On Fire", description="Reach a 3-day streak", icon="flame", criteria_key="streak_3"),
            Achievement(title="Week Warrior", description="Reach a 7-day streak", icon="calendar", criteria_key="streak_7"),
            Achievement(title="XP Rookie", description="Earn 100 XP", icon="star", criteria_key="xp_100"),
            Achievement(title="XP Champion", description="Earn 500 XP", icon="trophy", criteria_key="xp_500"),
        ]
        db.add_all(achievements)
        db.commit()

        print("Seed complete:")
        print(f"  User: {user.username} (id={user.id})")
        print(f"  Additional leaderboard users: {len(other_learners)}")
        print(f"  Course: {course.name} with 2 units, 4 skills, 4 lessons")
        print(f"  Achievements: {len(achievements)}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
