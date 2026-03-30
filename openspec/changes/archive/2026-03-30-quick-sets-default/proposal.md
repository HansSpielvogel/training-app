## Why

Session-enhancements needs a per-exercise "how many sets to log by default" value for quick-sets mode. Storing it on `ExerciseDefinition` keeps it with the exercise data and avoids hardcoding it in the session layer.

## What Changes

- Add optional `defaultSets: number` field to `ExerciseDefinition` (fallback: 3 when absent)
- Expose `defaultSets` in the exercise create/edit form with a numeric input (min 1, default 3)
- Persist the field through the Dexie repository

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `exercise-definitions`: create and edit forms now include a `defaultSets` field (positive integer, defaults to 3)

## Impact

- `src/domain/exercises/ExerciseDefinition.ts` — add `defaultSets?: number`
- `src/application/exercises/` — pass field through create/update use cases
- `src/infrastructure/exercises/` — persist field in Dexie schema (no migration needed; undefined reads back as `undefined`, treated as 3)
- `src/presentation/exercises/` — add numeric input to ExerciseForm
