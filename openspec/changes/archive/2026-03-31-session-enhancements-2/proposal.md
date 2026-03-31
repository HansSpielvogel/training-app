## Why

Three small friction points in the active session flow make the app harder to use one-handed at the machine: the RPE input has no range indicator (non-obvious scale), plan-defined slots cannot be removed mid-session (no way to skip a muscle group), and entering stacked weights requires `+` notation that iOS keyboards don't expose.

## What Changes

- RPE input gets a visible `(1–10)` range hint so the scale is immediately clear
- Plan slots can be removed from the current active session without modifying the underlying training plan
- An optional "added weight" field is shown next to the base weight input, enabling stacked weight entry without special notation

## Capabilities

### New Capabilities

- `rpe-scale-hint`: RPE input displays a 1–10 scale indicator so users understand the valid range without prior knowledge
- `session-plan-slot-removal`: User can remove a plan-defined slot from the current active session; the removal is not persisted to the plan
- `stacked-weight-entry`: A separate optional "added weight" field in the set logger allows stacked weight input without relying on `+` notation

### Modified Capabilities

- `active-session`: Weight input requirement updated — the stacked `B+A` notation is supplemented by a dedicated UI field; plan-slot removal added as a session-level action

## Impact

- `presentation/sessions/SetLogger.tsx` — RPE hint and added-weight field
- `presentation/sessions/ActiveSessionScreen.tsx` / `EntryRow.tsx` — plan-slot removal action
- `application/sessions/addSet.ts` — may need to accept separate `added` field
- `domain/shared/Weight.ts` — no structural change needed (stacked weight type already exists)
- `openspec/specs/active-session/spec.md` — delta for weight input and slot removal requirements
