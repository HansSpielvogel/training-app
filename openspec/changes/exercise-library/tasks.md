## 1. Domain — MuscleGroup

- [ ] 1.1 Define `MuscleGroup` entity (`id: string`, `name: string`) and domain errors (`DuplicateNameError`, `MuscleGroupInUseError`)
- [ ] 1.2 Define `IMuscleGroupRepository` interface (`list`, `findById`, `findByName`, `save`, `delete`)
- [ ] 1.3 Write and run unit tests for MuscleGroup domain errors and entity construction

## 2. Domain — ExerciseDefinition

- [ ] 2.1 Define `ExerciseDefinition` entity (`id: string`, `name: string`, `muscleGroupIds: string[]`) and domain errors (`NoMuscleGroupError`)
- [ ] 2.2 Define `IExerciseDefinitionRepository` interface (`list`, `listByMuscleGroup`, `findById`, `findByName`, `save`, `delete`)
- [ ] 2.3 Write and run unit tests for ExerciseDefinition entity construction and validation

## 3. Dexie Schema

- [ ] 3.1 Bump Dexie schema version, add `muscleGroups: "id, name"` and `exerciseDefinitions: "id, name, *muscleGroupIds"` tables
- [ ] 3.2 Run existing tests to verify schema migration doesn't break anything

## 4. Infrastructure — Repositories

- [ ] 4.1 Implement `DexieMuscleGroupRepository`
- [ ] 4.2 Write and run integration tests for `DexieMuscleGroupRepository` (CRUD + findByName)
- [ ] 4.3 Implement `DexieExerciseDefinitionRepository`
- [ ] 4.4 Write and run integration tests for `DexieExerciseDefinitionRepository` (CRUD + listByMuscleGroup)

## 5. Application — MuscleGroup Use Cases

- [ ] 5.1 Implement `listMuscleGroups` use case + run tests
- [ ] 5.2 Implement `createMuscleGroup` use case (unique-name check) + run tests
- [ ] 5.3 Implement `renameMuscleGroup` use case (unique-name check) + run tests
- [ ] 5.4 Implement `deleteMuscleGroup` use case (blocks if referenced) + run tests

## 6. Application — ExerciseDefinition Use Cases

- [ ] 6.1 Implement `listExerciseDefinitions` use case (optional muscle group filter) + run tests
- [ ] 6.2 Implement `createExerciseDefinition` use case (unique-name check, min 1 muscle group) + run tests
- [ ] 6.3 Implement `editExerciseDefinition` use case + run tests
- [ ] 6.4 Implement `deleteExerciseDefinition` use case + run tests

## 7. Application — Import/Export Use Cases

- [ ] 7.1 Implement `exportExerciseLibrary` use case (returns serialisable JSON object) + run tests
- [ ] 7.2 Implement `importExerciseLibrary` use case (validates structure, replaces tables) + run tests

## 8. Presentation — Muscle Groups

- [ ] 8.1 Implement `useMuscleGroups` hook (list, create, rename, delete)
- [ ] 8.2 Implement `MuscleGroupList` component (empty state, alphabetical list)
- [ ] 8.3 Implement create/rename inline form with validation feedback
- [ ] 8.4 Implement delete confirmation (block with error message if exercises reference it)
- [ ] 8.5 Wire up `/muscle-groups` route and add to app navigation — **ask Hans to try in browser**

## 9. Presentation — Exercise Definitions

- [ ] 9.1 Implement `useExerciseDefinitions` hook (list, filter, create, edit, delete)
- [ ] 9.2 Implement `ExerciseDefinitionList` component with muscle group filter
- [ ] 9.3 Implement create/edit form (name + multi-select muscle groups) with validation feedback
- [ ] 9.4 Implement delete confirmation
- [ ] 9.5 Wire up `/exercise-definitions` route and add to app navigation — **ask Hans to try in browser**

## 10. Presentation — Import/Export

- [ ] 10.1 Implement export button (triggers JSON file download)
- [ ] 10.2 Implement import button (file picker → confirmation dialog → import)
- [ ] 10.3 Surface export/import on the exercise library management screen — **ask Hans to try in browser**

## 11. Final Checks

- [ ] 11.1 Run full Vitest suite — all tests green
- [ ] 11.2 Run Playwright E2E smoke test
- [ ] 11.3 Commit and push
