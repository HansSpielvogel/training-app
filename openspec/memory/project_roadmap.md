---
name: Roadmap and Phase Decisions
description: Prioritised feature phases and what belongs in each OpenSpec change
type: project
---

## Change Sequence

`app-foundation` ✓ → `exercise-library` ✓ → `training-plans` → `session-tracking` → `analytics`

## Phase 1 — MVP (exercise-library + training-plans + session-tracking)

Must-haves before the app is usable:
- MuscleGroup and ExerciseDefinition CRUD ✓
- Training plan creation (static, no dynamic rotation logic yet)
- Session logging: pick plan, pick variation, log sets with weight + reps
- "Last 4 variations" display per muscle group slot
- JSON export/import for backup ✓

## Phase 2

- Session history list (view past workouts)
- RPE tracking (how hard was it — 1–10)
- Asymmetric weight type (`{ kind: 'asymmetric'; left; right }`)
- Session modification during training (add/remove MuscleGroups, temp or permanent)
- App suggests variation based on rotation logic (smart rotation)

## Phase 3 — Analytics Change

- Weight progression graph per ExerciseDefinition
- Graph per MuscleGroup (aggregate view)
- Training overview: calendar/timeline of when, which plan, how many exercises

## Future (not scheduled)

- AI suggestions based on history
- Other sports (see extensibility memory)
- Asymmetric weight display improvements

## Seeding

Hans has existing training plans in a text file. Now that `exercise-library` is done, he will provide the file and we will pre-fill the database with his current exercises and plans via a seed JSON import before starting `training-plans`.
