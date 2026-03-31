## Why

The app is used one-handed at the machine, but several friction points interrupt the flow: weight inputs break on German keyboards, zoom in on iOS, and get covered by the keyboard; there's no way to mark an exercise done or auto-advance; and plan editing has no explicit save action. These are all blocking the core in-gym use case.

## What Changes

- Weight input accepts comma as decimal separator (German locale) and negative values (assisted exercises like Klimmzug, Dips)
- Weight/reps inputs no longer trigger iOS zoom on focus
- Active input scrolls into view when the on-screen keyboard opens
- Each session slot gets a "Finish" button that marks it done (UI state only — sets remain editable)
- After finishing a slot, the next incomplete slot auto-expands
- Training plan editor replaces back-arrow navigation with explicit Save and Discard buttons

## Capabilities

### New Capabilities

- `session-slot-completion`: Per-slot done state with finish button and auto-advance to next incomplete slot

### Modified Capabilities

- `active-session`: Weight input notation extended — comma as decimal separator, negative values allowed; input UX requirements added (zoom prevention, scroll to input on focus)
- `training-plan-detail`: Save and Discard buttons replace implicit back-arrow save behavior

## Impact

- `presentation/` — weight input component(s) in active session, slot UI, plan editor screen
- `openspec/specs/active-session/spec.md` — weight input notation requirements updated
- `openspec/specs/training-plan-detail/spec.md` — save/discard requirement added
- No domain or infrastructure layer changes
