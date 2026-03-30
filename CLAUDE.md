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
  - **Exception**: hooks are the composition root and instantiate repositories directly from `infrastructure/`. This is intentional — do not refactor it away.

Bounded contexts: `exercises/`, `sessions/`, `planning/` (each as subfolders in `domain/` and `application/`).

## Change Strategy

One OpenSpec change = one Epic (one bounded context or phase).
Do not mix bounded contexts in a single change.
Current changes in order: `app-foundation` → `exercise-library` → `training-plans` → `session-tracking` → `analytics`.

## Project Context (Memory)

Versioned memory lives in `openspec/memory/`. Delete a file once its content is fully superseded by code or specs.

- `openspec/memory/project_progress.md` — current change status (keep updated)
- `openspec/memory/project_app-concept.md` — purpose, target user, UI principles
- `openspec/memory/project_domain-model.md` — entities, aggregates, Weight type, session modification
- `openspec/memory/project_training-flow.md` — session UX flow, variation picking, set logging
- `openspec/memory/project_roadmap.md` — phase breakdown, seeding plan
- `openspec/memory/project_sport-extensibility.md` — SessionSummary interface, no generic Exercise

## After implementation Workflow
* Always run all tests
* Always verify in the UI
* After significant UI changes, run `/ui-review` to capture iPhone screenshots and critique the design
* Always update this claude.md file, also with new insights
* Always commit and push

