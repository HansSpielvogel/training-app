## MODIFIED Requirements

### Requirement: Exercise progression chart
The system SHALL display a line chart of the maximum weight lifted per completed session for a selected ExerciseDefinition, limited to the most recent 20 sessions that include that exercise. For each session data point where at least one set has an RPE value recorded, the chart SHALL display the average RPE for that session as a secondary visual indicator (scale 1–10).

Weight normalization:
- `single` → raw `value`
- `bilateral` → `perSide` (labelled "kg/side")
- `stacked` → `base + added`

#### Scenario: Exercise with session history
- **WHEN** the user selects an ExerciseDefinition that appears in at least one completed session
- **THEN** the system SHALL display a line chart with one data point per qualifying session, showing the max weight on the Y-axis and the session date on the X-axis

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
