## Context

`PlanSlot` currently holds `id`, `planId`, `muscleGroupId`, and `order`. Hans marks certain muscle groups "Evtl" (optional) in his paper system, but the app has no concept of this. The active session's variation picker shows the last 4 used exercises but gives no hint toward variety — Hans mentally tracks which variation is overdue.

## Goals / Non-Goals

**Goals:**
- Add `optional: boolean` to `PlanSlot` with Dexie migration
- Plan detail UI gains a per-slot toggle to mark a slot optional
- Rotation suggestion algorithm computed in the application layer and surfaced in the active session variation picker

**Non-Goals:**
- Displaying the "Evtl" badge during an active session (belongs to `session-enhancements`)
- Quick-sets, RPE, temp modifications (also `session-enhancements`)

## Decisions

**1. `optional` is a persisted field on PlanSlot**
Hans consistently marks the same slots optional across sessions — this is a plan-level preference, not a per-session choice. Storing it on the slot avoids asking each time.
Alternative: session-time toggle → requires user to re-decide every session, defeats the purpose.

**2. Dexie migration via schema version bump only**
Existing records lack the `optional` field; they will read as `undefined`. The domain layer coerces `undefined` to `false` (non-breaking). No data rewrite needed.
Alternative: Dexie `onCreate` hook to backfill → unnecessary complexity for a boolean default.

**3. Rotation suggestion algorithm**
Query the last 5 completed sessions that contain an entry for the slot's muscle group. Count how many times each `ExerciseDefinition` was used. Suggest the one with the lowest count, excluding the most-recently-used exercise. On a tie in count, prefer the one used longest ago. No suggestion when fewer than 2 distinct exercises appear in those 5 sessions, or when all non-recent candidates share the same count.
Alternative: use full history → too stable; recent training focus matters more.

**4. Suggestion lives in `application/sessions/`**
A `RotationSuggestionService` (or use-case function) takes the muscle group ID and session history as inputs and returns the suggested `ExerciseDefinitionId | null`. Pure TypeScript, no React dependency, easily testable.

**5. Suggestion rendered as a highlighted chip above the recent-variations list**
Only rendered when a suggestion exists. No suggestion → UI unchanged from current state.

## Risks / Trade-offs

- [Dexie migration gap] Existing slots read `optional` as `undefined` at runtime → coerce at the domain/application boundary. Low risk, no data loss.
- [Thin history] With fewer than 5 past sessions the suggestion is based on limited data. Acceptable; the fallback is "no suggestion shown", not a wrong suggestion.

## Migration Plan

1. Bump Dexie schema version (e.g. v4 → v5); no upgrade callback required.
2. Add `optional?: boolean` to the Dexie table definition for `planSlots`.
3. Coerce `optional ?? false` wherever `PlanSlot` is read from the DB.
4. Ship as standard PWA update; no rollback complexity (field is additive).
