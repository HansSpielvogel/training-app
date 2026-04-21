## 1. Segmented Control Mode Toggle

- [x] 1.1 Replace the two-button mode toggle in `SetLogger.tsx` with a segmented control (`Quick` / `Individual`) styled as a pill-segmented control using Tailwind
- [x] 1.2 Verify both segments are always visible and the active segment is visually highlighted
- [x] 1.3 Update the `active-session` spec integration test or add a test that confirms switching modes via the segmented control works correctly

## 2. Moved Sum Domain Type

- [x] 2.1 Add `movedSum?: number` to `ExerciseProgressionPoint` in `src/domain/analytics/index.ts`
- [x] 2.2 Implement moved sum calculation in `src/application/analytics/getExerciseProgression.ts`: `Σ (normalizedWeight × reps)` across all sets per session, using existing weight normalization logic
- [x] 2.3 Write unit tests for the moved sum calculation covering: uniform sets, varying sets, bilateral weight, stacked weight, missing reps/weight

## 3. Metric Selector UI

- [x] 3.1 Add a `metric` state (`'weight' | 'reps' | 'volume'`) to `ExerciseProgressionView.tsx`, defaulting to `'weight'`
- [x] 3.2 Render a metric selector control (three options: Weight / Reps / Volume) above the Chart/List toggle when progression data is present
- [x] 3.3 In chart view — Weight: existing dual-axis chart unchanged; Reps: single orange reps line; Volume: single purple line with Y-axis labelled "kg moved"
- [x] 3.4 In list view — add the selected metric value to each session row (weight: max weight formatted, reps: avg reps, volume: moved sum as "X kg moved")
- [x] 3.5 Ensure metric selection persists when toggling between chart and list views

## 4. Analytics Domain Boundary Refactor

- [x] 4.1 Define `SessionDetailView` and `SessionEntryView` types in `src/domain/analytics/index.ts`
- [x] 4.2 Update `useAnalytics.ts` to project `TrainingSession → SessionDetailView` inside `getSessionDetail`, resolving exercise names via the exercise repository
- [x] 4.3 Update `TrainingCalendarView.tsx` to accept `SessionDetailView | undefined` instead of `TrainingSession | undefined`
- [x] 4.4 Remove any direct import of `TrainingSession` or sessions-domain types from `presentation/analytics/` files
- [x] 4.5 Verify no `import` of sessions-domain types remains in `src/presentation/analytics/` or `src/domain/analytics/`
