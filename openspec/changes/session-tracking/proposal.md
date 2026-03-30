## Why

The app's core value is "what weight did I use last time, and what should I use today?" — but without session tracking, no workout data exists. This change makes the app usable as a training tool for the first time.

## What Changes

- Introduce the `sessions` bounded context: `TrainingSession` aggregate, `SessionEntry`, and `Set` entities
- Add repository interface and Dexie implementation for sessions
- Add use cases: start session from plan, add/update entries and sets, complete session, query last used variations per muscle group
- Add session UI: plan selection screen, active session view with per-slot variation picker, set logger, and session completion

## Capabilities

### New Capabilities

- `active-session`: Full in-gym session flow — start from plan, pick exercise variation per slot (showing last 4 used), log sets with weight and reps, complete the session

### Modified Capabilities

_(none — no existing spec requirements change)_

## Impact

- New: `src/domain/sessions/` — domain entities and repository interface
- New: `src/application/sessions/` — use cases
- New: `src/infrastructure/sessions/` — Dexie repository
- New: `src/presentation/sessions/` — React components and hooks
- Reads from: `domain/exercises` (ExerciseDefinition), `domain/planning` (TrainingPlan, PlanSlot), `domain/shared` (Weight)
- No changes to existing layers
