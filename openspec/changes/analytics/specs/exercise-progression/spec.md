## ADDED Requirements

### Requirement: Exercise progression chart
The system SHALL display a line chart of the maximum weight lifted per completed session for a selected ExerciseDefinition, limited to the most recent 20 sessions that include that exercise.

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

### Requirement: Exercise selection
The system SHALL provide a list of all ExerciseDefinitions, allowing the user to select one to view its progression chart.

#### Scenario: Selecting an exercise
- **WHEN** the user taps an exercise name in the exercise list
- **THEN** the system SHALL display the progression chart for that exercise

#### Scenario: Navigating back
- **WHEN** the user taps the back control from the chart view
- **THEN** the system SHALL return to the exercise selection list
