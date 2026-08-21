## 1. Collapse arrow green when sets present

- [x] 1.1 In `EntryRowHeader.tsx`, add a `hasSets` (or reuse `setCount > 0`) condition and apply a green stroke/fill class to the collapse-arrow SVG, matching the Done button's condition
- [x] 1.2 Write/update a component test asserting the arrow has the green class when `setCount > 0` and not when `setCount === 0`
- [x] 1.3 Run tests

## 2. Jump to exercise history/stats from picker

- [x] 2.1 Verify the existing analytics/progression route shape (path + param) via the router config
- [x] 2.2 Add an `onViewStats?: (exerciseId: string) => void` prop to `VariationPicker.tsx`; render a small icon-button per chip that calls it (stop propagation so it doesn't also trigger selection)
- [x] 2.3 Wire `onViewStats` from `EntryRow.tsx`/session screen to `navigate()` to the exercise's history/stats view
- [x] 2.4 Write a test: clicking the shortcut navigates without selecting the exercise as the active variation
- [x] 2.5 Run tests

## 3. Fix swipe-to-delete state leaking into next row

- [x] 3.1 Inspect the parent list's `.map()` for `EntryRow` — confirm whether `key` is `entry.id` or list index
- [x] 3.2 If keyed by index: fix by keying on `entry.id` (preferred) or, if that has other side effects, reset `swipeX`/`swiping`/`swipeBlocked` in `useSwipeToDelete` via effect keyed on the bound entry id
- [x] 3.3 Write a test reproducing: delete an entry with a swiped neighbor below it that has ≥1 set (blocked from swipe) — assert the neighbor is not rendered in swiped state after deletion
- [x] 3.4 Run tests

## 4. Fix Torso Rotation Bauch-suggestion bug

- [x] 4.1 Trace the exercise-suggestion use case/query to see whether it matches `mg-bauch-seite` when filtering for `mg-bauch` (prefix/substring match bug) or whether the seed tag itself is wrong
- [x] 4.2 Apply the fix at the root cause (suggestion query exact-match fix, or seed `muscleGroupIds` correction — not both unless both are actually wrong)
- [x] 4.3 If seed file changed, audit `openspec/seed/sessions-seed.json` per CLAUDE.md rule for any entries referencing Torso Rotation with a `muscleGroupId` no longer valid
- [x] 4.4 Write/update a test asserting Torso Rotation is not suggested for a general Bauch (`mg-bauch`) slot
- [x] 4.5 Run tests

## 5. Progression chart: intermediate y-axis ticks

- [x] 5.1 Create `src/presentation/analytics/chartTicks.ts` exporting `computeNiceTicks(min: number, max: number, targetCount: number): number[]`
- [x] 5.2 Write unit tests for `computeNiceTicks` covering small ranges, zero-inclusive ranges, and negative-free strength-training data
- [x] 5.3 Use `computeNiceTicks` in `ProgressionChart.tsx` for weight, reps, and volume axes; render tick `<text>` labels (and optional light gridlines) at each computed value
- [x] 5.4 Confirm `ProgressionChart.tsx` stays within (or close to) the 200-line convention; extract further if needed
- [x] 5.5 Run tests and visually verify via `/ui-review` or manual check that a chart with ~8 entries now shows readable intermediate values
