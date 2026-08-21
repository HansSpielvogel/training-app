## Context

Five independent bugs/gaps, each scoped to 1-2 files. Grounded via codebase read:

1. `EntryRow.tsx:130-138` — Done button renders only when `setCount > 0`, styled green. `EntryRowHeader.tsx:74-79` — collapse arrow rotates on `isExpanded` only, no `setCount` awareness. `EntryRowHeader.tsx:55-57` already shows `{setCount} sets` in blue when `setCount > 0` — model the arrow's green state on the same condition.
2. `VariationPicker.tsx` (76 lines) is pure/presentational: suggestion chip, recent/other chips, "Other…" expandable list. No secondary action exists per exercise row.
3. `useSwipeToDelete.ts:19-21` holds `swipeX`/`swiping`/`swipeBlocked` in component-instance-local `useState`, one hook instance per rendered `EntryRow` (`EntryRow.tsx:47-48`). If rows are list-order-keyed (not entry-id-keyed), deleting a row shifts the next entry's data into that row's React instance, which keeps the old swipe state.
4. `exercise-library.json:70` — Torso Rotation is `muscleGroupIds: ["mg-bauch-seite"]` (side abs), a distinct group from `mg-bauch` (general Bauch, line 14). The roadmap complaint ("suggested constantly for Bauch") implies either the suggestion logic doesn't distinguish side-abs from general-abs, or the tagging itself should be broadened/narrowed.
5. `ProgressionChart.tsx` computes raw `Math.min`/`Math.max` per metric (lines ~41-43, 66-68, 92-94, 98-100) and renders exactly two `<text>` labels (top/bottom) per axis — no intermediate ticks.

## Goals / Non-Goals

**Goals:**
- Fix all five items with minimal surface area; no new abstractions beyond what's needed.
- Keep `ProgressionChart.tsx` under the 200-line convention already flagged in the roadmap's Future section — if adding tick logic pushes it over, extract a small `computeTicks(min, max, count)` helper into a sibling file rather than inlining more SVG branches.

**Non-Goals:**
- Not extracting the three duplicated SVG render branches in `ProgressionChart.tsx` (separate roadmap Future item) — only touching axis-label rendering.
- Not redesigning `VariationPicker.tsx` layout — adding one small affordance per row, not restructuring.
- Not migrating the whole session-entry list to a different keying scheme unless required to fix the swipe bug.

## Decisions

**Decision: Collapse-arrow green state mirrors Done button's condition exactly (`setCount > 0`), not `done`.**
Roadmap item explicitly says "same logic as the done button" — that's presence of ≥1 set, not completion. Keeps the two visual cues consistent: blue "N sets" text already exists at `setCount > 0`, so the arrow gets a similar green stroke/fill class gated on the same boolean, computed once and passed as a prop.

**Decision: "View history/stats" shortcut is a small icon-button per chip, not a new screen or modal.**
Navigate via existing `react-router-dom` (`useNavigate`, already used in `ActiveSessionScreen.tsx`) to the existing analytics/progression route, passing the exercise id. Thread a new `onViewStats?: (exerciseId: string) => void` prop from `EntryRow.tsx` down into `VariationPicker.tsx`, wired to `navigate()` at the `EntryRow`/screen level (navigation logic stays out of the presentational picker itself — consistent with hooks-as-composition-root pattern already used elsewhere).

**Decision: Fix swipe-state leakage by resetting swipe state on `entry.id` change, not by changing list keys.**
Changing the list `key` to `entry.id` (if not already) is the textbook React fix, but risks broader re-render/animation side effects across the row. Cheaper, scoped fix: add a `useEffect` in `useSwipeToDelete` (or in `EntryRow`) that resets `swipeX`/`swiping`/`swipeBlocked` whenever the entry id bound to that hook instance changes. First check the actual list-key situation in `EntryRow`'s parent (likely `.map(entry => <EntryRow key={?}>)`) before implementing — if the key is already `entry.id`, the bug is instead about `useSwipeToDelete` state initializing after the swiped item is removed rather than a stale-instance issue, requiring a reset instead keyed on the *count/identity of the entries array*.

**Decision: Torso Rotation — retag rather than change suggestion logic.**
`mg-bauch-seite` is a real distinct group already in the seed (side abs). If the app's suggestion algorithm doesn't yet distinguish it from `mg-bauch`, that's a bigger algorithmic question outside this bug's scope; the roadmap wording ("seed/exercises bug") points at the seed tag as the fix target. Action: verify whether Torso Rotation is exercise-anatomically a rotational (side) movement (it is) — if the actual complaint is that side-abs suggestions surface during general Bauch selection, the fix is in the suggestion/filter query (must filter by exact `mg-bauch` id, not any Bauch-prefixed group), not the seed tag. Confirm via the suggestion use case before editing the seed file — avoid a blind seed edit that doesn't address the root cause.

**Decision: Progression chart — add 3-4 intermediate ticks using a "nice number" step algorithm, not raw linear division.**
Rounding min/max to nice round numbers (e.g. 0, 25, 50, 75, 100 instead of 3, 47, 91) is standard chart practice and avoids ugly decimal labels. Extract `computeNiceTicks(min: number, max: number, targetCount: number): number[]` as a small pure function (candidate location: `src/presentation/analytics/chartTicks.ts`) so it's unit-testable in isolation and reused across the three metrics (weight, reps, volume) instead of copy-pasted.

## Risks / Trade-offs

- [Swipe-state fix approach depends on actual list-keying, unverified until implementation] → Mitigation: inspect the parent `.map()` key first; task list includes a verification step before code changes.
- [Torso Rotation fix may be in suggestion logic, not seed data as roadmap implies] → Mitigation: trace the suggestion use case first; only edit the seed file if the tag itself is wrong.
- [Adding tick computation could push `ProgressionChart.tsx` over 200 lines] → Mitigation: extract `computeNiceTicks` to its own file per Goals.
