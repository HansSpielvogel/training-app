---
name: Roadmap and Phase Decisions
description: Backlog of remaining features — what's not yet built
type: project
---

## Next Up

### Group D: exercise-variants
- p3: Asymmetric weight type (`{ kind: 'asymmetric'; left; right }`)
- p3: Alternating exercise variant: flag + rest time override on ExerciseDefinition; shown as hint in active session (e.g. 4 sets alternating left/right, 36s rest)
- p3: Display hints: alternating rest time

## Future (not scheduled)

- Barrel discipline in `application/sessions`: all use-case files import `ITrainingSessionRepository` via the deep path `@domain/sessions/ITrainingSessionRepository` instead of the barrel `@domain/sessions`. The same pattern exists for `@domain/sessions/TrainingSession`. These should be consolidated so the domain barrel (`index.ts`) is the single public surface — this removes ~20 direct-path imports and makes future interface restructuring easier. Acceptance: every `import … from '@domain/sessions/ITrainingSessionRepository'` and `from '@domain/sessions/TrainingSession'` inside `src/application/` and `src/infrastructure/` is replaced with `from '@domain/sessions'`.
- `ProgressionChart.tsx` (204 lines) repeats the SVG render logic three times (weight, reps, volume). Extract `<MetricLine>` sub-component or a `buildPolyline` helper and collapse the three near-identical rendering branches to reduce duplication and stay within the 200-line limit.
- Stats / Progression: after selecting a muscle group filter, show last-session weight inline on each exercise row so the user can pick an exercise in one tap instead of two. Acceptance: exercise list shows `last weight · date` on each row when a muscle group chip is active.
- Active session: segmented progress bar (one segment per slot) rather than a single fill bar, so the remaining slot count is immediately readable without doing mental subtraction. Acceptance: segment count matches entry count, each segment fills when that slot is marked done.
- Start Workout screen: show "last trained X days ago" under each plan name to help rotation awareness without memorising dates.
- E2E test flakiness: several tests (`active-session`, `flow-improvements`, `temp-slots`) intermittently time out waiting for the Weight input placeholder after clicking a VariationPicker chip — the input appears only after exercise selection completes, and the tests have no await for that transition. Fix: add an explicit `waitFor` on the Weight input before filling, or ensure the VariationPicker click resolves before proceeding.
- p2: Extract `getSessionDetail` use case: session→view-model mapping (joining entries with exercise names) currently lives in `useAnalytics` hook, leaking orchestration into the presentation layer. Extracting it to `application/analytics/getSessionDetail.ts` restores SRP and makes it independently testable. Acceptance: (1) `useAnalytics` delegates to the new use case with zero mapping logic remaining in the hook; (2) the use case has an integration test via `fake-indexeddb`; (3) `SessionDetailView` / `SessionEntryView` remain in `domain/analytics`.
- p3: Stats / Calendar tab: add additionally to the session list a real calendar heat-map for training frequency at a glance
- p3: Progression view: no way to compare two exercises side-by-side or overlay historical data across muscle groups; a "compare" mode would help informed weight selection
- p3: Progression chart: show mini sparkline on the exercise list row so trend is visible without drilling in
- Future: AI suggestions based on history
- Future: Other sports (new bounded context, see extensibility rule in CLAUDE.md)

#### priority hints

The "px:" indicates different priorities of the items, from 1 (high) to 4 (low)

## Seeding

Seed files auto-run on first boot (empty-table guard, idempotent):
- `openspec/seed/exercise-library.json` — muscle groups, exercises
- `openspec/seed/training-plans.json` — Hans's default plans with ordered muscle group slots
- `openspec/seed/sessions-seed.json` — Hans's initial weights used as past training plans
