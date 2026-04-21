## 1. Active Exercise State Tracking

- [x] 1.1 Add `activeEntryIndex: number | null` to ActiveSessionView component state
- [x] 1.2 Update state when user selects an exercise variation for a slot
- [x] 1.3 Update state when user logs the first set in a slot
- [x] 1.4 Clear state when user marks a slot complete
- [x] 1.5 Update state when user switches to a different slot

## 2. Auto-Open Next Unfinished Exercise

- [x] 2.1 Implement `findNextUnfinishedEntry` helper function that skips completed slots
- [x] 2.2 Modify slot completion handler to call `findNextUnfinishedEntry` after marking complete
- [x] 2.3 Set `activeEntryIndex` to the next unfinished entry (if found)
- [x] 2.4 Add scroll-to-element logic to bring newly opened entry into view
- [x] 2.5 Handle edge case: no unfinished entries remain (do nothing)

## 3. Restore Focus on Tab Return

- [x] 3.1 Add `useEffect` hook in ActiveSessionView that runs on mount/visibility
- [x] 3.2 Check if `activeEntryIndex` is set and slot is not yet complete
- [x] 3.3 Scroll to and expand the active entry if conditions are met
- [x] 3.4 Test tab navigation: Stats → Active Session preserves active exercise

## 4. RPE Editing UI

- [x] 4.1 Add edit icon/button next to RPE value in logged set display component
- [x] 4.2 Only show edit affordance when session status is `in-progress`
- [x] 4.3 Implement inline RPE input (1–10 number input) on edit tap
- [x] 4.4 Add confirm and cancel actions for RPE edit
- [x] 4.5 Style edit icon to be minimal/low-opacity until interaction

## 5. RPE Editing Application Layer

- [x] 5.1 Create `updateSetRpe` use case in application/sessions layer
- [x] 5.2 Accept parameters: sessionId, entryIndex, setIndex, newRpe
- [x] 5.3 Load session from repository, update the specific set's RPE field
- [x] 5.4 Persist updated session via `sessionsRepository.update()`
- [x] 5.5 Return success/failure result

## 6. Integration and Wiring

- [x] 6.1 Wire RPE edit button to call `updateSetRpe` use case
- [x] 6.2 Refresh UI after successful RPE update
- [x] 6.3 Handle RPE edit for sets with no prior RPE (initially null → set to value)
- [x] 6.4 Verify that weight and reps remain unchanged after RPE edit

## 7. Tests

- [x] 7.1 Unit test: `findNextUnfinishedEntry` with various slot completion states
- [x] 7.2 Unit test: `updateSetRpe` use case
- [x] 7.3 Integration test: marking slot complete auto-opens next unfinished
- [x] 7.4 Integration test: tab navigation restores active exercise
- [x] 7.5 Integration test: editing RPE on a logged set updates domain entity
- [x] 7.6 E2E test: complete exercise, verify next one opens
- [x] 7.7 E2E test: log sets, switch to Stats, return, verify active exercise focused
- [x] 7.8 E2E test: log set with RPE 7, edit to RPE 8, verify persistence
