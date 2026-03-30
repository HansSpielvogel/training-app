# Training App — Requirements & Vision

## What is this app?

A personal iPhone PWA used **during** strength training workouts. The core value is simple: "What weight did I use last time, and what should I use today?" Hans uses it actively at the machine — one hand, fast, no friction.

It tracks weights per exercise and set, shows history across past sessions, and enables informed weight selection for the next training. It also supports exercise variation rotation so that muscle groups can be trained with different exercises across sessions.

## Platform & Tech

- **Target**: iPhone, installed via Safari "Add to Home Screen" (PWA, no App Store)
- **Development**: Windows machine — no iOS simulator, no macOS
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Storage**: Dexie.js (IndexedDB) — local only, offline-first, no backend
- **Tests**: Vitest (unit/integration, headless), Playwright (E2E, headless Chromium)
- **CI**: GitHub Actions — runs all tests on every push
- **Backup**: JSON export/import — no cloud sync, no vendor lock-in

Do NOT use: Expo, React Native, Jest, Create React App, any backend, any cloud sync.

## Architecture

Domain-Driven Design with four strict layers:

```
domain/         ← pure TypeScript, zero framework or library imports
application/    ← use cases and orchestration, pure TypeScript
infrastructure/ ← Dexie.js repositories, Service Worker, adapters
presentation/   ← React components and hooks
```

Bounded contexts: `exercises/`, `sessions/`, `planning/`. Each as a subfolder in `domain/` and `application/`. Presentation calls application only — never domain or infrastructure directly.

## Domain Model

### Exercise Library

- **MuscleGroup**: the training *target*, not the exercise. Example: "Hintere Schulter / Rhomboids / Trapezius". This is what Hans wants to train; exercises are just one way to do it.
- **ExerciseDefinition**: a specific way to train a muscle. Examples: "Reverse Fly Maschine", "Reverse Fly Kabelzug", "Face Pulls". One ExerciseDefinition belongs to one or more MuscleGroups.

### Planning

- **TrainingPlan**: a named collection of muscle group slots. Hans currently has 4 plans: "Oberkörper-Fokus A", "Oberkörper-Fokus B", "Beine+Core", "Nur Core".
- **PlanSlot**: references a **MuscleGroup** (not a specific exercise). The concrete exercise (variation) is chosen at the time of the training session.

### Session Tracking (core domain)

- **TrainingSession**: one workout, started from a plan but allowed to deviate.
- **SessionEntry**: which ExerciseDefinition was used in the session, with its sets.
- **Set**: weight (typed), repetitions, optional RPE (Rate of Perceived Exertion, 1–10).

### Weight Value Object

Hans uses three notations:

| Kind | Example | Meaning |
|---|---|---|
| `single` | `80 kg` | Barbell, machine stack |
| `bilateral` | `2× 15 kg` | Cables or dumbbells, independent per side |
| `stacked` | `15 + 1.25 kg` | Machine stack with an added plate |

The `stacked` type is important: Hans notes "15+1.25" to remember how the weight was built up — avoids mental arithmetic at the machine.

Phase 2: `asymmetric` (e.g., kettlebell single-sided, independent left/right values).

## Training Session Flow

1. **Select a plan** from the list — no further configuration to start.
2. The plan shows its muscle group slots.
3. For each slot:
   - Show the **last ~4 used variations** for this muscle group (from session history).
   - The app **suggests** which variation to do (smart rotation — Phase 2 improvement).
   - Hans can **choose a different variation** from a dropdown of all ExerciseDefinitions for this muscle group.
   - Hans can **create a new ExerciseDefinition on-the-fly** (different gym, equipment taken, etc.).
4. Log sets: weight + reps per set. RPE is optional.

## Session Flexibility

- Exercises can be completed in **any order** — not bound to the plan sequence.
- **Exercises can be skipped** — for shorter training days.
- **MuscleGroups can be added or removed** during the session:
  - **Temporary** (today only — e.g., equipment unavailable, short on time)
  - **Permanent** (saves the change back to the TrainingPlan for future sessions)
  - Both options are always available at the moment of modification.

## History & Analytics

Hans wants to see what he did in past sessions. Example use case: "Reverse Fly Maschine last week: 40kg, 3×11. Before that: Reverse Fly Kabelzug 2×15kg, 3×12. Today I'll do Face Pulls at 42kg."

### Phase 2
- Session history list (past workouts, browseable)
- From any ExerciseDefinition, navigate directly to its weight progression graph

### Phase 3 (Analytics bounded context)
- Weight progression graph per ExerciseDefinition
- Aggregate graph per MuscleGroup
- Training overview: timeline of when, which plan, how many exercises completed

## Backup

JSON export and import. No server, no account, no subscription. Exporting produces a single file with all data. Importing restores from that file. This is the only backup mechanism.

## Seeding

Hans has his current training plans and exercises in an existing text file. Once the Exercise Library feature is implemented, the data will be pre-loaded via a seed JSON import — no manual re-entry.

## Future (not yet scheduled)

### AI suggestions
Use accumulated session history to suggest weights and variations for upcoming exercises.

### Other sports

Extensibility for other sports (e.g., running) is important. The strategy:

- Do **not** make ExerciseDefinition generic.
- Each sport gets its own **bounded context** with its own domain model.
- The shared abstraction is a sport-agnostic `SessionSummary` (date, sport type, metadata).
- Analytics reads from `SessionSummary` — sport-agnostic.
- Running example: `Interval { duration, targetPace }`, `RunPlan { intervals[] }`, `RunSession { segments[] }`.
- Adding running = new bounded context, no rewrite of the strength domain.

## Feature Roadmap

```
MVP (Phase 1)
  exercise-library   MuscleGroup + ExerciseDefinition CRUD
  training-plans     Plan creation, static PlanSlots
  session-tracking   Log session, pick variation, log sets, show last 4 variants
                     JSON export/import

Phase 2
  Session history list
  RPE tracking
  Asymmetric weight type
  Session modification (add/remove MuscleGroups, temp or permanent)
  Smart variation suggestion / rotation logic

Phase 3 — analytics
  Weight progression graph per exercise
  MuscleGroup aggregate graph
  Training timeline / overview

Future
  AI weight/variation suggestions
  Running bounded context
```

## Change Strategy

One OpenSpec change = one Epic = one bounded context or phase. Do not mix bounded contexts in a single change. Implement in order:

`app-foundation` → `exercise-library` → `training-plans` → `session-tracking` → `analytics`
