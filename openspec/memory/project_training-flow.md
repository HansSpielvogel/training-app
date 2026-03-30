---
name: Training Session Flow
description: How Hans uses the app during a workout — plan selection, variation picking, logging
type: project
---

## Starting a Session

1. Select a training plan from the list — no further configuration required to start
2. Plan shows its MuscleGroup slots

## Per Exercise Slot

For each PlanSlot (MuscleGroup target):
- Show the **last ~4 variations** used for this muscle group (from session history)
- App **suggests** which variation to do (smart rotation — Phase 2 improvement)
- Hans can **choose a different variation** from a dropdown of all available ExerciseDefinitions for this MuscleGroup
- Hans can **create a new ExerciseDefinition on-the-fly** (e.g., at a different gym with different equipment, or all machines are taken)

## Session Flexibility

- Exercises can be done in **any order** (not forced to follow plan sequence)
- **Skipping exercises is allowed** (shorter training day)
- MuscleGroups can be **added or removed** during the session (temp or permanent — see domain model memory)

## Logging a Set

Per set: weight (using appropriate Weight kind), reps, optional RPE.
Weight notation the user prefers: bilateral as "2×15", stacked as "15+1.25".
