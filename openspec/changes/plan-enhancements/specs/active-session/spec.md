## MODIFIED Requirements

### Requirement: Pick exercise variation per slot
For each session entry (muscle group slot), the system SHALL display a smart rotation suggestion when one can be computed, followed by the last up to 4 distinct `ExerciseDefinition`s used for that muscle group across previous completed sessions (newest-first). The user SHALL be able to select the suggested variation, one of the recent variations, or any other `ExerciseDefinition` for the same muscle group from a full list. The chosen `ExerciseDefinition` SHALL be assigned to the entry.

The rotation suggestion is derived from the last 5 completed sessions containing an entry for the slot's muscle group. The `ExerciseDefinition` used least frequently among those sessions is suggested, excluding the most recently used exercise. On a count tie, the one used longest ago is preferred. No suggestion is shown when fewer than 2 distinct exercises appear in those 5 sessions, or when all non-recent candidates share the same frequency.

#### Scenario: Recent variations shown
- **WHEN** user opens a slot to log sets
- **THEN** up to 4 most recently used ExerciseDefinitions for that muscle group are displayed as quick-pick options

#### Scenario: Rotation suggestion shown
- **WHEN** user opens a slot and the rotation algorithm finds a least-used exercise that is not the most recently used among the last 5 sessions
- **THEN** a suggestion chip is displayed above the recent-variations list identifying the recommended ExerciseDefinition

#### Scenario: No rotation suggestion
- **WHEN** user opens a slot and fewer than 2 distinct exercises appear in the last 5 sessions, or all non-recent candidates are equally frequently used
- **THEN** no suggestion chip is shown and only the recent-variations list appears

#### Scenario: Pick rotation suggestion
- **WHEN** user taps the rotation suggestion chip
- **THEN** that ExerciseDefinition is assigned to the entry

#### Scenario: Pick recent variation
- **WHEN** user taps a recent variation
- **THEN** that ExerciseDefinition is assigned to the entry

#### Scenario: Pick from full list
- **WHEN** user opens the full exercise picker for a muscle group
- **THEN** all ExerciseDefinitions for that muscle group are shown and user can select one

#### Scenario: No history available
- **WHEN** no completed sessions exist with data for this muscle group
- **THEN** no recent variations are shown and user must pick from the full list
