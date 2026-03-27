## Git Workflow

Do NOT push commits. Only commit locally.

## Tech Stack

- **Framework**: React 18 + TypeScript, built with Vite
- **Styling**: Tailwind CSS
- **Storage**: Dexie.js (IndexedDB wrapper) — local-only, offline-first
- **Unit/Integration tests**: Vitest (headless, no browser)
- **E2E tests**: Playwright (headless Chromium)
- **Target platform**: iPhone PWA via Safari "Add to Home Screen"

Never suggest: Expo, React Native, Jest, Create React App, any backend or cloud sync.

## Architecture: Domain-Driven Design

Four layers under `src/`:

```
domain/         ← pure TypeScript only, zero framework or library imports
application/    ← use cases and orchestration, pure TypeScript
infrastructure/ ← Dexie.js repositories, Service Worker, external adapters
presentation/   ← React components and hooks
```

**Import rules** (enforced by convention):
- `domain/` imports nothing from other layers
- `application/` may import from `domain/` only
- `infrastructure/` implements interfaces defined in `domain/`
- `presentation/` calls `application/` only — never imports from `domain/` or `infrastructure/` directly

Bounded contexts: `exercises/`, `sessions/`, `planning/` (each as subfolders in `domain/` and `application/`).

## Change Strategy

One OpenSpec change = one Epic (one bounded context or phase).
Do not mix bounded contexts in a single change.
Current changes in order: `app-foundation` → `exercise-library` → `training-plans` → `session-tracking` → `analytics`.
