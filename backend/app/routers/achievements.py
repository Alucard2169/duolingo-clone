from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Achievement, UserAchievement, User
from app.routers.users import get_current_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/api/achievements", tags=["achievements"])


class AchievementOut(BaseModel):
    title: str
    description: str
    icon: str
    earned: bool
    earned_at: datetime | None = None

    class Config:
        from_attributes = True


@router.get("", response_model=list[AchievementOut])
def list_achievements(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    all_achievements = db.query(Achievement).all()
    earned_map = {
        ua.achievement_id: ua.earned_at
        for ua in db.query(UserAchievement).filter(UserAchievement.user_id == user.id).all()
    }
    return [
        AchievementOut(
            title=a.title, description=a.description, icon=a.icon,
            earned=a.id in earned_map, earned_at=earned_map.get(a.id),
        )
        for a in all_achievements
    ]
