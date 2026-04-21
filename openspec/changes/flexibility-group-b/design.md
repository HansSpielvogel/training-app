## Context

The active session screen has three friction points: (1) users must manually re-enter last session's weights; (2) the entry list order is fixed, so equipment availability can't be accommodated; (3) the "Remove slot" button is buried inside an expanded entry.

Existing scaffolding:
- `getLastSetsForExercise` already returns `SessionSet[] | null` and the result is already passed as `lastSets` to `SetLogger` — the data is there.
- `session.entries` is a persisted ordered array; `useActiveSession` + `useSessionSlotActions` mutate it via use cases.
- `doneIndices` is a position-based `Set<number>` in `sessionStorage`; reorder must remap it.
- `removePlanSlot` use case already exists; the UI just needs a new gesture surface.

## Goals / Non-Goals

**Goals:**
- Preset button in `SetLogger` that pre-fills inputs from `lastSets`
- Long-press drag-to-reorder entries; positions persisted to IndexedDB
- Swipe-left on `EntryRow` reveals red trash action for slot removal

**Non-Goals:**
- Reordering does not affect the underlying `TrainingPlan`
- Preset does not auto-submit; user still taps the log button
- No library dependency for drag-to-reorder — native touch events only (app is single-pane, no nested scroll conflict)

## Decisions

### Preset button placement
Placed inside `SetLogger` next to or below the weight/reps inputs, only when `lastSets` is non-null. In quick mode it fills the shared weight/reps/RPE fields. In individual mode it fills from `lastSets[0]`. Existing `formatLastSets` output is already shown as the "Last:" line — the button sits beside it. No new data fetching needed.

### Reorder: native touch events, no library
The entry list is a flat `<div>` column with no horizontal scroll, so drag-handle touch events won't conflict. A long-press (≥400ms) activates drag mode; `touchmove` translates the row visually; `touchend` commits the new index. A new `reorderEntries(repo, sessionId, fromIndex, toIndex)` use case updates `session.entries` in IndexedDB via the existing `ITrainingSessionRepository.update` method.

`doneIndices` remapping: on commit, map each done index through the permutation array produced by the reorder operation. sessionStorage is updated immediately after.

### Swipe-to-delete gesture
`EntryRow` owns the touch state. `touchstart` records `startX`. `touchmove` translates the row content left (clamped 0–80px). Past a 60px threshold, a red trash panel is revealed behind the row. `touchend`: if threshold exceeded → call `onRemoveEntry`; otherwise snap back. The existing `onRemoveEntry` prop and `removePlanSlot` / `removeTempSlot` use cases are reused unchanged. The "Remove slot" button inside the expanded view is removed.

Swipe is available on any slot regardless of expanded state. A slot with logged sets cannot be removed (existing domain rule); the swipe gesture will be disabled on those rows.

### Entry ordering in domain model
`SessionEntry[]` order in `TrainingSession.entries` is already the canonical display order. No schema changes needed. The `reorderEntries` use case reads the session, produces a reordered copy of `entries`, and calls `repo.update`.

## Risks / Trade-offs

- [Drag conflicts with scroll] The entry list is inside a `flex-1 overflow-y-auto` container. Long-press guard (400ms) prevents accidental drag during scroll. During active drag, `e.preventDefault()` stops scroll.
- [doneIndices desync] If reorder fails (repo error), `doneIndices` is not remapped. Mitigation: remap only after successful `await reorderEntries(...)`.
- [Swipe on done rows] Done rows have a green checkmark and are collapsed. Swiping a done row to remove it is intentionally allowed — it's still a valid session-time decision.
