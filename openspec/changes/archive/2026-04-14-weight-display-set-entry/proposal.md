## Why

Group B closes four active-session rough edges discovered during real workouts: a persistent iOS zoom bug, misleading "Last:" weight display for stacked weights, missing set prefill in individual mode, and a seed data defect causing wrong exercises to surface under the Bauch muscle group.

## What Changes

- **Zoom bug fix**: ensure every `<input>` across the app renders at ≥16px font size so iOS Safari never zooms on focus (spec already mandates this; implementation gap remains)
- **"Last:" weight display**: in the active-session slot header, show stacked weight components separately (`Weight +add`) instead of summed; for Langhantel (LH) exercises prefix `LH` and show only the added weight (the 20 kg bar is implicit)
- **Individual mode set prefill**: when the user adds a new set in individual mode, prefill weight and reps with the values from the previous set
- **Bauch seed data fix**: remove "Bauch Seite" exercises from the Bauch muscle group in the seed data; they belong only to their own group

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `active-session`: two new display/UX requirements — "Last:" stacked weight formatting and individual-mode prefill behaviour

## Impact

- `src/presentation/` — set-logger inputs and the "Last:" weight display component
- `openspec/seed/exercise-library.json` — Bauch / Bauch Seite exercise assignments
- Global CSS — audit to confirm 16px rule covers all input types app-wide
