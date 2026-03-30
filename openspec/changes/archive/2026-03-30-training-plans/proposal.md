## Why

The exercise library is complete, but the app has no way to define or store what Hans trains — his 5 named training plans with their muscle group slots. Without training plans, the session-tracking phase cannot begin.

## What Changes

- Add the `TrainingPlan` and `PlanSlot` domain entities under the `planning` bounded context
- Implement Dexie-backed repository for persisting training plans
- Seed Hans's 5 training plans on first run (Oberkörper A, Oberkörper B, Core, Beine & Po, Core+Beine)
- Add a Training Plans UI: list view + plan detail showing slots in order
- Allow creating, editing, and deleting plans and their slots

## Capabilities

### New Capabilities

- `training-plans`: CRUD for named training plans with ordered muscle group slots; seeded with Hans's 5 plans
- `training-plan-detail`: View and edit the slots within a training plan (muscle group, order, optional flag)

### Modified Capabilities

<!-- none -->

## Impact

- New domain entities: `TrainingPlan`, `PlanSlot` under `src/domain/planning/`
- New use cases under `src/application/planning/`
- New Dexie table in `src/infrastructure/db.ts`
- New React screens under `src/presentation/planning/`
- Seed file: `openspec/seed/training-plans.json`
- No breaking changes to the exercise library domain
