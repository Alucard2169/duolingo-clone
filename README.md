# Duolingo Web App Clone

A functional clone of Duolingo's core learning loop and gamification mechanics — skill tree navigation, a multi-exercise-type lesson player, hearts, XP, streaks, achievements, and dark mode.

**Live app:** _https://owlclone.netlify.app/
**Backend API:** _ https://duolingo-clone-gsjn.onrender.com
**Repo:** _ https://github.com/Alucard2169/duolingo-clone.git

## Tech Stack

- **Frontend:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4
- **Backend:** FastAPI (Python), SQLAlchemy ORM
- **Database:** SQLite
- **Deployment:** Netlify (frontend), Render (backend)

## Setup Instructions (local development)

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate       
pip install -r requirements.txt

uvicorn app.main:app --reload
```

The database auto-seeds on first boot if empty (see "Auto-seeding" below), so no manual seed step is required. Backend runs at `http://localhost:8000`. Interactive API docs at `http://localhost:8000/docs`.

To force a full reset of demo data locally:
```bash
rm -f duolingo.db
python -m app.seed
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
npm run dev
```

Frontend runs at `http://localhost:3000` and redirects to `/path`.

## Architecture Overview

```
duolingo-clone/
├── backend/
│   └── app/
│       ├── main.py          # FastAPI app init, CORS, router registration, auto-seed on startup
│       ├── config.py        # Settings (DB URL, CORS origins, gamification constants)
│       ├── database.py      # SQLAlchemy engine/session, FK pragma
│       ├── seed.py          # Demo data seeding (idempotent, callable standalone or on boot)
│       ├── models/          # SQLAlchemy ORM models (one file per domain)
│       ├── schemas/         # Pydantic request/response schemas
│       ├── services/        # Business logic (hearts, streaks, unlock logic, achievements)
│       └── routers/         # API route handlers
└── frontend/
    ├── netlify.toml          # Explicit Next.js Runtime plugin config for Netlify
    └── src/
        ├── app/
        │   ├── layout.tsx             # Root layout: font, ThemeProvider
        │   ├── page.tsx               # Root redirect to /path
        │   └── (app)/                 # Route group sharing TopBar/nav/UserProvider
        │       ├── layout.tsx
        │       ├── path/              # Skill tree page
        │       ├── lesson/[id]/       # Lesson player page
        │       ├── leaderboard/
        │       ├── profile/
        │       └── settings/          # Includes dark mode toggle
        ├── components/                # UI components (TopBar, SkillNode, exercises/, modals)
        └── lib/
            ├── api.ts                 # Typed API client
            ├── user-context.tsx       # Client-side live user state (hearts/XP update in real time)
            ├── theme-context.tsx      # Dark mode state, persisted to localStorage
            └── nav-tabs.ts            # Shared nav tab config (SideNav + BottomNav)
```

**Design principles:**

- **Business logic lives in `services/`, not routers.** Hearts regeneration, streak calculation, skill-unlock progression, and achievement checks are isolated, testable functions that routers call — keeping route handlers thin.
- **Simplified auth.** No real authentication, per the assignment's allowance. `get_current_user` always returns a single seeded learner (`DEFAULT_USER_ID`).
- **Exercise content is polymorphic via JSON columns**, not five separate tables. Each `Exercise` row has a `type` enum plus `content`/`correct_answer` JSON blobs whose shape depends on the type.
- **Lock/unlock state lives server-side** in `UserSkillProgress`, mutated only by `services/path_logic.py` on lesson completion — the client can never unlock a skill by manipulating requests.
- **Hearts regenerate lazily** — computed on read against `next_heart_at`, no background job needed.
- **Live client-side state via React Context.** `UserProvider` holds the current user object app-wide; hearts update instantly on a wrong answer (optimistic local update), while XP/streak/gems refresh from the server once a lesson completes. This avoids needing a full page reload to see gamification state change — a `TopBar` visible everywhere in the app reflects it immediately.
- **Dark mode is a manual toggle**, not OS-preference-based, using Tailwind v4's `@custom-variant dark` with a `.dark` class on `<html>`, persisted to `localStorage`.

## Database Schema

```
courses 1──* units 1──* skills 1──* lessons 1──* exercises

users 1──* user_skill_progress *──1 skills
users 1──* user_lesson_attempts *──1 lessons
user_lesson_attempts 1──* user_exercise_attempts *──1 exercises
users 1──* user_achievements *──1 achievements
```

