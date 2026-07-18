from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./duolingo.db"
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    DEFAULT_USER_ID: int = 1  # simplified auth: always act as this seeded learner

    MAX_HEARTS: int = 5
    HEART_REGEN_MINUTES: int = 30
    DAILY_XP_GOAL_DEFAULT: int = 20

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()