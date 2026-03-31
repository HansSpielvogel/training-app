## Context

The app runs as an iPhone PWA, used one-handed at the machine. Several friction points were found by direct use:

- Weight input (`SetLogger.tsx`): `type="text"` + `inputMode="decimal"` — accepts commas in DOM but `parseWeight()` in `domain/shared/Weight.ts` only matches dots. iOS decimal keyboard has no minus key.
- Reps input: `type="number"` with `text-sm` (14px) — below iOS's 16px zoom threshold.
- Slot expansion (`EntryRow.tsx`): fully local `useState` — parent has no way to programmatically expand a slot.
- Plan editor (`TrainingPlanDetailScreen.tsx`): every mutation writes to DB immediately. No draft/discard concept.

## Goals / Non-Goals

**Goals:**
- All 7 items from the proposal: zoom, comma, scroll, minus, finish button, auto-expand, save/discard

**Non-Goals:**
- No new domain types for weight (no `supportive` kind)
- No changes to the session data model — `done` state is UI-only and ephemeral
- No changes outside `presentation/` except `parseWeight()` in `domain/shared/Weight.ts`

## Decisions

### D1: Comma decimal — normalize in domain layer
Normalize commas to dots inside `parseWeight()` before regex matching. One-line change to `Weight.ts`. This keeps the UI dumb and handles all weight formats (single, bilateral, stacked) uniformly.

Alternative considered: normalize in `SetLogger` before calling `parseWeight()`. Rejected — leaks locale handling into the UI layer.

### D2: Minus key — dedicated toggle button in SetLogger
`inputMode="decimal"` on iOS shows a numeric keypad with no minus key. The fix is a small "-/+" toggle button that prepends or removes the `-` prefix on the weight input string. This fits one-handed gym use better than switching to a full keyboard (`inputMode="text"`).

Negative values already parse correctly in `parseWeight()` — the regex `^-?\d+` is already there.

### D3: iOS zoom — inline `fontSize: 16px` on inputs
iOS Safari zooms when an input's font-size is below 16px. Both inputs use Tailwind `text-sm` (14px). Override with inline `style={{ fontSize: '16px' }}` — minimal change, no global CSS side effects.

### D4: Scroll to input — onFocus with delayed scrollIntoView
On `onFocus`, call `e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' })` after a ~300ms delay to give the iOS keyboard time to animate into place before repositioning. Apply to both weight and reps inputs.

### D5: Finish button — local state in EntryRow
`done: boolean` lives in `EntryRow` local state. When `done` is true: show a green checkmark badge on the header, hide the clear-variation button. The sets remain fully editable. An `onFinish` callback prop fires when done is set.

### D6: Auto-expand next incomplete — lift expanded state to ActiveSessionScreen
`EntryRow.expanded` is promoted from local state to a controlled prop (`isExpanded: boolean`, `onToggle: () => void`). `ActiveSessionScreen` holds `expandedIndex: number | null`.

Two triggers advance `expandedIndex` to the next incomplete slot:
1. Finish button pressed (`onMarkDone(i)`)
2. User collapses a slot that has logged sets (detected in `onToggle` when `isExpanded` was true and `entry.sets.length > 0`)

"Next incomplete" = lowest index greater than current where `doneIndices` does not include that index. `doneIndices: Set<number>` is tracked in `ActiveSessionScreen`.

### D7: Plan editor save/discard — draft mode in useTrainingPlanDetail
Replace the current eager-save model with a draft model:
- Load plan into local React state on mount (deep copy)
- All mutations (addSlot, removeSlot, moveSlot, toggleSlotOptional, renamePlan) operate on local draft state only — no DB writes
- `save()`: writes entire draft to DB atomically, navigates back
- `discard()`: navigates back with no writes
- `deletePlan()`: still writes immediately (destructive, outside the draft flow), then navigates back
- Remove back arrow from `TrainingPlanDetailScreen` header; replace with Save and Discard buttons

This refactors `useTrainingPlanDetail` from imperative repo calls per mutation to a local-state-first model with a single commit step.

## Risks / Trade-offs

- **D6: Controlled expansion** — Any caller that previously relied on `EntryRow` being self-managing now needs to pass `isExpanded`/`onToggle`. Scope is limited to `ActiveSessionScreen` (the only caller).
- **D7: Draft mode** — If the user is interrupted mid-edit (phone call, app backgrounded) the unsaved draft is lost on reload. This is acceptable given that plans are not changed frequently and the scenario is uncommon. No crash risk — the plan in DB is untouched until Save.
- **D4: Scroll timing** — 300ms hardcoded delay works for most devices but is a heuristic. If it feels off on-device it can be tuned.
