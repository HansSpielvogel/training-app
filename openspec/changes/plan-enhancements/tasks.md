## 1. Domain & Infrastructure

- [x] 1.1 Add `optional?: boolean` to `PlanSlot` domain entity type
- [x] 1.2 Bump Dexie schema version and add `optional` to the `planSlots` table definition
- [x] 1.3 Coerce `optional ?? false` in the `PlanSlot` repository read path so existing records behave as required

## 2. Rotation Suggestion Logic

- [x] 2.1 Create `computeRotationSuggestion(muscleGroupId, recentSessions)` in `application/sessions/` — returns the suggested `ExerciseDefinitionId | null`
- [x] 2.2 Write unit tests covering: empty history, only 1 distinct exercise, 2 equally-used exercises (no suggestion), 2 unequally-used exercises (suggest least-used), tie-breaking by recency, full 5-session case

## 3. Plan Detail UI

- [x] 3.1 Add an optional toggle control (e.g. checkbox or small button) to each slot row in the plan detail component
- [x] 3.2 Wire the toggle to persist the updated `optional` flag via the existing slot update path
- [x] 3.3 Show an "Evtl" badge on slots where `optional === true`

## 4. Active Session UI

- [x] 4.1 Compute rotation suggestion when the variation picker opens for a slot (call `computeRotationSuggestion` with the slot's muscle group and last 5 sessions)
- [x] 4.2 Render a suggestion chip above the recent-variations list when a suggestion is returned; hide it when `null`
- [x] 4.3 Tapping the suggestion chip assigns that `ExerciseDefinition` to the session entry (same as picking a recent variation)

## 5. Tests & Verification

- [x] 5.1 Integration test: toggling optional on a slot persists the flag and renders the "Evtl" badge
- [x] 5.2 Integration test: suggestion chip appears for a slot with qualifying history and is absent when conditions are not met
- [x] 5.3 Run full test suite and confirm all tests pass
