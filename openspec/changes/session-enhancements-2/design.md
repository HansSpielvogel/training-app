## Context

Three incremental enhancements to the active session screen. All changes are presentation-layer only — the domain model already supports RPE on `SessionSet`, stacked `Weight`, and temp-slot removal via `removeTempSlot`. The remaining work is purely UI.

Current gaps:
- RPE input placeholder reads `"RPE (opt.)"` — range not visible
- Plan-defined slots cannot be removed mid-session (`onRemoveEntry` is only wired for `entry.isTemp`)
- Entering stacked weight (e.g. `12+2.5`) requires `+` notation not available on the iOS numeric keyboard

## Goals / Non-Goals

**Goals:**
- Surface the 1–10 RPE scale range in the input label/placeholder
- Allow any slot (plan or temp) to be removed from the current active session
- Provide a dedicated optional "added weight" input field in the set logger for stacked weight

**Non-Goals:**
- Persisting slot removal to the training plan (it is always session-scoped)
- Removing the `B+A` text-notation parsing (keep backward compat for power users who type it)
- Any domain model changes

## Decisions

**RPE hint — label vs. placeholder change**
The label `"RPE (1–10, opt.)"` is clearer than relying on placeholder text alone (placeholder disappears on focus). Add a static text label above or inline with the input.

**Plan-slot removal — reuse existing temp-slot mechanism**
The `useActiveSession` hook already supports `removeTempSlot`. Plan slots need the same behavior: mark the entry as removed in session state without touching the plan. Rather than a new domain concept, store removed plan-slot indices in transient hook state (not persisted, discarded on session complete/abandon). This keeps the domain clean.

**Added-weight field — separate UI field, same Weight domain type**
Show a second optional numeric input `"+added"` alongside the main weight field. When non-empty, combine with the base field to produce `{ kind: 'stacked', base, added }`. When empty, parse the main field as usual. This removes the need for `+` notation input while keeping existing stacked-weight parsing for text inputs.

The two inputs share the same `parseWeight` path: if "added" field has a value, construct `"base+added"` string and pass to the existing parser.

## Risks / Trade-offs

- [Plan-slot removal is lost on session complete] → Acceptable: removal is intentionally ephemeral, session entries are still persisted (as empty entries, same as today for skipped slots). If the requirement later needs to hide them from history, that's a separate change.
- [Two separate weight inputs add UI complexity on a small screen] → Mitigate by making the added field compact and optional (hidden label, small width). It only appears as a secondary field, not a primary one.
