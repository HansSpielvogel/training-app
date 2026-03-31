---
name: Roadmap and Phase Decisions
description: Backlog of remaining features — what's not yet built
type: project
---

## Next Up

**`session-enhancements-2`** (sessions/ bounded context — new session features)
- p3: RPE tracking:  instead or additionally of the (opt.) hint put a (1-10) hint, so i know what is the range (not self-explanatory)
- p2: Temp session modification: remove muscle groups during active session only (not saved to plan) (i do not see a possibility at the moment)
- p2: the extra "added" weight which can be stored in a session entry is not able to input in an active session. I cannot enter 12+2.5. at best keep the number input, so maybe a own field next to weight, optional to be filled out?

**`exercise-variants`** (exercises/ bounded context)
- p3: Asymmetric weight type (`{ kind: 'asymmetric'; left; right }`)
- p3: Alternating exercise variant: flag + rest time override on ExerciseDefinition; shown as hint in active session (e.g. 4 sets alternating left/right, 36s rest)
- p3: Display hints: alternating rest time
- p3: if the last tracked sets of an exercise all have the same weight and Reps, show a consolidated view in the "Last:" info in active session, something like Last: 24x10 *3

**`stats-enhancements`** (presentation/ — read-only views, no domain changes)
- p3: In the Exercises view, show last used weight and reps for every exercise (if available)
- p3: In stats/Progression: add a list view showing all logged weight, reps, and date
- p3: In stats/Progression: incorporate reps into the graph — reps increase before weight increases, then reset; both dimensions should be visible
- p3: In stats/calendar: Add a click on the past session to expand a list of exercises done 

## Future (not scheduled)

- add a drag gesture for deleting the training plan slots in the active session, with a red trash indicator appearing while dragging as a feedback
- AI suggestions based on history
- Other sports (new bounded context, see extensibility rule in CLAUDE.md)

## Seeding

Both seed files auto-run on first boot (empty-table guard, idempotent):
- `openspec/seed/exercise-library.json` — muscle groups, exercises
- `openspec/seed/training-plans.json` — Hans's default plans with ordered muscle group slots
- `openspec/seed/sessions-seed.json` — Hans's initial weights used as past training plans
