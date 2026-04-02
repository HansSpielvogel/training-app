### Requirement: Exercise progression chart
The system SHALL display a line chart of the maximum weight lifted per completed session for a selected ExerciseDefinition, limited to the most recent 20 sessions that include that exercise. The chart SHALL also display average reps per session as a second line on a separate right Y-axis. Weight values and axis labels SHALL be rendered in blue; reps values in orange. For each session data point where at least one set has an RPE value recorded, the chart SHALL display the average RPE for that session as a secondary visual indicator (scale 1–10).

Weight normalization:
- `single` → raw `value`
- `bilateral` → `perSide` (labelled "kg/side")
- `stacked` → `base + added`

#### Scenario: Exercise with session history
- **WHEN** the user selects an ExerciseDefinition that appears in at least one completed session
- **THEN** the system SHALL display the list view by default, and the chart view is available via the Chart/List toggle

#### Scenario: Exercise with no session history
- **WHEN** the user selects an ExerciseDefinition that has never been logged in a completed session
- **THEN** the system SHALL display a message indicating no data is available yet

#### Scenario: Exactly one session recorded
- **WHEN** an exercise appears in exactly one completed session
- **THEN** the system SHALL show the list view with one row; the chart view SHALL display a message indicating not enough data to show a trend

#### Scenario: More than 20 sessions
- **WHEN** an exercise appears in more than 20 completed sessions
- **THEN** the chart SHALL display only the 20 most recent data points; the list view shows all sessions

#### Scenario: RPE data available for a session data point
- **WHEN** at least one set in that session for the selected exercise has an RPE value
- **THEN** the chart SHALL show the average RPE for that session as a secondary indicator alongside the weight data point

#### Scenario: No RPE data for a session data point
- **WHEN** none of the sets in that session for the selected exercise have an RPE value
- **THEN** no secondary RPE indicator is shown for that data point

### Requirement: Exercise progression list view
The system SHALL provide a list view for the selected exercise's full session history, shown by default when an exercise is selected. The list shows all logged sessions (not capped at 20), ordered most recent first. Each row displays the session date and a formatted sets summary for that session using the shared set format (see exercise-definitions spec).

The Chart/List toggle switches to the chart view. Exercises with no history are not shown in the exercise selection list.

#### Scenario: Default view on exercise selection
- **WHEN** the user selects an exercise from the progression exercise list
- **THEN** the system SHALL display the list view

#### Scenario: Toggling to chart view
- **WHEN** the user activates the Chart toggle while viewing the progression list
- **THEN** the system SHALL display the chart view

#### Scenario: Toggling back to list view
- **WHEN** the user activates the List toggle while viewing the progression chart
- **THEN** the system SHALL display the list view

#### Scenario: List with history
- **WHEN** the selected exercise has at least one logged session
- **THEN** each session is shown as a row with date and a formatted sets summary

#### Scenario: List with no history
- **WHEN** the selected exercise has no logged sessions
- **THEN** the system SHALL display the same no-data message as the chart view

### Requirement: Exercise selection
The system SHALL provide a list of all ExerciseDefinitions that have session history, allowing the user to select one to view its progression.

#### Scenario: Selecting an exercise
- **WHEN** the user taps an exercise name in the exercise list
- **THEN** the system SHALL display the progression list view for that exercise

#### Scenario: Navigating back
- **WHEN** the user taps the back control from the progression view
- **THEN** the system SHALL return to the exercise selection list
