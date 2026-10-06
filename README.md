# CodeVerse 2.0 — Web App

CodeVerse is an interactive programming-learning web app focused on learning by seeing code execute, inspecting state, solving challenges, and building projects.

## Included

- Dashboard with XP, streak, progress and recent activity
- Real lesson flow with completion tracking
- Monaco-powered code editor
- Python/JavaScript/HTML/CSS/C++/Java language presets
- Browser-safe JavaScript execution
- HTML/CSS live preview
- Python/C++/Java execution adapter boundary ready for a secure backend
- Visual array and binary-search labs
- Challenge system with local progress
- Project workspace with saved projects
- Debug Detective
- Career paths
- AI Teacher UI with `/api/ai` integration boundary
- Search across lessons, projects and challenges
- Dark/light theme
- LocalStorage persistence
- Responsive desktop/mobile layout

## Run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Real multi-language execution

The browser must NOT directly execute arbitrary Python/C++/Java code on your server.

For production, connect the included execution boundary to an isolated sandbox service using containers or microVMs with:

- strict CPU/memory/time limits
- read-only base filesystem
- temporary workspace
- disabled or allowlisted network
- process limits
- output limits
- per-job isolation
- automatic cleanup

The frontend calls `/api/execute` when a language needs server execution.

## AI Teacher

The frontend sends lesson/code context to `/api/ai`. Put provider credentials on the backend, not in browser code.

Expected conceptual request:

```json
{
  "message": "Explain this loop",
  "language": "python",
  "code": "for i in range(3): print(i)",
  "context": "Loops lesson"
}
```

Return:

```json
{
  "reply": "..."
}
```

## Data

Learning progress, settings, saved projects and challenge results are stored locally for this version. A production deployment can replace the storage adapter with a database/auth service without changing the learning UI architecture.

## No GitHub Actions

This package intentionally contains only the web app. There is no `.github/workflows` directory and no Android/APK code.
