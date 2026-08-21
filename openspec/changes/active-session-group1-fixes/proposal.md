## Why

Group 1 of the roadmap (`openspec/memory/project_roadmap.md`) collects five small but frequent friction points in the active-session and stats flows: a missing visual cue, a missing shortcut, a swipe-gesture bug, a bad seed tag, and an unreadable chart axis. None require new architecture; all are surgical fixes within existing components.

## What Changes

- Collapse arrow on an exercise entry turns green once at least one set is logged — same signal the Done button already uses (`setCount > 0`).
- After picking an exercise for a muscle group slot, offer a direct link to that exercise's history/stats/progression view.
- Fix swipe-to-delete: deleting an entry no longer leaves the next entry (which shifts into the deleted row's position) visually pre-swiped.
- Fix seed data: "Torso Rotation" is tagged `mg-bauch-seite` (side abs) but keeps surfacing as a suggestion for general Bauch — align its `muscleGroupIds` with intent (or fix whatever caused the cross-suggestion) and audit `sessions-seed.json` for consistency per CLAUDE.md rule.
- Progression/Stats chart: y-axis currently renders only min and max labels; add intermediate tick values (and optional gridlines) so users can read approximate values without eyeballing between two extremes.

## Capabilities

### Modified Capabilities
- `active-session-ux`: collapse arrow reflects set-presence state; swipe-to-delete no longer leaks state into the next row
- `exercise-selection`: variation picker gains a "view history/stats" shortcut per exercise
- `seed-data`: Torso Rotation muscle group tagging corrected, sessions-seed audited for consistency
- `progression-analytics`: chart y-axis shows intermediate tick values

## Impact

- `src/presentation/sessions/EntryRowHeader.tsx` — collapse arrow styling
- `src/presentation/sessions/VariationPicker.tsx`, `EntryRow.tsx` — new stats-shortcut affordance, prop threading to navigation
- `src/presentation/sessions/useSwipeToDelete.ts`, `EntryRow.tsx` (or list keying) — swipe state reset/keying fix
- `openspec/seed/exercise-library.json`, `openspec/seed/sessions-seed.json` — Torso Rotation tagging + consistency audit
- `src/presentation/analytics/ProgressionChart.tsx` — y-axis tick computation and rendering
