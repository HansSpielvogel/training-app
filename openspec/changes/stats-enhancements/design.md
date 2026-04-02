## Context

All four changes are read-only presentation enhancements. No domain entities or application use cases are being added — only new queries and UI updates. The existing `exercise-progression` use case already fetches per-session weight history; reps are already stored on `SessionSet` but not currently surfaced.

## Goals / Non-Goals

**Goals:**
- Surface last-used weight and reps on the exercise definition list
- Add reps as a second dimension to the progression chart
- Add a list-view toggle for the full progression history
- Make calendar session cards expandable to show their exercise summary

**Non-Goals:**
- Any write operations or data mutations
- New routes or navigation paths
- Changes to domain entities or application use cases
- Export or sharing functionality

## Decisions

### Last-used weight+reps on exercise list

Reuse the same repository query pattern as progression: find the most recent completed session containing each exercise and read the max-weight set from it. Run this as a single bulk query (all exercises at once, not N+1) keyed by `exerciseDefinitionId`. Display inline below the exercise name; omit the row addon if no history exists.

_Alternative considered_: add a dedicated application use case. Rejected — it's a thin read with no business logic; hooking it directly in the presentation layer (like other list queries) is consistent with existing patterns.

### Reps overlay on progression chart

Add a second Y-axis to the existing Recharts line chart. Weight stays on the left axis; average reps per session on the right axis. Use distinct colors. Both lines share the same X-axis (session date).

_Alternative considered_: a separate reps chart below the weight chart. Rejected — split view makes the weight/rep relationship harder to see.

### Progression list view

A toggle button (Chart | List) above the progression view switches between the chart and a scrollable flat list of data points showing date, max weight, and average reps per session, most recent first.

_Alternative considered_: show both chart and list simultaneously. Rejected — screen space on iPhone is limited; toggle is lower friction.

### Calendar session expansion

Tapping a session card toggles an inline expansion showing the ordered list of exercises logged in that session (name + sets summary). A second tap collapses it. No navigation.

_Alternative considered_: navigate to a detail screen. Rejected — the roadmap explicitly says "expand a list", and inline keeps the calendar context intact.

## Risks / Trade-offs

- Dual Y-axis chart can be noisy with many data points → mitigate with muted/thin lines and clear color contrast
- Bulk last-used query may be slow if there are many sessions → acceptable for MVP; IndexedDB queries on a single user's data are fast enough in practice
