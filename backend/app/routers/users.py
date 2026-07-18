from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.config import settings
from app.models import User
from app.schemas.user import UserOut, LeaderboardEntry
from app.services.hearts import regenerate_hearts

router = APIRouter(prefix="/api/users", tags=["users"])


def get_current_user(db: Session = Depends(get_db)) -> User:
    """Simplified auth: always returns the seeded default learner."""
    user = db.query(User).filter(User.id == settings.DEFAULT_USER_ID).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Default user not found. Did you run the seed script?")
    return user


@router.get("/me", response_model=UserOut)
def get_me(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    regenerate_hearts(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/leaderboard", response_model=list[LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db)):
    return (
        db.query(User)
        .order_by(User.current_xp.desc())
        .limit(10)
        .all()
    )
