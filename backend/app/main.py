from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine, SessionLocal
from app import models 

from app.routers import users, path, lessons, achievements

app = FastAPI(title="Duolingo Clone API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        user_count = db.query(models.User).count()
        if user_count == 0:
            from app.seed import seed
            seed()
    finally:
        db.close()


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


app.include_router(users.router)
app.include_router(path.router)
app.include_router(lessons.router)
app.include_router(achievements.router)
