from datetime import date, datetime
from pydantic import BaseModel


class UserOut(BaseModel):
    id: int
    username: str
    current_xp: int
    streak_count: int
    last_activity_date: date | None
    hearts: int
    max_hearts: int
    next_heart_at: datetime | None
    gems: int
    daily_xp_goal: int

    class Config:
        from_attributes = True


class LeaderboardEntry(BaseModel):
    username: str
    current_xp: int

    class Config:
        from_attributes = True