## Context

The `exercise-library` change introduces the first domain bounded context: `exercises/`. It establishes `MuscleGroup` and `ExerciseDefinition` as foundational entities that downstream bounded contexts (planning, sessions) will reference by ID. The `app-foundation` change already provides the Dexie.js scaffold, DDD folder structure, and testing infrastructure — this change builds within it.

## Goals / Non-Goals

**Goals:**
- Define `MuscleGroup` and `ExerciseDefinition` domain entities, repository interfaces, and use cases
- Persist both entities in Dexie.js (bump schema version)
- Deliver CRUD UI for both entities
- Support JSON export/import for backup and initial seeding

**Non-Goals:**
- Training plans, session tracking, or variation rotation logic
- Remote sync or backend
- Analytics or history views
- On-the-fly ExerciseDefinition creation during a session (session-tracking concern)

## Decisions

### 1. Many-to-many: ExerciseDefinition stores muscleGroupIds[]

`ExerciseDefinition` holds `muscleGroupIds: string[]`. Exercises can train multiple muscle groups (e.g., rows hit both back and biceps). A flat array avoids a join table while keeping the domain model portable.

_Alternative_: single `muscleGroupId` — too restrictive; join table — unnecessary complexity for a local-only app.

### 2. String UUIDs for entity IDs

IDs are `string` (via `crypto.randomUUID()`) rather than Dexie auto-increment integers. UUID-keyed entities survive JSON export/import without collision and keep the domain model free of storage concerns.

_Alternative_: Dexie `++id` — leaks Dexie semantics into domain; `nanoid` — extra dependency.

### 3. Deletion constraint enforced in application layer

Deleting a `MuscleGroup` is blocked when any `ExerciseDefinition` references it. The use case checks before calling the repository and returns a domain error if blocked.

_Alternative_: cascade delete — silently removes exercises; soft delete — adds complexity not needed yet.

### 4. Import replaces the entire library

JSON import clears both tables and inserts all imported records. Safest strategy for seeding from Hans's existing text file and for restoring a backup.

_Alternative_: merge/upsert — ID collision handling adds complexity; additive import — can't correct mistakes or seed a clean state.

### 5. Dexie schema version bump

New tables added at the next version (e.g., `v2`):
- `muscleGroups: "id, name"`
- `exerciseDefinitions: "id, name, *muscleGroupIds"`

The multiEntry index on `muscleGroupIds` allows efficient filtering by muscle group.

## Risks / Trade-offs

- **Destructive import** → Mitigation: confirmation dialog before import; surface export button next to import.
- **No undo for delete** → Mitigation: confirmation dialog before delete.
- **Duplicate names not constrained at DB level** → Mitigation: application use cases check for existing names before create/rename and return a domain error on duplicate.
