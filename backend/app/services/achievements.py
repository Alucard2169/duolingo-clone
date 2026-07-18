from sqlalchemy.orm import Session

from app.models import Achievement, UserAchievement, User


def check_and_award_achievements(db: Session, user: User, is_first_lesson_ever: bool) -> list[str]:
    """Checks simple criteria and awards achievements not yet earned. Returns titles awarded."""
    earned_keys = {
        ua.achievement.criteria_key
        for ua in db.query(UserAchievement).filter(UserAchievement.user_id == user.id).all()
    }

    candidates: list[str] = []
    if is_first_lesson_ever and "first_lesson" not in earned_keys:
        candidates.append("first_lesson")
    if user.streak_count >= 3 and "streak_3" not in earned_keys:
        candidates.append("streak_3")
    if user.streak_count >= 7 and "streak_7" not in earned_keys:
        candidates.append("streak_7")
    if user.current_xp >= 100 and "xp_100" not in earned_keys:
        candidates.append("xp_100")
    if user.current_xp >= 500 and "xp_500" not in earned_keys:
        candidates.append("xp_500")

    awarded_titles: list[str] = []
    for key in candidates:
        achievement = db.query(Achievement).filter(Achievement.criteria_key == key).first()
        if achievement:
            db.add(UserAchievement(user_id=user.id, achievement_id=achievement.id))
            awarded_titles.append(achievement.title)

    return awarded_titles
