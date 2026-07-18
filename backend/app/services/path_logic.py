from sqlalchemy.orm import Session

from app.models import Skill, UserSkillProgress, SkillStatus, Unit


def unlock_next_skill(db: Session, user_id: int, completed_skill: Skill) -> list[int]:
    """After completing a skill, unlock the next skill in order (same unit,
    or first skill of the next unit). Returns list of newly-unlocked skill ids.
    """
    unlocked_ids: list[int] = []

    # Next skill within the same unit
    next_skill = (
        db.query(Skill)
        .filter(Skill.unit_id == completed_skill.unit_id, Skill.order_index > completed_skill.order_index)
        .order_by(Skill.order_index.asc())
        .first()
    )

    # If none, try first skill of the next unit
    if next_skill is None:
        current_unit = db.query(Unit).filter(Unit.id == completed_skill.unit_id).first()
        next_unit = (
            db.query(Unit)
            .filter(Unit.course_id == current_unit.course_id, Unit.order_index > current_unit.order_index)
            .order_by(Unit.order_index.asc())
            .first()
        )
        if next_unit:
            next_skill = (
                db.query(Skill)
                .filter(Skill.unit_id == next_unit.id)
                .order_by(Skill.order_index.asc())
                .first()
            )

    if next_skill is None:
        return unlocked_ids

    progress = (
        db.query(UserSkillProgress)
        .filter(UserSkillProgress.user_id == user_id, UserSkillProgress.skill_id == next_skill.id)
        .first()
    )
    if progress is None:
        progress = UserSkillProgress(user_id=user_id, skill_id=next_skill.id, status=SkillStatus.available)
        db.add(progress)
        unlocked_ids.append(next_skill.id)
    elif progress.status == SkillStatus.locked:
        progress.status = SkillStatus.available
        unlocked_ids.append(next_skill.id)

    return unlocked_ids