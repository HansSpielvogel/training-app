---
name: Multi-Sport Extensibility Strategy
description: How the domain is designed to support other sports (e.g., running) in the future
type: project
---

**Decision**: Do NOT make the Exercise model generic. Extensibility comes from the bounded context architecture, not from abstract base classes.

## Pattern

```
Sport-agnostic core:
  Athlete           (the user — shared)
  SessionSummary    (date, sport type, metadata — read by Analytics)

Strength Training (current bounded context):
  MuscleGroup, ExerciseDefinition, TrainingPlan, Set, Weight
  → implements SessionSummary

Running (future bounded context):
  Route, Interval { duration, pace }, RunPlan { intervals[] }
  Segment { time, speed }
  → implements SessionSummary
```

Analytics reads from `SessionSummary` only — sport-agnostic. Each sport provides its own implementation.

**Why:** Adding running means a new bounded context with its own domain model — no rewrite of the strength training domain. The extensibility point is the session abstraction layer, not individual entities.

**How to apply:** When building session-tracking or analytics, define SessionSummary as an interface in a shared domain module. Strength training entities implement it. Do not add `sportType` enums or generic fields to ExerciseDefinition.
