---
name: Domain Model
description: Core domain entities, aggregates, and value objects for the training app
type: project
---

## Bounded Contexts

**Exercise Library** — now in code (`src/domain/exercises/`). See `MuscleGroup.ts` and `ExerciseDefinition.ts`.
- `ExerciseDefinition` has optional `notes?: string` for machine setup info (e.g. seat height).

**Planning** (supporting)
- `TrainingPlan`: named collection of PlanSlots (Hans has 5: "Oberkörper A", "Oberkörper B", "Core", "Beine & Po", "Core+Beine")
- `PlanSlot`: references a **MuscleGroup** (not a specific exercise — variation is chosen at training time)
- Optional slots (marked "Evtl" in Hans's concept) → Phase 2 feature

**Session Tracking** (core domain)
- `TrainingSession`: one workout, created from a plan but can deviate
- `SessionEntry`: which `ExerciseDefinition` was used, plus sets
- `Set`: weight (typed), reps, optional RPE (1–10 scale)

## Weight Value Object

```typescript
type Weight =
  | { kind: 'single';    value: number }           // fixed weight, incl. negative (e.g. -12.5 = assisted pullup)
  | { kind: 'bilateral'; perSide: number }          // cable (2×15kg) OR barbell plates per side (2×24kg); exercise name disambiguates
  | { kind: 'stacked';   base: number; added: number } // machine stack + added plates (e.g. 31.5+2.3)
// Phase 2:
// | { kind: 'asymmetric'; left: number; right: number }
```

The `stacked` type reflects Hans's notation for machine stacks with added plates (e.g., "31.5+2.3") — avoids mental arithmetic at the machine.
Barbell exercises use `bilateral` (perSide = plates per side); exercise name makes it clear it's a barbell.

## Session Modification (Option C)

During a training session, Hans can add or remove MuscleGroups from the plan:
- **Temporary**: for today's session only (e.g., equipment unavailable, time constraint)
- **Permanent**: saves the change back to the TrainingPlan for future sessions

Both options must be available at the moment of add/remove.
