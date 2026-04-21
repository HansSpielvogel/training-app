---
name: Roadmap and Phase Decisions
description: Backlog of remaining features — what's not yet built
type: project
---

## Next Up

### Group C: Polish & Insights (Priority 2)
**Goal:** Better discoverability and progress metrics

- **Segmented control for mode toggle**: Active session quick-sets vs individual mode toggle has low discoverability; replace with a segmented control
- **Moved sum metric**: In stats-progression, add option to see "moved sum" (weight × reps × numOfSets) for easier progress tracking. Make available for both chart and list views. Example: 10kg × 10 × 3 = 300kg moved; 12kg × 9 × 3 = 324kg moved shows progress even when reps decreased.
- **Analytics domain refactor**: `TrainingCalendarView` receives full `TrainingSession` via `getSessionDetail`, creating hard cross-context dependency from `analytics` → `sessions`. Define `SessionDetailView` (or `SessionCardViewModel`) type in `analytics` domain; have `useAnalytics` project `TrainingSession` into it before passing to components.

### Group B: Flexibility (Priority 3)
**Goal:** Adapt the session on-the-fly

- **Preset button (pre-fill from last)**: Add compact button `[⟲ Last: 60kg × 10 × 3]` inside exercise (when form fields visible) that pre-fills fields with values from last time this exercise was done. Quick-sets mode: fills shared weight/reps/RPE. Individual mode: fills first set's fields from first set of last session. Only shows if previous data exists. Fills all fields with available data (e.g., no RPE last time → leaves RPE blank).
- **Reorder entries (long-press drag)**: In active session, allow reordering training entries via long-press + drag up/down gesture. Only affects today's session instance, not the plan template. UX should match plan-edit mode reordering.
- **Delete slots (swipe gesture)**: In active session, allow deleting plan slots for today via swipe left/right gesture with red trash indicator. Session-time decision (e.g., "today more back, less legs").

### Group D: exercise-variants (Priority 4)
- p3: Asymmetric weight type (`{ kind: 'asymmetric'; left; right }`)
- p3: Alternating exercise variant: flag + rest time override on ExerciseDefinition; shown as hint in active session (e.g. 4 sets alternating left/right, 36s rest)
- p3: Display hints: alternating rest time

## Future (not scheduled)

- Progression view: no way to compare two exercises side-by-side or overlay historical data across muscle groups; a "compare" mode would help informed weight selection
- Active session: no progress indicator (e.g. "3 of 6 slots done") — a compact bar under the session title would reduce anxiety about how far through a workout Hans is
- Progression tab: exercise list is a flat alphabetical scroll with no muscle-group filter or search — as the library grows this becomes slow to navigate at the gym; add muscle-group grouping or a search input
- p3: Stats / Calendar tab: add additionally to the session list a real calendar heat-map for training frequency at a glance
- p3: Progression chart: show mini sparkline on the exercise list row so trend is visible without drilling in
- Future: AI suggestions based on history
- Future: Other sports (new bounded context, see extensibility rule in CLAUDE.md)

## Seeding

Both seed files auto-run on first boot (empty-table guard, idempotent):
- `openspec/seed/exercise-library.json` — muscle groups, exercises
- `openspec/seed/training-plans.json` — Hans's default plans with ordered muscle group slots
- `openspec/seed/sessions-seed.json` — Hans's initial weights used as past training plans
