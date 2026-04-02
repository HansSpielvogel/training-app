## Why

The stats views show limited information today: the exercise list is blank on history, the progression chart only shows weight (missing the reps dimension), and the calendar shows sessions as opaque cards. These gaps make it harder to reason about training progress at a glance.

## What Changes

- Exercise list: each exercise shows the last logged weight and rep count (if any history exists)
- Progression chart: reps are overlaid as a second Y-axis so weight-rep progression cycles are visible
- Progression: a scrollable list view (toggled alongside the chart) shows all logged data points with weight, reps, and date
- Calendar: tapping a past session expands it inline to show the exercises performed

## Capabilities

### New Capabilities

_(none — all changes are enhancements to existing capabilities)_

### Modified Capabilities

- `exercise-definitions`: exercise list rows now surface last-used weight and reps per exercise
- `exercise-progression`: chart gains a reps overlay; new list view added alongside chart
- `training-calendar`: session cards become expandable to reveal a per-exercise summary

## Impact

- `presentation/` — read-only view changes only; no domain or application layer changes required
- Queries needed: last-used weight+reps per exercise (can reuse progression query logic), full history list per exercise, session-entry expansion on the calendar
