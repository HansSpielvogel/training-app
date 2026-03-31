## Context

The session tracking bounded context is complete: sessions start from a plan, slots are logged with weight/reps, and the done/auto-expand UX is in place. Two p2 features remain unimplemented: RPE and temp slot management. Both touch the session domain model and the active-session UI.

## Goals / Non-Goals

**Goals:**
- Add optional RPE (1–10) per set, stored on `SessionSet`
- Show average RPE per session in the exercise progression chart
- Allow adding and removing muscle group slots during an active session (temp only)
- Allow bulk-adding all slots from another training plan to the active session

**Non-Goals:**
- Permanent plan modification (no changes saved to `TrainingPlan`)
- RPE analytics beyond the progression chart (no aggregate reports)
- Exercise-variant display hints (depends on the separate `exercise-variants` change)
- Smart RPE defaults or suggestions

## Decisions

### RPE stored on SessionSet, not SessionEntry or TrainingSession
Per-set RPE is the most granular and useful representation — effort varies between sets. Storing it on the session or entry loses that detail. `SessionSet` gains `rpe?: number` (integer 1–10, undefined means not recorded). No schema migration needed since Dexie stores sets as serialized objects.

### RPE is always optional; no input required to submit a set
Adding a required field would break the one-hand, fast-logging flow. The RPE input is shown inline but never blocks submission. In quick mode, if RPE is entered, the same value is applied to all N sets being bulk-logged.

### Temp slots stored as `SessionEntry` with `isTemp: true`
Temp slots are full `SessionEntry` objects — they can have an exercise assigned and sets logged. Persisting them with the session gives Hans a complete history of what he actually did. The flag `isTemp: true` signals that the slot was not part of the original plan. `planSlotId` is `null` for temp slots.

**Alternative considered:** A separate `tempEntries` array on `TrainingSession` — rejected because it duplicates the rendering and use-case logic. One uniform collection is simpler.

### Temp slot removal only allowed when no sets are logged
Allowing removal of a slot with sets would silently discard logged work. Destructive actions require intent; if sets were logged, the user must remove the sets first.

### Add-plan creates temp slots for non-overlapping muscle groups only
When Hans adds a whole plan's slots, only muscle groups not already represented in the active session (by any existing entry, temp or original) are added. This avoids duplicates.

### RPE in progression: average RPE per session shown as colored dot overlay
Each data point on the weight chart gains a secondary RPE indicator — a colored dot (scale 1–10, green→red) below or above the weight point. A separate RPE-only line is not shown to avoid chart clutter. Sessions with no RPE data show no dot.

## Risks / Trade-offs

- **RPE input clutter** → Mitigation: keep the RPE input visually compact (small, labeled, not prominent). It should never feel mandatory.
- **Temp slot confusion** → Mitigation: visually distinguish temp slots with a subtle "temp" badge so Hans knows which slots are not from his plan.
- **Slot removal with sets** → Mitigation: disable the remove button when sets are logged; show a tooltip or micro-copy explaining why.
