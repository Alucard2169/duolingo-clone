from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import Course, Unit, UserSkillProgress, SkillStatus, User, Lesson
from app.schemas.path import CourseOut, UnitOut, SkillOut
from app.routers.users import get_current_user

router = APIRouter(prefix="/api/path", tags=["path"])


@router.get("", response_model=CourseOut)
def get_learning_path(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    course = (
        db.query(Course)
        .options(joinedload(Course.units).joinedload(Unit.skills))
        .first()
    )

    progress_by_skill = {
        p.skill_id: p
        for p in db.query(UserSkillProgress).filter(UserSkillProgress.user_id == user.id).all()
    }

    units_out = []
    for unit in course.units:
        skills_out = []
        for skill in unit.skills:
            progress = progress_by_skill.get(skill.id)
            status = progress.status.value if progress else SkillStatus.locked.value
            crowns = progress.crowns if progress else 0

            first_lesson = (
                db.query(Lesson)
                .filter(Lesson.skill_id == skill.id)
                .order_by(Lesson.order_index.asc())
                .first()
            )

            skills_out.append(
                SkillOut(
                    id=skill.id, title=skill.title, order_index=skill.order_index,
                    icon=skill.icon, total_levels=skill.total_levels,
                    status=status, crowns=crowns,
                    first_lesson_id=first_lesson.id if first_lesson else None,
                )
            )
        units_out.append(
            UnitOut(id=unit.id, title=unit.title, order_index=unit.order_index, skills=skills_out)
        )

    return CourseOut(id=course.id, name=course.name, language_code=course.language_code, units=units_out)




























