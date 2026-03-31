## 1. Weight parsing improvements (domain)

- [x] 1.1 Normalize commas to dots in `parseWeight()` before regex matching (`domain/shared/Weight.ts`)
- [x] 1.2 Add/update unit tests for comma decimal in `parseWeight` (single, stacked formats)
- [x] 1.3 Verify negative single weight already parses correctly; add test if missing

## 2. Weight input UX (SetLogger)

- [x] 2.1 Add inline `style={{ fontSize: '16px' }}` to weight and reps inputs to prevent iOS zoom
- [x] 2.2 Add `onFocus` scroll handler to both inputs: delayed `scrollIntoView({ behavior: 'smooth', block: 'center' })`
- [x] 2.3 Add a "-/+" toggle button next to the weight input that prepends/removes a `-` prefix on the input string
- [x] 2.4 Write tests: comma input produces correct parsed weight; minus toggle prepends `-`; scroll handler fires on focus

## 3. Slot done state and finish button (EntryRow)

- [x] 3.1 Add `isExpanded: boolean` and `onToggle: () => void` props to `EntryRow`; remove internal `expanded` useState
- [x] 3.2 Add `onMarkDone: () => void` prop to `EntryRow`
- [x] 3.3 Add local `done: boolean` state in `EntryRow`; when done, show green indicator and hide clear-exercise button
- [x] 3.4 Add "Done" button in the expanded slot footer that sets `done=true` and calls `onMarkDone`

## 4. Auto-expand next incomplete slot (ActiveSessionScreen)

- [x] 4.1 Add `expandedIndex: number | null` and `doneIndices: Set<number>` state to `ActiveSessionScreen`
- [x] 4.2 Pass `isExpanded` and `onToggle` to each `EntryRow`; `onToggle` collapses/expands via `expandedIndex`
- [x] 4.3 In `onToggle`: when collapsing a slot that has sets, add to `doneIndices` and advance `expandedIndex` to next incomplete
- [x] 4.4 Pass `onMarkDone` to each `EntryRow`; when called, add to `doneIndices` and advance `expandedIndex` to next incomplete
- [x] 4.5 Write tests: finish button advances to next incomplete; log-and-collapse advances; last slot done → no advance

## 5. Plan editor save/discard (useTrainingPlanDetail + TrainingPlanDetailScreen)

- [x] 5.1 Refactor `useTrainingPlanDetail` to load plan into local draft state on mount (deep copy of slots and name)
- [x] 5.2 Convert all mutations (addSlot, removeSlot, moveSlot, toggleSlotOptional, renamePlan) to operate on local draft state only — no DB writes
- [x] 5.3 Add `save()` to hook: writes entire draft to DB, then navigates to `/training-plans`
- [x] 5.4 Add `discard()` to hook: navigates to `/training-plans` without writing
- [x] 5.5 Update `TrainingPlanDetailScreen`: remove back-arrow button; add Save and Discard buttons to the header
- [x] 5.6 Write tests: mutations update draft but not DB; save writes to DB; discard does not write
