## 1. Preset from last

- [x] 1.1 Add preset button to `SetLogger` — shown when `lastSets` is non-null; displays first-set summary (weight × reps [× RPE])
- [x] 1.2 Wire button to pre-fill weight, reps, and RPE inputs in both quick and individual modes
- [x] 1.3 Write unit tests for preset button: visible/hidden based on `lastSets`, fills correct fields, does not auto-submit

## 2. Reorder entries via long-press drag

- [x] 2.1 Add `reorderEntries(repo, sessionId, fromIndex, toIndex)` application use case; write unit tests
- [x] 2.2 Expose `reorderEntries` from `useActiveSession` hook
- [x] 2.3 Add drag-handle element to `EntryRow` (visible only during in-progress session)
- [x] 2.4 Implement long-press (400ms) + touchmove/touchend drag logic in `ActiveSessionScreen`; translate row visually and show insertion indicator
- [x] 2.5 On drop: call `reorderEntries`, remap `doneIndices` set to new positions, update `sessionStorage`
- [x] 2.6 Write unit tests for `doneIndices` remapping logic

## 3. Swipe-to-delete slot

- [x] 3.1 Add swipe-left touch gesture to `EntryRow`: track `startX`, translate row content left (0–80px), reveal red trash panel
- [x] 3.2 On release ≥60px: call `onRemoveEntry`; on release <60px: snap back
- [x] 3.3 Disable swipe gesture when entry has logged sets (`entry.sets.length > 0`)
- [x] 3.4 Remove the existing "Remove slot" button from the expanded entry view
- [x] 3.5 Write tests for swipe gesture: threshold commit, snap-back, disabled when sets logged
