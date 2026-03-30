## 1. Domain — MuscleGroup

- [x] 1.1 Define `MuscleGroup` entity (`id: string`, `name: string`) and domain errors (`DuplicateNameError`, `MuscleGroupInUseError`)
- [x] 1.2 Define `IMuscleGroupRepository` interface (`list`, `findById`, `findByName`, `save`, `delete`)
- [x] 1.3 Write and run unit tests for MuscleGroup domain errors and entity construction

## 2. Domain — ExerciseDefinition

- [x] 2.1 Define `ExerciseDefinition` entity (`id: string`, `name: string`, `muscleGroupIds: string[]`) and domain errors (`NoMuscleGroupError`)
- [x] 2.2 Define `IExerciseDefinitionRepository` interface (`list`, `listByMuscleGroup`, `findById`, `findByName`, `save`, `delete`)
- [x] 2.3 Write and run unit tests for ExerciseDefinition entity construction and validation

## 3. Dexie Schema

- [x] 3.1 Bump Dexie schema version, add `muscleGroups: "id, name"` and `exerciseDefinitions: "id, name, *muscleGroupIds"` tables
- [x] 3.2 Run existing tests to verify schema migration doesn't break anything

## 4. Infrastructure — Repositories

- [x] 4.1 Implement `DexieMuscleGroupRepository`
- [x] 4.2 Write and run integration tests for `DexieMuscleGroupRepository` (CRUD + findByName)
- [x] 4.3 Implement `DexieExerciseDefinitionRepository`
- [x] 4.4 Write and run integration tests for `DexieExerciseDefinitionRepository` (CRUD + listByMuscleGroup)

## 5. Application — MuscleGroup Use Cases

- [x] 5.1 Implement `listMuscleGroups` use case + run tests
- [x] 5.2 Implement `createMuscleGroup` use case (unique-name check) + run tests
- [x] 5.3 Implement `renameMuscleGroup` use case (unique-name check) + run tests
- [x] 5.4 Implement `deleteMuscleGroup` use case (blocks if referenced) + run tests

## 6. Application — ExerciseDefinition Use Cases

- [x] 6.1 Implement `listExerciseDefinitions` use case (optional muscle group filter) + run tests
- [x] 6.2 Implement `createExerciseDefinition` use case (unique-name check, min 1 muscle group) + run tests
- [x] 6.3 Implement `editExerciseDefinition` use case + run tests
- [x] 6.4 Implement `deleteExerciseDefinition` use case + run tests

## 7. Application — Import/Export Use Cases

- [x] 7.1 Implement `exportExerciseLibrary` use case (returns serialisable JSON object) + run tests
- [x] 7.2 Implement `importExerciseLibrary` use case (validates structure, replaces tables) + run tests

## 8. Presentation — Muscle Groups

- [x] 8.1 Implement `useMuscleGroups` hook (list, create, rename, delete)
- [x] 8.2 Implement `MuscleGroupList` component (empty state, alphabetical list)
- [x] 8.3 Implement create/rename inline form with validation feedback
- [x] 8.4 Implement delete confirmation (block with error message if exercises reference it)
- [x] 8.5 Wire up `/muscle-groups` route and add to app navigation — **ask Hans to try in browser**

## 9. Presentation — Exercise Definitions

- [x] 9.1 Implement `useExerciseDefinitions` hook (list, filter, create, edit, delete)
- [x] 9.2 Implement `ExerciseDefinitionList` component with muscle group filter
- [x] 9.3 Implement create/edit form (name + multi-select muscle groups) with validation feedback
- [x] 9.4 Implement delete confirmation
- [x] 9.5 Wire up `/exercise-definitions` route and add to app navigation — **ask Hans to try in browser**

## 10. Presentation — Import/Export

- [x] 10.1 Implement export button (triggers JSON file download)
- [x] 10.2 Implement import button (file picker → confirmation dialog → import)
- [x] 10.3 Surface export/import on the exercise library management screen — **ask Hans to try in browser**

## 11. Final Checks

- [x] 11.1 Run full Vitest suite — all tests green
- [x] 11.2 Run Playwright E2E smoke test
- [ ] 11.3 Commit and push
