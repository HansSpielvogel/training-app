## 1. Domain

- [x] 1.1 Create `TrainingPlan` entity (`src/domain/planning/TrainingPlan.ts`) with `id`, `name`, `createdAt`
- [x] 1.2 Create `PlanSlot` entity (`src/domain/planning/PlanSlot.ts`) with `id`, `planId`, `muscleGroupId`, `order`
- [x] 1.3 Define `ITrainingPlanRepository` interface in `src/domain/planning/ITrainingPlanRepository.ts`

## 2. Infrastructure

- [x] 2.1 Add `trainingPlans` and `planSlots` tables to the Dexie schema (version bump in `src/infrastructure/db.ts`)
- [x] 2.2 Implement `DexieTrainingPlanRepository` in `src/infrastructure/planning/DexieTrainingPlanRepository.ts`

## 3. Seed Data

- [x] 3.1 Create `openspec/seed/training-plans.json` with Hans's 5 plans and their ordered slots (muscle group IDs from exercise-library seed)
- [x] 3.2 Implement `SeedTrainingPlansUseCase` in `src/application/planning/SeedTrainingPlansUseCase.ts` (no-op if plans table is non-empty)

## 4. Application Use Cases

- [x] 4.1 `ListTrainingPlansUseCase` — returns all plans with slot count
- [x] 4.2 `CreateTrainingPlanUseCase` — validates unique name, persists
- [x] 4.3 `RenameTrainingPlanUseCase` — validates unique name (excluding self), persists
- [x] 4.4 `DeleteTrainingPlanUseCase` — deletes plan and all its slots
- [x] 4.5 `GetTrainingPlanUseCase` — returns plan with ordered slots (includes muscle group name per slot)
- [x] 4.6 `AddPlanSlotUseCase` — appends slot at end of order
- [x] 4.7 `RemovePlanSlotUseCase` — removes slot; no reorder needed
- [x] 4.8 `MovePlanSlotUseCase` — swaps `order` with adjacent slot (up or down)

## 5. Presentation

- [x] 5.1 Create `useTrainingPlans` hook (`src/presentation/planning/useTrainingPlans.ts`) — wraps list, create, rename, delete use cases
- [x] 5.2 Create `useTrainingPlanDetail` hook (`src/presentation/planning/useTrainingPlanDetail.ts`) — wraps get, add slot, remove slot, move slot use cases
- [x] 5.3 Build `TrainingPlansScreen` (`src/presentation/planning/TrainingPlansScreen.tsx`) — list with create/rename/delete actions
- [x] 5.4 Build `TrainingPlanDetailScreen` (`src/presentation/planning/TrainingPlanDetailScreen.tsx`) — slot list with add/remove/move actions
- [x] 5.5 Add routes for training plans screens in the app router
- [x] 5.6 Wire `SeedTrainingPlansUseCase` into app boot (alongside existing exercise library seed)

## 6. Tests

- [x] 6.1 Unit tests for domain entities (validation rules)
- [x] 6.2 Integration tests for `DexieTrainingPlanRepository`
- [x] 6.3 Integration tests for all use cases (create, rename, delete, add/remove/move slot, seed)
