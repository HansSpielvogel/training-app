---
name: Roadmap and Phase Decisions
description: Backlog of remaining features — what's not yet built
type: project
---

## Next Up

**`exercise-variants`** (exercises/ bounded context)
- Asymmetric weight type (`{ kind: 'asymmetric'; left; right }`)
- Alternating exercise variant: flag + rest time override on ExerciseDefinition; shown as hint in active session (e.g. 4 sets alternating left/right, 36s rest)

**`session-enhancements`** (sessions/ bounded context — depends on exercise-variants)
- RPE tracking: 1–10 effort rating per session
- Temp session modification: add/remove muscle groups during active session only (not saved to plan)
- Display hints: alternating rest time (from exercise-variants)

## Phase 4

- Save and discard buttons when editing a training plan (remove the back arrow)
- Finish-exercise button in active session: mark a slot as done after logging sets

## Future (not scheduled)

- AI suggestions based on history
- Other sports (new bounded context, see extensibility rule in CLAUDE.md)
- Asymmetric weight display improvements

## Seeding

Both seed files auto-run on first boot (empty-table guard, idempotent):
- `openspec/seed/exercise-library.json` — 16 muscle groups, 53 exercises
- `openspec/seed/training-plans.json` — Hans's 5 plans with ordered muscle group slots
