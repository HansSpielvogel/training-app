## Context

`SetLogger` is a pure presentation component. `defaultSets` now lives on `ExerciseDefinition`; it reaches `SetLogger` via `ActiveSessionScreen` → `EntryRow` → `SetLogger`. No domain or application layer changes are needed.

## Goals / Non-Goals

**Goals:**
- Quick mode: enter weight + reps once, tap "Log N sets" → adds N identical sets
- Individual mode: tap one set at a time (existing behaviour)
- Toggle between modes per slot; quick mode is the default

**Non-Goals:**
- Persisting the chosen mode across sessions
- Changing the domain model

## Decisions

**Mode state lives in SetLogger**
It is purely a UI concern. No need to lift it higher.

**`defaultSets` prop with fallback**
`SetLogger` receives `defaultSets?: number` and uses `defaultSets ?? DEFAULT_SET_COUNT` internally. `DEFAULT_SET_COUNT` is imported from the domain.

**`ActiveSessionScreen` derives `defaultSets` from already-loaded exercise data**
`exerciseDataMap[i].all` already contains `ExerciseDefinition[]` with the new `defaultSets` field. No extra fetch needed.

## Risks / Trade-offs

- [Risk] User switches to quick mode mid-entry after adding some individual sets → Mitigation: mode toggle works at any time; already-logged sets are unaffected.
