## Why

The app needs a foundational exercise library before any training plans or sessions can be created. Without `MuscleGroup` and `ExerciseDefinition` data, the user cannot pick what to train — this change unblocks all downstream MVP work.

## What Changes

- Introduce the `exercises/` bounded context with domain entities, repositories, and use cases
- Add UI screens to create, view, edit, and delete `MuscleGroup` and `ExerciseDefinition` records
- Persist all data locally via Dexie.js (IndexedDB)
- Support JSON export and import for backup and seeding

## Capabilities

### New Capabilities

- `muscle-groups`: CRUD management of muscle groups (the training targets, e.g. "Hintere Schulter / Rhomboids / Trapezius")
- `exercise-definitions`: CRUD management of exercise definitions tied to one or more muscle groups (e.g. "Reverse Fly Maschine", "Face Pulls")
- `exercise-library-import-export`: JSON export of the full exercise library and import for backup/seeding

### Modified Capabilities

## Impact

- New `src/domain/exercises/` — entities, value objects, repository interfaces
- New `src/application/exercises/` — use cases
- New `src/infrastructure/exercises/` — Dexie repository implementations
- New `src/presentation/exercises/` — React components and hooks
- Dexie schema version bumped to add `muscleGroups` and `exerciseDefinitions` tables
