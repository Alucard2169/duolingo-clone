from datetime import date, timedelta

from app.models import User


def update_streak_on_activity(user: User) -> None:
    """Call this once per completed lesson. Idempotent per day."""
    today = date.today()

    if user.last_activity_date == today:
        return  # already counted today
    elif user.last_activity_date == today - timedelta(days=1):
        user.streak_count += 1
    else:
        user.streak_count = 1  # streak broken or first ever activity

    user.last_activity_date = today