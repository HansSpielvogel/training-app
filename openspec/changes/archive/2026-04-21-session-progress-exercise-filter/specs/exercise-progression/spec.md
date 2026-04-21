## MODIFIED Requirements

### Requirement: Exercise selection
The system SHALL provide a list of all ExerciseDefinitions that have session history, allowing the user to select one to view its progression. The list SHALL be filterable by muscle group using the filter chips defined in the `progression-exercise-filter` capability.

#### Scenario: Selecting an exercise
- **WHEN** the user taps an exercise name in the exercise list
- **THEN** the system SHALL display the progression list view for that exercise

#### Scenario: Navigating back
- **WHEN** the user taps the back control from the progression view
- **THEN** the system SHALL return to the exercise selection list

#### Scenario: Exercise list filtered by muscle group
- **WHEN** the user selects a muscle-group filter chip
- **THEN** only exercises belonging to that muscle group appear in the exercise selection list
