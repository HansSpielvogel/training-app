---
name: Change progress
description: Which OpenSpec changes are done and what's next
type: project
---

`app-foundation` ✓ archived. `exercise-library` ✓ implemented (pending archive). `training-plans` ✓ implemented (pending archive).

**Next change:** `session-tracking`

Full sequence: `app-foundation` ✓ → `exercise-library` ✓ → `training-plans` ✓ → `session-tracking` → `analytics`

**Why:** One change per bounded context per the change strategy in CLAUDE.md.

**How to apply:** Archive pending changes with `/opsx:archive`, then `/opsx:propose session-tracking`.
