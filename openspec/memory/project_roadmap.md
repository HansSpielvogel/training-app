---
name: Roadmap and Phase Decisions
description: Backlog of remaining features — what's not yet built
type: project
---

## Next Up

**`session-enhancements`** (sessions/ bounded context — new session features)
- p2: RPE tracking: 1–10 effort rating per session. Should be shown in the stats-Progression view
- p2: Temp session modification: add/remove muscle groups during active session only (not saved to plan)
- p3: Temp session modification: add a complete training plan to the active session on the fly (e.g. add "mini-core" to an active "Oberkörper" session)
- p3: Display hints: alternating rest time (from exercise-variants, depends on that change)

**`exercise-variants`** (exercises/ bounded context)
- p3: Asymmetric weight type (`{ kind: 'asymmetric'; left; right }`)
- p3: Alternating exercise variant: flag + rest time override on ExerciseDefinition; shown as hint in active session (e.g. 4 sets alternating left/right, 36s rest)

**`stats-enhancements`** (presentation/ — read-only views, no domain changes)
- p3: In the Exercises view, show last used weight and reps for every exercise (if available)
- p3: In stats/Progression: add a list view showing all logged weight, reps, and date
- p3: In stats/Progression: incorporate reps into the graph — reps increase before weight increases, then reset; both dimensions should be visible
- p3: In stats/calendar: Add a click on the past session to expand a list of exercises done 

## Future (not scheduled)

- AI suggestions based on history
- Other sports (new bounded context, see extensibility rule in CLAUDE.md)

## Seeding

Both seed files auto-run on first boot (empty-table guard, idempotent):
- `openspec/seed/exercise-library.json` — muscle groups, exercises
- `openspec/seed/training-plans.json` — Hans's default plans with ordered muscle group slots
- `openspec/seed/sessions-seed.json` — Hans's initial weights used as past training plans
