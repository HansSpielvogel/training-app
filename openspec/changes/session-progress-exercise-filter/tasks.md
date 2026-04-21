## 1. Session Progress Indicator

- [x] 1.1 Add a `SessionProgressBar` presentational component in `src/presentation/sessions/` that accepts `done: number` and `total: number` props and renders a thin filled bar with a `"done / total"` label
- [x] 1.2 Integrate `SessionProgressBar` into `ActiveSessionScreen.tsx` below the session title — pass `doneIndices.size` as `done` and `session.entries.length` as `total`
- [x] 1.3 Write unit tests for `SessionProgressBar` covering: 0/N, M/N, and N/N states

## 2. Progression Exercise Filter

- [x] 2.1 Derive the list of filterable muscle groups in `AnalyticsScreen.tsx` (or `ExerciseProgressionView.tsx`) by collecting unique `muscleGroupIds` from the `exercises` list and mapping them to `MuscleGroup` names using already-loaded muscle group data
- [x] 2.2 Add local `selectedMuscleGroupId` state in `ExerciseProgressionView.tsx`; filter the `exercises` list when a group is active
- [x] 2.3 Add a `MuscleGroupFilterChips` presentational component in `src/presentation/analytics/` that renders a horizontally-scrollable row of chips; accepts `groups`, `selected`, and `onSelect` props; highlights the active chip and toggles off on re-tap
- [x] 2.4 Render `MuscleGroupFilterChips` above the exercise list in `ExerciseProgressionView.tsx`; pass the derived groups, current selection, and setter
- [x] 2.5 Write unit tests for `MuscleGroupFilterChips` covering: default (no selection), select a chip, deselect active chip, only-relevant-groups-shown contract
