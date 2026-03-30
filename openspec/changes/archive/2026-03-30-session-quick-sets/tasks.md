## 1. Thread defaultSets down to SetLogger

- [x] 1.1 In `ActiveSessionScreen`, derive `defaultSets` for each entry from `exerciseDataMap[i].all` and pass it to `EntryRow`
- [x] 1.2 Add `defaultSets?: number` prop to `EntryRow` and forward it to `SetLogger`
- [x] 1.3 Add `defaultSets?: number` prop to `SetLogger`

## 2. Quick mode in SetLogger

- [x] 2.1 Add `mode` state (`'quick' | 'individual'`) initialised to `'quick'`
- [x] 2.2 In quick mode: replace "Add" button with "Log N sets" button that calls `onAdd` N times with the same weight and reps, then resets inputs
- [x] 2.3 In individual mode: keep existing single-add behaviour
- [x] 2.4 Add toggle button that switches between modes (label: "Individual sets" when in quick mode, "Quick sets" when in individual mode)
