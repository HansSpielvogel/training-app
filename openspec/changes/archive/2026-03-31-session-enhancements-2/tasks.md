## 1. RPE Scale Hint

- [x] 1.1 Replace `placeholder="RPE (opt.)"` with a label showing `RPE (1–10, opt.)` that stays visible on focus in `SetLogger.tsx`
- [x] 1.2 Verify the range indicator is visible when the field is focused on the active session screen

## 2. Plan Slot Removal

- [x] 2.1 Add `removedPlanSlotIndices` transient state to `useActiveSession.ts` (not persisted)
- [x] 2.2 Expose a `removePlanSlot(index)` action from the hook that adds the index to that state
- [x] 2.3 Filter removed plan slots out of the session entries list rendered in `ActiveSessionScreen.tsx`
- [x] 2.4 Wire `onRemoveEntry` in `EntryRow` for plan slots (currently only wired for temp slots)
- [x] 2.5 Ensure removed plan slots produce no session entry on session completion
- [x] 2.6 Write unit tests for plan-slot removal in `tempSlots.test.ts` or a new test file

## 3. Added Weight Field

- [x] 3.1 Add an optional `addedWeightInput` state field to `SetLogger.tsx`
- [x] 3.2 Render a compact secondary numeric input `"+added"` next to the main weight field
- [x] 3.3 In `parseInputs`, when `addedWeightInput` is non-empty construct `"base+added"` string and pass to existing `parseWeight`
- [x] 3.4 Clear `addedWeightInput` on successful set submission alongside the other input resets
- [x] 3.5 Write unit tests covering: stacked via separate field, comma in added field, empty added field falls back to normal parse
