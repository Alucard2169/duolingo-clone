from datetime import datetime, timedelta

from app.config import settings
from app.models import User


def regenerate_hearts(user: User) -> None:
    """Mutates user.hearts/next_heart_at in place based on elapsed time.
    Caller is responsible for committing.
    """
    if user.hearts >= user.max_hearts:
        user.next_heart_at = None
        return

    now = datetime.utcnow()
    if user.next_heart_at is None:
        user.next_heart_at = now + timedelta(minutes=settings.HEART_REGEN_MINUTES)
        return

    while user.next_heart_at is not None and now >= user.next_heart_at and user.hearts < user.max_hearts:
        user.hearts += 1
        if user.hearts < user.max_hearts:
            user.next_heart_at += timedelta(minutes=settings.HEART_REGEN_MINUTES)
        else:
            user.next_heart_at = None


def lose_heart(user: User) -> None:
    if user.hearts > 0:
        user.hearts -= 1
        if user.next_heart_at is None:
            from datetime import timedelta as td
            user.next_heart_at = datetime.utcnow() + td(minutes=30)