---
name: Change progress
description: Which OpenSpec changes are done and what's next
type: project
---

`app-foundation` ✓ archived. `exercise-library` ✓ implemented (pending archive).

**Next change:** `training-plans`

Full sequence: `app-foundation` ✓ → `exercise-library` ✓ → `training-plans` → `session-tracking` → `analytics`

**Seeding done:** `openspec/seed/exercise-library.json` — 16 muscle groups, 53 exercises. Import via UI before or during training-plans development.

**Why:** One change per bounded context per the change strategy in CLAUDE.md.

**How to apply:** Start with `/opsx:archive` for exercise-library, then `/opsx:propose` for training-plans.
