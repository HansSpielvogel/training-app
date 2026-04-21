## Why

The active session mode toggle is hard to discover (users don't know individual mode exists), and the progression chart only shows weight — obscuring real progress when volume increases even as per-set weight stays flat. The analytics context also has a cross-context dependency on `sessions` that needs to be fixed before it widens further.

## What Changes

- Replace the tap-to-toggle quick-sets/individual mode control in active session with a visible segmented control (two labelled tabs)
- Add a "Moved Sum" metric option to the exercise progression screen — computed as `weight × reps × sets` per session, available in both chart and list views
- Introduce a `SessionDetailView` type in the `analytics` domain; have `useAnalytics` project `TrainingSession → SessionDetailView` at the boundary, removing the direct `sessions` dependency

## Capabilities

### New Capabilities
- `moved-sum-metric`: Moved sum calculation and display on the exercise progression screen (chart + list)

### Modified Capabilities
- `active-session`: Mode toggle UI replaced with a segmented control for better discoverability
- `exercise-progression`: New metric option added to existing progression view

## Impact

- `presentation/` — `ActiveSessionView`, mode toggle component; `ExerciseProgressionView` or equivalent
- `application/analytics/` — `useAnalytics` or equivalent hook; new `SessionDetailView` type in `domain/analytics/`
- `domain/analytics/` — new `SessionDetailView` type definition
- No data-model changes; no breaking API changes
