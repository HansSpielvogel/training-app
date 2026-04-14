---
name: Roadmap and Phase Decisions
description: Backlog of remaining features — what's not yet built
type: project
---

## Next Up

### Group A — PWA / UI Polish (p1)

- p1: In home screen PWA mode, the bottom bar is partially cut off and a spurious scrollbar appears. Fix bar visibility and remove the scrollbar.
- p1: Input fields in the active session correctly suppress zoom, but other areas (e.g. exercise name editing) still zoom. Apply no-zoom behavior consistently across the full app.
- p1: In active session, deleted muscle group entries reappear after navigating away and back (e.g. to Stats). Deleted entries should remain gone on return, consistent with temp-added groups.

### Group B — Weight Display & Set Entry (p2)

- p2: In the active session "Last:" section, show `Weight` and `+add` as separate values (not summed). For Langhantel (LH) exercises, display as `LH +10 kg` — the user enters only the added weight; the 20 kg bar is implicit to the exercise.
- p2: When entering sets individually (non-quick mode), prefill each new set's fields with the values of the previous set.
- p2: "Bauch" muscle group shows "Bauch Seite" exercises in suggestions. "Bauch Seite" is its own muscle group; its exercises must not appear under "Bauch". Root cause is likely in the seed data exercise assignments.

**`exercise-variants`** (exercises/ bounded context)
- p3: Asymmetric weight type (`{ kind: 'asymmetric'; left; right }`)
- p3: Alternating exercise variant: flag + rest time override on ExerciseDefinition; shown as hint in active session (e.g. 4 sets alternating left/right, 36s rest)
- p3: Display hints: alternating rest time

## Future (not scheduled)

- add a possibility to change the RPE on a logged set (I reflect after doing the set: "that was tough i should mark the RPE as high")
- add a drag gesture for deleting the training plan slots in the active session, with a red trash indicator appearing while dragging as a feedback
- add a way to be able to change training entries order (reordering) in an active session, maybe a drag and drop gesture?
- AI suggestions based on history
- Other sports (new bounded context, see extensibility rule in CLAUDE.md)

## Seeding

Both seed files auto-run on first boot (empty-table guard, idempotent):
- `openspec/seed/exercise-library.json` — muscle groups, exercises
- `openspec/seed/training-plans.json` — Hans's default plans with ordered muscle group slots
- `openspec/seed/sessions-seed.json` — Hans's initial weights used as past training plans
