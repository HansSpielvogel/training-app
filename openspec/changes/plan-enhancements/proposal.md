## Why

Hans's training plans include muscle groups he may skip on a given day (marked "Evtl" in his paper system), but the app treats all slots as mandatory with no indication of what's skippable. Additionally, the exercise variation picker shows recent history but gives no guidance toward variety — Hans has to mentally track which variation is overdue.

## What Changes

- Add `optional: boolean` field to the `PlanSlot` domain entity (default `false`)
- Plan slot detail UI gains a toggle to mark a slot as optional ("Evtl")
- Smart rotation suggestion: for each slot's muscle group, inspect the last 5 completed sessions and recommend the variation used least that is not the most recently used; no suggestion if only 1 exercise exists for the muscle group or all candidates are equally used

## Capabilities

### New Capabilities

(none — both features extend existing capabilities)

### Modified Capabilities

- `training-plan-detail`: slot management gains a per-slot optional toggle
- `active-session`: pick-variation step gains a smart rotation suggestion above the recent-variations list

## Impact

- `domain/planning/PlanSlot.ts` — new `optional` field
- `infrastructure/planning/` — Dexie schema migration to persist the new field
- `presentation/planning/` — plan detail slot UI update (optional toggle)
- `application/sessions/` or `domain/sessions/` — rotation suggestion query (last 5 sessions, least-used analysis)
- `presentation/sessions/` — active session slot UI shows suggestion chip
