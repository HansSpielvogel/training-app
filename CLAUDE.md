## App Concept

Personal iPhone PWA for strength training. Hans uses it actively during workouts — one hand at the machine.

Core value: "What weight did I use last time, and what should I use today?"

**Why:** Track weights per exercise/set, view history across past sessions, enable informed weight selection for the next session. Supports exercise variation rotation (e.g., 3 triceps exercises cycling through sessions).

**How to apply:** All feature decisions should serve the in-gym, during-training use case. The app is used with one hand at the machine. Keep UI fast and low-friction.

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

**Bounded contexts** (each as subfolders in `domain/` and `application/`):

- **`sessions/`** — Core domain. `TrainingSession`, `SessionEntry`, `SessionSet`. This is the heart of the app: what was done, with what weight, how many reps.
- **`exercises/`** — Supporting. `ExerciseDefinition`, `MuscleGroup`. The catalogue of exercises; exists to serve session logging and plan building.
- **`planning/`** — Supporting. `TrainingPlan`, `PlanSlot`. Defines the template for a session; references MuscleGroups, not specific exercises (variation is chosen at training time).

**Key domain rules:**
- `PlanSlot` references a `MuscleGroup`, never an `ExerciseDefinition` — the exercise is picked per session
- `SessionEntry` records which `ExerciseDefinition` was actually used, plus the sets logged
- Weight is a value object: `single` (fixed), `bilateral` (per side, e.g. cables/barbell), `stacked` (machine stack + added plates), future: `asymmetric` (left/right differ)
- `defaultSets` on `ExerciseDefinition` drives quick-sets mode in the session UI (default: 3)

## Multi-Sport Extensibility

Do NOT make the Exercise model generic. Extensibility comes from bounded context architecture.
When building session-tracking or analytics, define `SessionSummary` as a shared interface. Strength training entities implement it. Do not add `sportType` enums or generic fields to `ExerciseDefinition`. Adding a new sport = new bounded context, no rewrite of the strength domain.

## Project Context (Memory)

- `openspec/memory/project_roadmap.md` — phase breakdown, future improvements, seeding plan
- `openspec/memory/project_training-flow.md` — session UX flow, variation picking, set logging

## Implementation Workflow

Work in small steps: implement one thing, write tests for it, run them — then move on. Break tasks into the smallest meaningful units. Write tests right after each unit, before moving to the next.

**IMPORTANT: You MUST run `/after-impl` when implementation tasks are done.** Do NOT consider the work complete until you have run it. It handles tests, UI verification, ui-review, CLAUDE.md update, commit and push.

