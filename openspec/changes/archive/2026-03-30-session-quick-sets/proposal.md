## Why

Logging sets one by one is friction when all sets are identical. With `defaultSets` now on `ExerciseDefinition`, the session UI can let the user enter weight + reps once and log all N sets in a single tap. Individual-set mode remains available for days when sets differ.

## What Changes

- `SetLogger` gains a **quick mode** (default): one weight + reps input, a "Log N sets" button that adds N identical sets at once
- A toggle button on `SetLogger` switches to **individual mode** (current behaviour: add one set at a time)
- `defaultSets` is threaded from `ActiveSessionScreen` → `EntryRow` → `SetLogger`

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `active-session`: set-logging UI now supports quick mode and individual mode per slot

## Impact

- `src/presentation/sessions/SetLogger.tsx` — add mode toggle + quick-log button
- `src/presentation/sessions/EntryRow.tsx` — accept and forward `defaultSets`
- `src/presentation/sessions/ActiveSessionScreen.tsx` — derive `defaultSets` from loaded exercise and pass to `EntryRow`
