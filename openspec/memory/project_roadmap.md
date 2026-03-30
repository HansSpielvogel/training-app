---
name: Roadmap and Phase Decisions
description: Prioritised feature phases and what belongs in each OpenSpec change
type: project
---

## Change Sequence

`app-foundation` ✓ → `exercise-library` ✓ → `training-plans` ✓ → `session-tracking` → `analytics`

## Phase 1 — MVP (exercise-library + training-plans + session-tracking)

Must-haves before the app is usable:
- MuscleGroup and ExerciseDefinition CRUD ✓
- Training plan creation (static, no dynamic rotation logic yet) ✓
- Session logging: pick plan, pick variation, log sets with weight + reps
- "Last 4 variations" display per muscle group slot
- JSON export/import for backup ✓

## Phase 2

- Session history list (view past workouts)
- RPE tracking (how hard was it — 1–10)
- Asymmetric weight type (`{ kind: 'asymmetric'; left; right }`)
- Session modification during training (add/remove MuscleGroups, temp or permanent)
- App suggests variation based on rotation logic (smart rotation)
- Optional plan slots (mark "Evtl" exercises in plan — may or may not be done)
- Alternating exercise variant: left/right alternating reps, shorter rest (e.g. Oblique Crunch 4×11 mit 36s)
- Abandon active session from `ActiveSessionScreen`: confirmation prompt with data-loss warning, returns to plan selection
- Quick-sets mode per slot: enter weight+reps once → logs N identical sets; N defined on ExerciseDefinition (exercises screen, default 3); toggle to single-set mode per slot during session when sets differ

## Phase 3 — Analytics Change

- Weight progression graph per ExerciseDefinition
- Graph per MuscleGroup (aggregate view)
- Training overview: calendar/timeline of when, which plan, how many exercises

## Future (not scheduled)

- AI suggestions based on history
- Other sports (see extensibility memory)
- Asymmetric weight display improvements

## Seeding

Both seed files auto-run on first boot (empty-table guard, idempotent):
- `openspec/seed/exercise-library.json` — 16 muscle groups, 53 exercises
- `openspec/seed/training-plans.json` — Hans's 5 plans with ordered muscle group slots
