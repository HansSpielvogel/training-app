## Why

The core session loop is working but missing two p2 features from the roadmap: RPE tracking gives Hans effort context when reviewing history, and the ability to add/remove muscle group slots mid-session makes it possible to adapt training on the fly without aborting and restarting.

## What Changes

- `SessionSet` gains an optional `rpe` field (integer 1–10)
- The set logger UI adds an optional RPE input alongside weight and reps
- The exercise progression view incorporates RPE as a secondary data point
- During an active session, Hans can add a new muscle group slot (temp — not saved to the plan)
- Hans can also remove any slot that hasn't had sets logged yet
- Hans can add an entire training plan's slots to the active session on the fly (temp)

## Capabilities

### New Capabilities
- `rpe-tracking`: Optional RPE (1–10) per logged set; displayed in exercise progression view alongside weight
- `session-slot-management`: Add/remove muscle group slots during an active session (temp only, not persisted to the plan); add all slots from another training plan

### Modified Capabilities
- `active-session`: Session entry model extended — temp slots can be added beyond the initial PlanSlot set
- `exercise-progression`: RPE data shown alongside the max-weight chart

## Impact

- `domain/sessions/` — `SessionSet` value object gains optional `rpe: number | undefined`
- `application/sessions/` — use cases for adding/removing temp slots; RPE passed through to set logging
- `infrastructure/sessions/` — Dexie schema unchanged (rpe stored as part of set object)
- `presentation/` — session slot list gets add/remove controls; set logger gets RPE input; progression chart gets RPE overlay
