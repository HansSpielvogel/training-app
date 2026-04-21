## Context

Three independent improvements that share a release milestone:

1. **Mode toggle discoverability** — `SetLogger.tsx` renders two separate buttons (primary action + a small secondary "Individual / Quick sets" toggle). The secondary button is visually subordinate and easy to miss. Segmented controls are a standard iOS pattern for mutually exclusive options with equal importance.

2. **Moved sum metric** — `getExerciseProgression.ts` computes `weight` (max) and `avgReps` per session. Progress in volume training is often invisible when weight drops but reps increase, or when sets increase. Moved sum captures total volume in one number.

3. **Analytics domain boundary** — `useAnalytics.ts` exposes `getSessionDetail: (id) => Promise<TrainingSession | undefined>`, returning a type from the `sessions` domain directly to presentation. `TrainingCalendarView` then dereferences `detail.entries` to render sets. This makes analytics depend on sessions types at the component boundary.

## Goals / Non-Goals

**Goals:**
- Segmented control replaces the two-button mode toggle; no behavior change, only UI
- `movedSum` computed as `sum of (weight × reps)` across all sets in a session, exposed as a third metric option on the progression screen (chart + list)
- `SessionDetailView` type defined in `domain/analytics/`; `useAnalytics` maps `TrainingSession → SessionDetailView` before exposing it; `TrainingCalendarView` receives `SessionDetailView` only

**Non-Goals:**
- No change to how sets are logged or stored
- No change to how sessions are fetched; `ITrainingSessionRepository` stays as-is
- No changes to the `sessions` or `exercises` bounded contexts

## Decisions

### Segmented control implementation
Use a simple inline `div` with two equal-width buttons styled as a pill-segmented control (Tailwind). No third-party component needed — it's two states and fits in the existing `SetLogger.tsx` render without extracting a component.

**Alternative considered**: Extract a generic `SegmentedControl` component. Rejected — only one use site, premature abstraction.

### Moved sum calculation
`movedSum = Σ (normalizedWeight × reps)` per session, where weight normalization follows the existing convention in `getExerciseProgression.ts` (single→value, bilateral→perSide, stacked→base+added). Add `movedSum?: number` to `ExerciseProgressionPoint` in `domain/analytics/`. Compute in `getExerciseProgression.ts`.

The UI adds a third option to the existing Chart/List toggle or adds a separate metric selector. Given the progression screen already has a Chart/List toggle, a separate metric toggle (Weight / Reps / Volume) is the cleanest approach — it works orthogonally with chart vs list.

**Alternative considered**: Show moved sum as an additional line on the existing chart. Rejected — three axes is too busy and the unit (kg total) doesn't mix well with the weight/reps dual-axis layout.

### SessionDetailView projection
Define in `domain/analytics/index.ts`:
```ts
interface SessionDetailView {
  readonly id: string
  readonly planName: string
  readonly date: Date
  readonly entries: readonly SessionEntryView[]
}
interface SessionEntryView {
  readonly exerciseName: string
  readonly sets: readonly SetSnapshot[]
}
```
`useAnalytics` maps `TrainingSession → SessionDetailView` using data from the exercise repository (to resolve exercise names). `TrainingCalendarView` receives `SessionDetailView | undefined`, not `TrainingSession`.

**Alternative considered**: Keep `TrainingSession` but re-export it from analytics. Rejected — that's aliasing, not projection; the boundary violation remains.

## Risks / Trade-offs

- [Segmented control layout on small screens] → Use equal-width flex children; test at iPhone SE width (375px)
- [Moved sum usefulness] → Not replacing weight/reps metrics, just adding a third option the user can select; no disruption to existing workflow
- [SessionDetailView projection requires exercise name lookup] → `getSessionDetail` already has access to the exercise repository via the hook composition root; projection is a small mapping step, not a new dependency

## Migration Plan

All changes are additive or UI-only. No data migrations, no breaking API changes, no schema changes. Deploy as a single release.
