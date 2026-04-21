## Why

Two high-friction moments during workouts: not knowing how far through a session you are, and struggling to find the right exercise in the Progression tab as the library grows. Both slow Hans down at the machine.

## What Changes

- Active session view gains a compact progress bar below the session title showing completed slots vs total (e.g. "3 of 6 done")
- Progression tab exercise list gains muscle-group filter chips (or a search input) so Hans can jump directly to the relevant exercise without scrolling the full alphabetical list

## Capabilities

### New Capabilities
- `session-progress-indicator`: Compact progress bar in the active session showing how many plan slots have been completed out of the total
- `progression-exercise-filter`: Muscle-group filter / search on the Progression tab exercise list

### Modified Capabilities
- `active-session`: Progress indicator UI added to session header area
- `exercise-progression`: Exercise list now supports filtering by muscle group

## Impact

- `presentation/` — ActiveSession component gets a progress bar; Progression tab exercise list gets filter chips
- No domain or application layer changes required; slot completion state already exists in session context
- No new data storage or API changes
