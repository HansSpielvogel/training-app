## Context

All four changes are read-only presentation enhancements. No domain entities or application use cases are being added — only new queries and UI updates. The existing `exercise-progression` use case already fetches per-session weight history; reps and full sets are already stored on `SessionSet` and are now surfaced in all views.

## Goals / Non-Goals

**Goals:**
- Surface last-used sets summary on the exercise definition list
- Add reps as a second dimension to the progression chart
- Add a list-view (default) for the full progression history showing all sets
- Make calendar session cards expandable to show their exercise summary
- Consistent set display format across all locations using a shared utility

**Non-Goals:**
- Any write operations or data mutations
- New routes or navigation paths
- Changes to domain entities or application use cases
- Export or sharing functionality

## Decisions

### Shared set format utility

All four locations (exercise list, progression list, calendar expansion, active session "Last:" hint) use a single `formatSets(sets: readonly SessionSet[])` function at `src/presentation/shared/formatSets.ts`.

Format rules:
- All sets identical: `25 kg × 10 (3 sets)`
- All sets same weight/reps, consistent RPE: `25 kg × 10 @8 (3 sets)`
- All sets same weight/reps, varying RPE: `25 kg × 10 (3 sets)` (RPE omitted in collapsed form)
- Sets differ: `25 kg × 10, 25 kg × 9` (comma-separated)
- Sets differ with RPE: `25 kg × 10 @8, 25 kg × 9 @7`

### Color consistency

Weight-related values are rendered in blue (`#2563eb`) throughout — the chart line, Y-axis labels, legend, and list values. Reps-related values are in orange (`#f97316`). This applies across the chart and the list view.

### Last-used sets on exercise list

The `getLastUsedByExercise` query returns all sets from the most recent session for each exercise (not just the heaviest set). The `LastUsedEntry` domain type carries `sets: readonly SessionSet[]` so the full set summary can be rendered with `formatSets`.

_Alternative considered_: show only max-weight set. Rejected — showing all sets is more useful at the machine for planning the next session.

### Reps overlay on progression chart

A second Y-axis on the existing SVG chart. Weight stays on the left axis (blue); average reps per session on the right axis (orange). Both lines share the same X-axis (session date).

_Alternative considered_: a separate reps chart below the weight chart. Rejected — split view makes the weight/rep relationship harder to see.

### Progression list view — default and full sets

The list view is the default when opening an exercise in the progression screen. The chart is available via the Chart/List toggle. The list shows all sessions (no 20-session cap), ordered most recent first, with each row displaying the session date and the full `formatSets` summary for that session.

A single session shows the list (one row). The chart view for a single session shows a "not enough data for a trend" message. Exercises with no history are filtered out of the exercise selection list.

_Alternative considered_: keep chart as default. Rejected — the list gives immediate access to the most recent session data with full set detail, which is the primary in-gym use case.

### Calendar session expansion

Tapping a session card toggles an inline expansion showing the ordered list of exercises logged in that session, each with name and `formatSets` summary. Session detail is loaded lazily on first expand and cached. A second tap collapses it.

_Alternative considered_: navigate to a detail screen. Rejected — inline keeps the calendar context intact.

## Risks / Trade-offs

- Dual Y-axis chart can be noisy with many data points → mitigate with muted/thin lines and clear color contrast
- Bulk last-used query may be slow if there are many sessions → acceptable for MVP; IndexedDB queries on a single user's data are fast enough in practice
