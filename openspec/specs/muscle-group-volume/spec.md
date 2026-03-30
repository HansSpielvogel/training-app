### Requirement: Muscle group volume overview
The system SHALL display a ranked list of all MuscleGroups showing the total number of sets logged across all completed sessions, sorted descending by set count.

#### Scenario: Sessions exist
- **WHEN** the user views the muscle group volume screen
- **THEN** the system SHALL display each MuscleGroup with its total set count, sorted highest to lowest

#### Scenario: No sessions recorded
- **WHEN** no completed sessions exist
- **THEN** the system SHALL display a message indicating no training data is available yet

#### Scenario: MuscleGroup never trained
- **WHEN** a MuscleGroup exists but has no sets logged in any completed session
- **THEN** that MuscleGroup SHALL NOT appear in the list

### Requirement: Volume bar visualization
Each MuscleGroup row SHALL include a horizontal bar proportional to its set count relative to the highest-volume muscle group.

#### Scenario: Relative bar width
- **WHEN** the volume list is displayed
- **THEN** the muscle group with the highest set count SHALL have a full-width bar, and all others SHALL be proportionally smaller
