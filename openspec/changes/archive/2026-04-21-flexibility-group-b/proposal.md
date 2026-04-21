## Why

During a workout, Hans needs to adapt on the fly — pre-filling last session's weights saves time at the machine, reordering entries lets him adjust to equipment availability, and swiping away a slot is faster than hunting for a remove button.

## What Changes

- Add a "preset from last" button inside each exercise logger that pre-fills weight, reps, and RPE from the most recent session for that exercise
- Add long-press drag-to-reorder for session entries in the active session view (session-only, does not affect the training plan)
- Replace the existing tap-based plan slot removal with a swipe-left gesture that reveals a red trash action

## Capabilities

### New Capabilities

- `preset-from-last`: Pre-fill the weight/reps/RPE input fields from the most recent prior completed session for the currently assigned exercise. Button only appears when prior data exists.
- `session-entry-reorder`: Long-press + drag up/down to reorder session entries during an active session. Order change is session-scoped only.

### Modified Capabilities

- `session-plan-slot-removal`: Replace tap-based remove action with swipe-left gesture revealing a red trash indicator; existing behavior (ephemeral, plan unchanged) is unchanged.

## Impact

- `presentation/` — active session components: exercise logger, entry list
- `application/sessions/` — reorder use case (update entry order in-memory and persist to IndexedDB)
- No domain model changes required; `SessionEntry` order is already position-based in the entry array
