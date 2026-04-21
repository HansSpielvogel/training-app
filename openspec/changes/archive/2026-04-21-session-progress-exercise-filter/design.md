## Context

Two independent UI improvements for the in-gym use case:

1. **Session progress indicator** — Hans has no visual sense of how far through a workout he is until he scrolls up to count slots. The `session-slot-completion` spec already tracks a per-slot "done" state (UI-only, ephemeral). A compact progress bar can derive its count directly from that existing state.

2. **Progression tab exercise filter** — The Progression tab shows all exercises with history in a flat alphabetical list. As the library grows this scroll becomes tedious when Hans already knows the muscle group he wants. The `MuscleGroup` for each exercise is available on `ExerciseDefinition` and already loaded for the exercise list.

Both changes are purely presentational — no new application or domain layer logic required.

## Goals / Non-Goals

**Goals:**
- Show N-of-M slot progress in the active session header, updating live as slots are marked done
- Add muscle-group filter chips to the Progression tab exercise list, reducing scroll to reach the target exercise

**Non-Goals:**
- Persisting "done" count or progress to IndexedDB
- Full-text search on the exercise list (filter by muscle group is sufficient for now)
- Showing per-slot status (just aggregate count)

## Decisions

**Progress uses the existing "done" state, not set-count.**
A slot is counted as done when the user explicitly marks it done (button or collapse-with-sets). This mirrors the existing visual cue (green indicator) so the bar is consistent with what Hans already sees. Alternative: count slots with ≥1 set — rejected because a partially-worked slot might be "done enough" but not yet collapsed.

**Progress bar placement: below the session title, above the slot list.**
Compact — a thin filled bar with a `"3 / 6"` label. Stays in view without scrolling. Alternative: footer — rejected because it would be hidden when the keyboard is open.

**Progression filter: horizontal scrollable chip row, one chip per muscle group that has any history.**
Only muscle groups with at least one exercise in the history list are shown as chips. Default state: no filter (all exercises shown). Tapping a chip filters to that group; tapping again deselects. Single-select only for simplicity. Alternative: multi-select — deferred, not needed yet.

## Risks / Trade-offs

- [Progress bar re-renders on every done-state change] → Minimal cost; it reads a simple count from existing state already flowing through the component tree.
- [Chip row takes vertical space on small screens] → Row is scrollable horizontally; if no chips fit the viewport it scrolls rather than wrapping.
