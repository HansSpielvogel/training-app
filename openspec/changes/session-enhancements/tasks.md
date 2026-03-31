## 1. RPE — Domain Model

- [x] 1.1 Add `rpe?: number` to `SessionSet` value object in `domain/sessions/`
- [x] 1.2 Add RPE validation (integer 1–10) to the `SessionSet` factory/constructor
- [x] 1.3 Write unit tests for RPE validation (valid range, 0 rejected, 11 rejected, non-integer rejected, undefined accepted)

## 2. RPE — Application & Set Logger UI

- [x] 2.1 Update `addSet` use case to accept and forward optional `rpe` value
- [x] 2.2 Add RPE input field to the set logger component (compact, inline, optional)
- [x] 2.3 Wire RPE validation error display in the logger UI
- [x] 2.4 Apply RPE to all N sets when submitting in quick mode
- [x] 2.5 Reset RPE input on successful submission (alongside weight and reps)
- [x] 2.6 Write integration tests: log set with RPE, log set without RPE, invalid RPE blocked

## 3. RPE — Exercise Progression Chart

- [x] 3.1 Update progression query to compute average RPE per session data point
- [x] 3.2 Render average RPE as a secondary visual indicator on the progression chart
- [x] 3.3 Omit RPE indicator for data points where no sets have RPE recorded
- [x] 3.4 Write unit tests for average-RPE computation (mixed RPE/no-RPE sets, all-undefined sessions)

## 4. Temp Slots — Domain Model

- [x] 4.1 Add `isTemp?: boolean` to `SessionEntry` in `domain/sessions/`
- [x] 4.2 Ensure existing session entry creation sets `isTemp` to `false`/`undefined` (plan slots unaffected)
- [x] 4.3 Write unit tests for `SessionEntry` with and without `isTemp`

## 5. Temp Slots — Application Use Cases

- [x] 5.1 Add use case: `addTempSlot(sessionId, muscleGroupId)` — appends a temp SessionEntry
- [x] 5.2 Add use case: `removeTempSlot(sessionId, entryIndex)` — removes temp entry only when no sets logged; throws if sets exist or entry is not temp
- [x] 5.3 Add use case: `addPlanSlotsToSession(sessionId, planId)` — loads plan, adds temp entries for muscle groups not already in session
- [x] 5.4 Write unit tests for `addTempSlot` (adds correctly, isTemp is true)
- [x] 5.5 Write unit tests for `removeTempSlot` (removes empty temp, blocked with sets, blocked for plan slots)
- [x] 5.6 Write unit tests for `addPlanSlotsToSession` (only new muscle groups added, all-overlap case)

## 6. Temp Slots — Presentation

- [x] 6.1 Add "Add muscle group" control to the active session slot list
- [x] 6.2 Implement muscle group picker (select from available muscle groups) wired to `addTempSlot`
- [x] 6.3 Show a visual "temp" badge on temp slots
- [x] 6.4 Show remove button on temp slots with no sets; disable/hide when sets are logged
- [x] 6.5 Add "Add plan" option — plan picker wired to `addPlanSlotsToSession`
- [x] 6.6 Write E2E test: add temp slot, assign exercise, log sets, complete session — temp slot appears in session history
- [x] 6.7 Write E2E test: add plan's slots — overlapping muscle groups not duplicated
