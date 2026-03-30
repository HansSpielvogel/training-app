## Context

`ExerciseDefinition` is a pure domain value object with no optional numeric fields today. `session-enhancements` will need a per-exercise set count for quick-sets mode; the cleanest place to store it is on the exercise itself so the session layer never hardcodes the number 3.

## Goals / Non-Goals

**Goals:**
- Add `defaultSets?: number` to the domain type and persist it
- Expose the field in the exercise create/edit UI

**Non-Goals:**
- Quick-sets mode UI (belongs to session-enhancements)
- Validation beyond "positive integer"

## Decisions

**Optional with runtime fallback vs required field**
`defaultSets` is `undefined` on existing records; the session layer reads `exercise.defaultSets ?? 3`. This avoids a Dexie schema migration and keeps existing data valid. A required field with a migration would add risk for zero user benefit.

**Min 1, no enforced max**
The domain factory rejects values < 1. No upper bound is enforced; unusually large values are the user's choice.

## Risks / Trade-offs

- [Risk] The `?? 3` fallback is spread across any future consumer → Mitigation: centralise the default in a domain constant `DEFAULT_SET_COUNT = 3` exported from the domain layer.
