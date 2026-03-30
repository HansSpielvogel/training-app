---
name: Change progress
description: Which OpenSpec changes are done and what's next
type: project
---

`app-foundation` ✓ archived. `exercise-library` ✓ implemented (pending archive).

**Next change:** `training-plans`

Full sequence: `app-foundation` ✓ → `exercise-library` ✓ → `training-plans` → `session-tracking` → `analytics`

**Seeding:** Now that exercise-library is done, Hans should provide his existing exercises text file so we can seed the DB via JSON import before starting training-plans.

**Why:** One change per bounded context per the change strategy in CLAUDE.md.

**How to apply:** Start with `/opsx:archive` for exercise-library, then `/opsx:propose` for training-plans.
