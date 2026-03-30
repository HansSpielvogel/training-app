---
name: Roadmap and Phase Decisions
description: Prioritised feature phases and what belongs in each OpenSpec change
type: project
---

## Change Sequence

`app-foundation` ✓ → `exercise-library` ✓ → `training-plans` ✓ → `session-tracking` ✓ → `analytics` ✓ → `exercise-variants` → `plan-enhancements` → `session-enhancements`

## Phase 1 — MVP ✓

- MuscleGroup and ExerciseDefinition CRUD ✓
- Training plan creation ✓
- Session logging: pick plan, pick variation, log sets with weight + reps ✓
- "Last 4 variations" display per muscle group slot ✓
- JSON export/import for backup ✓

## Phase 2 — 3 grouped changes

**Change: `exercise-variants`** (exercises/ bounded context)
- Asymmetric weight type (`{ kind: 'asymmetric'; left; right }`)
- Alternating exercise variant: flag + rest time override on ExerciseDefinition; shown as hint in active session (e.g. 4 sets alternating left/right, 36s rest)
- Quick-sets default N on ExerciseDefinition (default 3); used by session-enhancements

**Change: `plan-enhancements`** (planning/ bounded context)
- Optional plan slots: "Evtl" flag on PlanSlot; shown as hint in active session; not doing an exercise = simply not logging sets for it
- Smart rotation suggestion: look at last 5 sessions, suggest variation used least that is not the most recent; no suggestion if all equally used or only 1 exercise in the muscle group

**Change: `session-enhancements`** (sessions/ bounded context — depends on exercise-variants + plan-enhancements)
- RPE tracking: 1–10 effort rating per session
- Quick-sets mode per slot: enter weight+reps once → logs N identical sets; toggle to single-set mode per slot when sets differ
- Temp session modification: add/remove muscle groups during active session only (not saved to plan)
- Display hints: alternating rest time (from exercise-variants), Evtl label (from plan-enhancements)

Note: abandon active session is already implemented.

## Phase 3 — Analytics ✓

- Weight progression graph per ExerciseDefinition ✓
- Graph per MuscleGroup (aggregate view) ✓
- Training overview: calendar/timeline of when, which plan, how many exercises ✓

## Phase 4 more user input

- Add a save and discard button when editing a training plan, delete the return arrow
- button to finish an exercise, after entering the sets one can finish this exercise and the exercise is marked finished in the active session

## Future (not scheduled)

- AI suggestions based on history
- Other sports (see extensibility memory)
- Asymmetric weight display improvements

## Seeding

Both seed files auto-run on first boot (empty-table guard, idempotent):
- `openspec/seed/exercise-library.json` — 16 muscle groups, 53 exercises
- `openspec/seed/training-plans.json` — Hans's 5 plans with ordered muscle group slots