| Table | Purpose |
|---|---|
| `users` | Learner profile: XP, streak, hearts, gems, daily goal/progress |
| `courses` / `units` / `skills` / `lessons` / `exercises` | Course content hierarchy, seeded |
| `user_skill_progress` | Per-skill lock/unlock/completed state + crown level, one row per (user, skill) |
| `user_lesson_attempts` | One row per lesson attempt; tracks XP earned, hearts lost, completion |
| `user_exercise_attempts` | One row per exercise answer within an attempt |
| `achievements` / `user_achievements` | Achievement definitions and which ones a user has earned |

**Why a separate `user_lesson_attempts` table** instead of just updating `user_skill_progress` directly? It preserves history (every attempt, not just latest state), which powers the "first lesson ever" achievement check and could support a future mistakes-review feature.

**Why JSON columns for exercise `content`/`correct_answer`** instead of a table per exercise type? The five exercise types have meaningfully different shapes; normalizing each into its own table would mean five join tables for what's fundamentally the same lifecycle. The tradeoff: the DB can't enforce `content`'s internal shape — validated at the application layer instead.

## API Overview

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/users/me` | Current learner profile (also triggers lazy heart regen) |
| GET | `/api/users/leaderboard` | Top learners by XP |
| GET | `/api/path` | Full course tree with per-skill lock/unlock status |
| GET | `/api/achievements` | All achievements + earned status for current user |
| POST | `/api/lessons/{lesson_id}/start` | Begins a lesson attempt, returns exercises (answers excluded). Returns 400 if out of hearts. |
| POST | `/api/lessons/answer` | Submits an answer for one exercise; returns correctness + hearts remaining |
| POST | `/api/lessons/{attempt_id}/complete` | Finalizes attempt: awards XP, updates streak, unlocks next skill, checks achievements |

Full interactive documentation at `/docs` once the backend is running.

## Deployment

- **Backend (Render):** Web service, root directory `backend`, build command `pip install -r requirements.txt`, start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- **Frontend (Netlify):** Base directory `frontend`, build command `npm run build`, publish directory `.next`, with `@netlify/plugin-nextjs` explicitly configured via `frontend/netlify.toml` to enable server-side rendering (required since all pages fetch live user data and use `export const dynamic = "force-dynamic"`).
- **Environment variables:** `NEXT_PUBLIC_API_URL` on Netlify points to the deployed Render backend URL; `CORS_ORIGINS` in `backend/app/config.py` includes the deployed Netlify URL.

### Auto-seeding

Render's free tier has no shell access, so rather than requiring a manual seed step post-deploy, `app/main.py`'s startup handler checks if the `users` table is empty and calls the seed function automatically on first boot. This means a fresh deploy is immediately usable without any manual database setup step.

## Assumptions & Simplifications

- **Authentication is mocked.** A single default learner (`demo_learner`) is seeded and used for all requests, per the assignment's allowance.
- **One seeded language course** (Spanish) with 2 units, 4 skills, and a small set of exercises across all 5 exercise types — plus 4 additional seeded users so the leaderboard reflects a real ranking rather than a single entry.
- **Daily XP tracking** resets by comparing `last_activity_date` to today rather than using a scheduled job.
- **Hearts regeneration** is computed on read rather than via a background worker.
- **Font substitution:** Duolingo's actual typeface (DIN Round Pro / Feixen) isn't publicly available; Nunito (Google Fonts) is used as the closest open equivalent, matched to their color palette and chunky button/border styling.
- **Mascot/branding:** no attempt was made to reproduce Duolingo's actual owl mascot illustration or trademarked logo — the visual system (colors, button physicality, layout, skill-tree shape) is replicated, not the specific copyrighted character art.
- **Gems, Super Duolingo, friends/social features, and multiple languages** are placeholders/mocked, per the assignment's explicit allowance.
- **Match-pairs answer checking** compares submitted pairs as a set, so matching order doesn't matter.

## Bonus Features Implemented

- **Dark mode** — manual toggle in Settings, persisted across sessions, full coverage across all pages and components.
- **Responsive design** — tested on mobile, tablet, and desktop viewports.
- **Live state updates** — hearts/XP/streak reflect instantly across the app via React Context, without requiring a page refresh.

## Known Limitations / Possible Extensions

- No timed "legendary" challenge mode.
- No audio (text-to-speech or seeded).
- No automated test suite — given the ~24 hour scope, testing was manual (backend via `/docs`, frontend via the UI across desktop/mobile).
- Refreshing mid-lesson starts a new attempt (client-side lesson state isn't persisted server-side beyond individual answer submissions).
