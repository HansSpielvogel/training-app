## 1. Domain

- [x] 1.1 Add `DEFAULT_SET_COUNT = 3` constant and `defaultSets?: number` field to `ExerciseDefinition` interface in `src/domain/exercises/ExerciseDefinition.ts`
- [x] 1.2 Update `createExerciseDefinition` factory to accept `defaultSets?: number`, validate it is >= 1 when provided, and include it in the returned object

## 2. Application

- [x] 2.1 Update `createExerciseDefinition` use case (`src/application/exercises/createExerciseDefinition.ts`) to accept and forward `defaultSets?: number`
- [x] 2.2 Update `editExerciseDefinition` use case (`src/application/exercises/editExerciseDefinition.ts`) to accept and forward `defaultSets?: number`, preserving the existing value when not supplied

## 3. Presentation

- [x] 3.1 Update `ExerciseForm` (`src/presentation/exercises/ExerciseForm.tsx`) to add a `defaultSets` numeric input (min 1, default 3); pass the value through `onSubmit`
- [x] 3.2 Update `ExerciseDefinitionsPage` to pass `defaultSets` from the form through `handleCreate` and `handleUpdate` to the hook
- [x] 3.3 Update `useExerciseDefinitions` hook to forward `defaultSets` in `create` and `update` callbacks

## 4. Tests

- [x] 4.1 Update `ExerciseDefinition` domain tests to cover `defaultSets` validation (valid value, value < 1 rejected)
- [x] 4.2 Update application-layer exercise definition tests to cover `defaultSets` round-trip through create and edit
