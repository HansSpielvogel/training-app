## 1. Exercise list — last-used weight and reps

- [x] 1.1 Add a bulk query to the sessions repository that returns the most recent logged weight and reps per `exerciseDefinitionId` for all exercises in one call
- [x] 1.2 Wire the bulk query into the exercise definitions list hook so each exercise entry carries its last-used data
- [x] 1.3 Update the ExerciseDefinitionList row component to display last-used weight and reps beneath the exercise name (hidden when no history)
- [x] 1.4 Write tests for the bulk last-used query and the updated list row rendering

## 2. Progression chart — reps overlay

- [x] 2.1 Extend the progression data shape to include average reps per session data point (alongside existing weight and RPE)
- [x] 2.2 Update the progression use case / query to compute and return avg reps per session
- [x] 2.3 Add a second Y-axis (right side) to the progression Recharts chart for reps, with a distinct color from the weight line
- [x] 2.4 Write tests for the reps computation and verify both axes render correctly

## 3. Progression — list view toggle

- [x] 3.1 Add a Chart/List toggle control to the progression view header
- [x] 3.2 Implement the list view component showing all sessions (no 20-session cap) with date, max weight, and avg reps per row, most recent first
- [x] 3.3 Wire toggle state so the chart and list views swap in place
- [x] 3.4 Write tests for the list view rendering and toggle behavior

## 4. Calendar — expandable session cards

- [x] 4.1 Add per-card expanded state to the training calendar component (tap to toggle)
- [x] 4.2 Implement the inline expansion panel showing the exercises logged in the session (name + sets summary: weight × reps per set)
- [x] 4.3 Fetch session entry details for a card when it expands (lazy — only load on first expand)
- [x] 4.4 Write tests for expand/collapse behavior and the exercise summary rendering
