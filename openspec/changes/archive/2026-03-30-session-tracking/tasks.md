## 1. Domain Layer

- [x] 1.1 Define `Set` value type (`weight: Weight`, `reps: number`)
- [x] 1.2 Define `SessionEntry` type (`muscleGroupId`, `exerciseDefinitionId?`, `sets: Set[]`)
- [x] 1.3 Define `TrainingSession` aggregate (`id`, `planId`, `planName`, `status`, `startedAt`, `completedAt?`, `entries: SessionEntry[]`)
- [x] 1.4 Define `ITrainingSessionRepository` interface (`save`, `getById`, `getActiveSession`, `listCompleted`)
- [x] 1.5 Implement `parseWeight(input: string): Weight` in `domain/shared/` and add unit tests

## 2. Infrastructure Layer

- [x] 2.1 Add `TrainingSessions` Dexie table to the database schema (single document per session)
- [x] 2.2 Implement `DexieTrainingSessionRepository` satisfying `ITrainingSessionRepository`

## 3. Application Layer

- [x] 3.1 Implement `startSession(planId)` use case — loads plan, creates in-progress session, saves
- [x] 3.2 Implement `assignVariation(sessionId, entryIndex, exerciseDefinitionId)` use case
- [x] 3.3 Implement `addSet(sessionId, entryIndex, weight: Weight, reps)` use case
- [x] 3.4 Implement `removeLastSet(sessionId, entryIndex)` use case
- [x] 3.5 Implement `completeSession(sessionId)` use case — sets status + completedAt, saves
- [x] 3.6 Implement `getLastVariationsForMuscleGroup(muscleGroupId, limit)` query — scans completed sessions newest-first
- [x] 3.7 Add unit tests for use cases and `getLastVariations` query

## 4. Presentation Layer

- [x] 4.1 Create `useActiveSession` hook (composition root: instantiates repos, exposes session state + mutations)
- [x] 4.2 Create `SessionStartScreen` — list of training plans with "Start" button; prevents starting if session in progress
- [x] 4.3 Create `ActiveSessionScreen` — shows all slots; each slot shows muscle group name, assigned exercise (or picker), and logged sets
- [x] 4.4 Create `VariationPicker` component — up to 4 recent variations as quick-pick chips + "Other…" to open full list
- [x] 4.5 Create `SetLogger` component — weight text input (short notation), reps input, Add button, list of logged sets with remove-last action
- [x] 4.6 Wire weight input to `parseWeight`; show inline error for invalid input
- [x] 4.7 Add "Finish workout" button to `ActiveSessionScreen` that calls `completeSession` and navigates back

## 5. Navigation & Integration

- [x] 5.1 Add Sessions route/tab to app navigation (entry point → `SessionStartScreen`)
- [x] 5.2 When `SessionStartScreen` detects an in-progress session, navigate directly to `ActiveSessionScreen`
- [x] 5.3 Verify end-to-end flow manually: start → pick variation → log 3 sets → complete → session persisted
