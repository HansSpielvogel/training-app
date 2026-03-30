## Context

The exercise library and training plans are fully implemented. The `sessions` bounded context exists as an empty placeholder. This change makes the app usable: log sets during a workout, track which exercise variation was used per slot, and complete the session.

The app is offline-first, local-only (IndexedDB via Dexie), used one-handed on an iPhone at the gym.

## Goals / Non-Goals

**Goals:**
- Full session lifecycle: start from plan → log sets → complete
- Variation picker per slot: show last 4 used variations from history, allow selecting any exercise for the muscle group
- Weight input that handles all three Weight kinds via short notation (e.g. "2×15", "15+1.25")
- Persist sessions in Dexie; query history for variation recency

**Non-Goals:**
- RPE logging (Phase 2)
- Session modification during training — add/remove muscle group slots (Phase 2)
- Smart rotation suggestions (Phase 2)
- Session history list/view (Phase 2)
- Abandon active session from `ActiveSessionScreen` with confirmation prompt — data loss warning (Phase 2)
- Quick-sets mode per slot: enter weight+reps once → logs N identical sets; N is defined on the ExerciseDefinition (edited in the exercises screen, default 3); toggle to single-set mode per slot during a session for when sets differ (Phase 2)

## Decisions

### 1. TrainingSession stored as a single document

Sessions are stored as one Dexie record with embedded `entries[]` and `sets[]` arrays. No separate tables per entry or set.

**Why:** Gym sessions are small (5–8 exercises, 3–5 sets each). Embedding avoids multi-table joins and simplifies the offline-first model. Querying last-used variations means scanning a handful of completed sessions — acceptable at this scale.

**Alternative considered:** Normalized tables (sessions, entries, sets). Rejected: unnecessary complexity for local-only storage with small data volumes.

### 2. Variation history: scan completed sessions

`getLastVariationsForMuscleGroup(muscleGroupId, limit)` scans completed sessions newest-first, collecting distinct `ExerciseDefinition` IDs used for that muscle group until `limit` is reached.

**Why:** No denormalized index needed. The number of completed sessions grows slowly (1–2 per day). A simple linear scan is fast enough indefinitely.

### 3. Active session lives in a React hook (composition root)

The active session state (current session + mutations) is managed by a `useActiveSession` hook, consistent with the existing composition root pattern (hooks instantiate repositories directly).

**Why:** No global state manager or context needed. The session UI is a self-contained flow that mounts, operates, and unmounts. A single hook is sufficient.

### 4. Weight input: parse short notation to Weight type

A text input accepts human notation and parses it:
- `"2×15"` or `"2x15"` → `{ kind: 'bilateral', perSide: 15 }`
- `"15+1.25"` → `{ kind: 'stacked', base: 15, added: 1.25 }`
- `"22.5"` → `{ kind: 'single', value: 22.5 }`

**Why:** Hans's preferred notation matches the domain model. A dedicated parser keeps parsing logic in the domain layer and out of the UI.

### 5. Set editing: in-place update by index

Sets within an entry are identified by their position index. A set can be edited or removed by index — no separate Set ID needed.

**Why:** Sets are always rendered in order; index is stable within a session view. Adding IDs would be unnecessary overhead for a list that is never reordered.

## Risks / Trade-offs

- **Embedded document grows if a session is long** → Acceptable: even a 2-hour session produces <2 KB of data.
- **No optimistic locking** → Only one device writes; no concurrent edits possible in the offline-first model.
- **Weight parser edge cases** → Covered by unit tests; invalid input shows a validation error and blocks submission.
