## MODIFIED Requirements

### Requirement: Exercise progression chart
The system SHALL display a line chart of the maximum weight lifted per completed session for a selected ExerciseDefinition, limited to the most recent 20 sessions that include that exercise. The chart SHALL also display average reps per session as a second line on a separate Y-axis. For each session data point where at least one set has an RPE value recorded, the chart SHALL display the average RPE for that session as a secondary visual indicator (scale 1–10).

Weight normalization:
- `single` → raw `value`
- `bilateral` → `perSide` (labelled "kg/side")
- `stacked` → `base + added`

#### Scenario: Exercise with session history
- **WHEN** the user selects an ExerciseDefinition that appears in at least one completed session
- **THEN** the system SHALL display a line chart with one data point per qualifying session, showing max weight on the left Y-axis, average reps on the right Y-axis, and session date on the X-axis

#### Scenario: Exercise with no session history
- **WHEN** the user selects an ExerciseDefinition that has never been logged in a completed session
- **THEN** the system SHALL display a message indicating no data is available yet

#### Scenario: More than 20 sessions
- **WHEN** an exercise appears in more than 20 completed sessions
- **THEN** the system SHALL display only the 20 most recent data points

#### Scenario: RPE data available for a session data point
- **WHEN** at least one set in that session for the selected exercise has an RPE value
- **THEN** the chart SHALL show the average RPE for that session as a secondary indicator alongside the weight data point

#### Scenario: No RPE data for a session data point
- **WHEN** none of the sets in that session for the selected exercise have an RPE value
- **THEN** no secondary RPE indicator is shown for that data point

## ADDED Requirements

### Requirement: Exercise progression list view
The system SHALL provide a list view for the selected exercise's full session history, toggled from the chart view. The list SHALL show all logged sessions (not capped at 20), each displaying the session date, max weight logged, and average reps, ordered most recent first.

#### Scenario: Toggling to list view
- **WHEN** the user activates the list toggle while viewing the progression chart
- **THEN** the system SHALL display the scrollable list view in place of the chart

#### Scenario: Toggling back to chart view
- **WHEN** the user activates the chart toggle while viewing the progression list
- **THEN** the system SHALL display the chart view

#### Scenario: List with history
- **WHEN** the selected exercise has at least one logged session
- **THEN** each session is shown as a row with date, max weight, and average reps

#### Scenario: List with no history
- **WHEN** the selected exercise has no logged sessions
- **THEN** the system SHALL display the same no-data message as the chart view
