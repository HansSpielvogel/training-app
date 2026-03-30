---
name: Domain Model
description: Core domain entities, aggregates, and value objects for the training app
type: project
---

## Bounded Contexts

**Exercise Library** — now in code (`src/domain/exercises/`). See `MuscleGroup.ts` and `ExerciseDefinition.ts`.

**Planning** (supporting)
- `TrainingPlan`: named collection of PlanSlots (Hans currently has 4: "Oberkörper-Fokus A", "Oberkörper-Fokus B", "Beine+Core", "Nur Core")
- `PlanSlot`: references a **MuscleGroup** (not a specific exercise — variation is chosen at training time)

**Session Tracking** (core domain)
- `TrainingSession`: one workout, created from a plan but can deviate
- `SessionEntry`: which `ExerciseDefinition` was used, plus sets
- `Set`: weight (typed), reps, optional RPE (1–10 scale)

## Weight Value Object

```typescript
type Weight =
  | { kind: 'single';    value: number }           // Langhantel: 80kg
  | { kind: 'bilateral'; perSide: number }          // Kabelzug: 2×15kg
  | { kind: 'stacked';   base: number; added: number } // Machine: 15+1.25kg
// Phase 2:
// | { kind: 'asymmetric'; left: number; right: number }
```

The `stacked` type reflects Hans's notation for machine stacks with added plates (e.g., "15+1.25") — avoids mental arithmetic at the machine.

## Session Modification (Option C)

During a training session, Hans can add or remove MuscleGroups from the plan:
- **Temporary**: for today's session only (e.g., equipment unavailable, time constraint)
- **Permanent**: saves the change back to the TrainingPlan for future sessions

Both options must be available at the moment of add/remove.
