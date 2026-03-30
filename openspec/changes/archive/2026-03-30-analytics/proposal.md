## Why

Session data has been accumulating but there's no way to see progress over time. Analytics gives Hans visibility into weight progression, training frequency, and muscle group balance — closing the feedback loop that makes structured training effective.

## What Changes

- New **Analytics** tab in the bottom navigation
- Weight progression chart per ExerciseDefinition (line graph, last N sessions)
- Muscle group overview: aggregate volume (sets × reps) per MuscleGroup across recent sessions
- Training calendar: chronological list of completed sessions with plan name and exercise count
- All computed from existing `TrainingSession` data — no new domain entities required

## Capabilities

### New Capabilities

- `exercise-progression`: Per-exercise weight trend over time — highest weight per session, plotted as a line chart
- `muscle-group-volume`: Per-muscle-group aggregate view — total sets logged per muscle group across a date range
- `training-calendar`: Session history list — date, plan name, duration, exercise count; entry point to per-session detail

### Modified Capabilities

<!-- none — analytics reads existing data, no requirement changes to existing capabilities -->

## Impact

- New `src/domain/analytics/` context with pure query types (no new aggregates)
- New `src/application/analytics/` use cases that query `ITrainingSessionRepository` and `IExerciseDefinitionRepository`
- New `src/presentation/analytics/` screens and components
- Chart rendering: lightweight SVG-based solution (no heavy charting library) to keep bundle size small
- Navigation: add Analytics tab to existing bottom nav
