## Context

The exercise library is live. The next phase introduces training plans — the structure Hans uses to decide what muscle groups to train each session. Plans are static named collections of ordered muscle group slots. Variation selection (which specific exercise) happens at training time, not at plan definition time.

The architecture follows the DDD layering already established by the exercise library change.

## Goals / Non-Goals

**Goals:**
- Model `TrainingPlan` and `PlanSlot` in the `planning` bounded context
- Persist plans in Dexie (same IndexedDB database)
- Seed Hans's 5 plans on first launch
- List and detail UI for browsing and editing plans and their slots

**Non-Goals:**
- Optional slots ("Evtl") — Phase 2
- Session creation from a plan — session-tracking change
- Rotation logic or smart suggestions — Phase 2

## Decisions

### Domain model

`TrainingPlan`: `{ id, name, createdAt }`
`PlanSlot`: `{ id, planId, muscleGroupId, order }` — no `optional` flag in Phase 1.

Slots are a flat list sorted by `order` (integer). Reordering updates `order` values. Storing `planId` on each slot (rather than embedding slots in the plan document) keeps Dexie queries straightforward and lets slots be updated individually without rewriting the whole plan.

**Alternative considered**: Embed slots as a JSON array on the plan row. Rejected because slot-level edits (add/remove/reorder) would require read-modify-write of the whole plan, increasing the chance of partial-write bugs.

### Seed strategy

Seed file at `openspec/seed/training-plans.json`. A use case (`SeedTrainingPlansUseCase`) runs once on app boot if the `trainingPlans` table is empty. It reads the seed file (bundled as a static import) and inserts plans + slots in a single Dexie transaction.

Exercise library seeding already uses this pattern — consistent with existing code.

### No "optional" slot flag in Phase 1

The domain model omits `optional: boolean` on `PlanSlot`. This keeps the model simple. The "Evtl" concept in Hans's notes will be added in Phase 2 as a separate domain change. There is no migration cost — adding a nullable column to Dexie is a minor schema version bump.

## Risks / Trade-offs

- [Reorder UX on mobile] Drag-and-drop is complex on iPhone Safari → use up/down arrow buttons per slot instead. Simple, reliable, no library needed.
- [Seed runs on every cold start] Guard with an empty-table check; idempotent by design.

## Migration Plan

New Dexie tables (`trainingPlans`, `planSlots`) added in the next schema version increment. No existing data is affected.
