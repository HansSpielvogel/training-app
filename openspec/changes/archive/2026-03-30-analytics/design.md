## Context

Four bounded contexts exist: exercises, planning, sessions, and (new) analytics. Session data is stored in Dexie/IndexedDB via `DexieTrainingSessionRepository`. `ITrainingSessionRepository.listCompleted()` returns all finished sessions. There are currently 4 nav tabs (Train, Plans, Muscles, Exercises).

## Goals / Non-Goals

**Goals:**
- Add an Analytics tab exposing three views: training calendar, muscle-group volume, and exercise progression
- Keep bundle small — no external charting library
- Pure query layer — no new writes, no new domain aggregates

**Non-Goals:**
- Real-time updates while a session is in progress
- Date range filtering UI (show all data, or last N sessions)
- Export of analytics data

## Decisions

### 1. New `analytics` bounded context — pure query types only

Analytics needs no aggregates or repository writes. `src/domain/analytics/` will hold output types only (`ExerciseProgressionPoint`, `MuscleGroupVolume`, `SessionSummaryItem`). Use cases in `src/application/analytics/` accept repository interfaces from `domain/sessions/` and `domain/exercises/` and return these types. This keeps the domain layer zero-dependency and avoids polluting existing contexts.

**Alternative considered:** Co-locate analytics logic in sessions context. Rejected because analytics spans exercises + sessions and belongs in its own context per bounded-context strategy.

### 2. SVG line chart implemented inline — no charting library

A simple weight-over-time line chart needs only: normalize to a 0–100 viewport, draw polyline, draw axis labels. This is ~50 lines of TSX. Adding recharts or chart.js would add ~200 KB+ to the bundle for a single feature.

**Alternative considered:** recharts (popular, accessible). Rejected due to bundle cost and PWA constraints.

### 3. Weight normalization for progression chart

The `Weight` union type (`single | bilateral | stacked`) must reduce to a single comparable number for the Y-axis. Strategy:
- `single` → `value`
- `bilateral` → `perSide` (displayed as "per side")
- `stacked` → `base + added`

The label on the chart clarifies the unit (e.g. "kg/side" for bilateral). Per-exercise the weight type is consistent across sessions, so mixed types on one chart won't occur in practice.

### 4. Analytics navigation — fifth tab

Add a fifth "Stats" tab to the bottom nav alongside Train, Plans, Muscles, Exercises. Five tabs fit iPhone screens (each ~20% width). Icon: bar chart.

**Alternative considered:** Nest analytics under the Sessions tab. Rejected — analytics is a distinct top-level concern and deserves first-class navigation.

### 5. Exercise picker for progression chart

The progression screen starts with a searchable/scrollable exercise list. Selecting an exercise shows its weight chart. This avoids loading all exercise charts at once.

## Risks / Trade-offs

- **Many completed sessions with many entries** → All loaded into memory via `listCompleted()`. Mitigation: data is local/IndexedDB, performance acceptable for personal use; cap chart to last 20 data points.
- **Bilateral weight display ambiguity** — "per side" label is the mitigation; no further disambiguation needed.
- **Five nav tabs on small screens** — tested acceptable on iPhone SE (375px); each tab is ~75px wide.

## Migration Plan

No data migration needed — analytics is read-only over existing session data.
