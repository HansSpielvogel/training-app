---
name: Roadmap and Phase Decisions
description: Backlog of remaining features — what's not yet built
type: project
---

## Next Up

### Group C — exercise-variants
- p3: Asymmetric weight type (`{ kind: 'asymmetric'; left; right }`)
- p3: Alternating exercise variant: flag + rest time override on ExerciseDefinition; shown as hint in active session (e.g. 4 sets alternating left/right, 36s rest)
- p3: Display hints: alternating rest time

## Future (not scheduled)

- Analytics bounded context: `TrainingCalendarView` receives a full `TrainingSession` object via `getSessionDetail`, creating a hard cross-context dependency from `analytics` back into `sessions`. As analytics grows (more views that need session detail), this will widen. Define a `SessionDetailView` (or `SessionCardViewModel`) type in the `analytics` domain and have `useAnalytics` project the `TrainingSession` into it before passing it to components.

- Active session: temp slot with logged sets cannot be removed (use case throws on `entry.sets.length > 0`); add a confirmation-then-delete flow for this case
- Stats / Calendar tab: replace session list with a real calendar heat-map for training frequency at a glance
- Progression chart: show mini sparkline on the exercise list row so trend is visible without drilling in
- Active session: quick-sets vs individual mode toggle has low discoverability; replace with a segmented control
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
