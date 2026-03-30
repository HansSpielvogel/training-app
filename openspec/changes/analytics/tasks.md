## 1. Domain — analytics types

- [ ] 1.1 Create `src/domain/analytics/index.ts` with output types: `ExerciseProgressionPoint`, `MuscleGroupVolume`, `SessionSummaryItem`

## 2. Application — use cases

- [ ] 2.1 Create `src/application/analytics/getExerciseProgression.ts` — queries completed sessions, filters by exerciseDefinitionId, normalizes weight, returns last 20 points sorted by date
- [ ] 2.2 Create `src/application/analytics/getMuscleGroupVolume.ts` — aggregates set counts per muscleGroupId across all completed sessions, joins with MuscleGroup names, sorts descending
- [ ] 2.3 Create `src/application/analytics/getSessionSummaries.ts` — maps completed sessions to SessionSummaryItem (id, date, planName, exerciseCount), sorted newest first
- [ ] 2.4 Export all three use cases from `src/application/analytics/index.ts`

## 3. Presentation — analytics screens

- [ ] 3.1 Create `src/presentation/analytics/AnalyticsScreen.tsx` — tab bar (Calendar / Volume / Progression) with state to switch between the three views
- [ ] 3.2 Create `src/presentation/analytics/TrainingCalendarView.tsx` — session list cards (date, plan name, exercise count); empty state message
- [ ] 3.3 Create `src/presentation/analytics/MuscleGroupVolumeView.tsx` — ranked list with proportional bars; empty state message
- [ ] 3.4 Create `src/presentation/analytics/ExerciseProgressionView.tsx` — exercise picker list; on selection shows SVG line chart; back navigation; no-data message
- [ ] 3.5 Create `src/presentation/analytics/ProgressionChart.tsx` — inline SVG line chart component (polyline + axis labels, capped at 20 points)
- [ ] 3.6 Create `src/presentation/analytics/useAnalytics.ts` — hook that instantiates `DexieTrainingSessionRepository` and `DexieExerciseDefinitionRepository`, exposes the three use case results

## 4. Navigation

- [ ] 4.1 Add `/analytics` route to `App.tsx` pointing to `AnalyticsScreen`
- [ ] 4.2 Add "Stats" NavLink (bar-chart icon) as fifth tab in the bottom nav in `App.tsx`

## 5. Tests

- [ ] 5.1 Unit-test `getExerciseProgression` — exercises with multiple sessions, weight normalization for all three weight types, capped at 20 sessions
- [ ] 5.2 Unit-test `getMuscleGroupVolume` — correct aggregation, sorting, exclusion of zero-volume muscle groups
- [ ] 5.3 Unit-test `getSessionSummaries` — correct mapping and ordering
