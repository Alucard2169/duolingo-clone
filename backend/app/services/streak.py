from datetime import date, timedelta

from app.models import User


def update_streak_on_activity(user: User, xp_earned: int) -> None:
    today = date.today()

    if user.last_activity_date == today:
        user.daily_xp_earned += xp_earned
        return
    elif user.last_activity_date == today - timedelta(days=1):
        user.streak_count += 1
    else:
        user.streak_count = 1

    user.last_activity_date = today
    user.daily_xp_earned = xp_earned