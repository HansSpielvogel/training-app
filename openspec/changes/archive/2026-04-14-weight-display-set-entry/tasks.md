## 1. Zoom Fix

- [x] 1.1 Add `!important` to the `font-size: max(16px, 1em)` rule in `src/index.css`
- [x] 1.2 Verify with a Playwright test that an input with `text-sm` class has effective font-size ≥ 16px

## 2. Seed Data Fix

- [x] 2.1 Remove `mg-bauch` from `muscleGroupIds` of "Oblique Crunch" in `openspec/seed/exercise-library.json`

## 3. Last Weight Display

- [x] 3.1 Add `formatLastWeight(weight: Weight, exerciseName?: string): string` in `src/presentation/shared/formatSets.ts` — stacked shows `{base} +{added} kg`, LH stacked shows `LH +{added} kg`
- [x] 3.2 Update `formatSets` to use `formatLastWeight` (or extract shared logic) so the "Last:" line uses the new per-component stacked format
- [x] 3.3 Add `exerciseName?: string` prop to `SetLogger` and use it when calling the last-weight formatter
- [x] 3.4 Pass `exerciseName` from `EntryRow` down to `SetLogger`
- [x] 3.5 Add / update unit tests in `formatSets.test.ts` covering stacked and LH display cases

## 4. Individual Mode Set Prefill

- [x] 4.1 In `SetLogger`, after a set is submitted in individual mode, retain the weight and reps input values instead of resetting them
- [x] 4.2 Add a test in `SetLogger.test.tsx` verifying that weight and reps inputs are prefilled after the first set is logged in individual mode
