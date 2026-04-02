## ADDED Requirements

### Requirement: Browse exercise definitions
The system SHALL display all exercise definitions, sorted alphabetically by name. Each entry SHALL show its associated muscle group names. Each entry SHALL also show a formatted summary of all sets from the most recent session for that exercise if any history exists; entries with no history SHALL show no history indicator.

Set summary format: if all sets in the session are identical, display `25 kg × 10 (3 sets)`; if sets differ, display each as a comma-separated list `25 kg × 10, 25 kg × 9`. RPE is appended as `@N` when logged.

#### Scenario: List is empty
- **WHEN** no exercise definitions exist
- **THEN** the system displays an empty state with a prompt to add the first exercise definition

#### Scenario: List has entries with no history
- **WHEN** one or more exercise definitions exist but none have been logged in a completed session
- **THEN** the system displays each definition with its name and associated muscle groups, with no last-used sets shown

#### Scenario: List has entries with history
- **WHEN** one or more exercise definitions have been logged in at least one completed session
- **THEN** each such entry displays a formatted sets summary from the most recent session alongside the name and muscle groups

### Requirement: Filter by muscle group
The system SHALL allow the user to filter the exercise definition list to show only definitions associated with a given muscle group.

#### Scenario: Filter applied
- **WHEN** the user selects a muscle group filter
- **THEN** only exercise definitions associated with that muscle group are shown, each with their last-used sets summary if available

#### Scenario: Filter cleared
- **WHEN** the user clears the filter
- **THEN** all exercise definitions are shown with their last-used sets summary if available

### Requirement: Create exercise definition
The system SHALL allow the user to create a new exercise definition with a name, at least one muscle group association, and an optional default set count. Names MUST be unique (case-insensitive). The default set count SHALL be a positive integer; when not provided it defaults to 3.

#### Scenario: Successful creation
- **WHEN** the user submits a non-empty, unique name with at least one muscle group selected
- **THEN** the system persists the exercise definition and shows it in the list

#### Scenario: Successful creation with custom default sets
- **WHEN** the user submits a valid exercise with defaultSets set to a positive integer
- **THEN** the system persists the exercise definition with that defaultSets value

#### Scenario: Duplicate name rejected
- **WHEN** the user submits a name that matches an existing exercise definition (case-insensitive)
- **THEN** the system rejects the input and displays a duplicate name error

#### Scenario: No muscle group selected
- **WHEN** the user submits without selecting any muscle group
- **THEN** the system rejects the input and displays a validation error

#### Scenario: Empty name rejected
- **WHEN** the user submits an empty or whitespace-only name
- **THEN** the system rejects the input and displays a validation error

#### Scenario: Invalid default sets rejected
- **WHEN** the user submits a defaultSets value less than 1
- **THEN** the system rejects the input and displays a validation error

### Requirement: Edit exercise definition
The system SHALL allow the user to modify the name, muscle group associations, and default set count of an existing exercise definition.

#### Scenario: Successful edit
- **WHEN** the user submits a valid updated name and at least one muscle group
- **THEN** the system persists the changes

#### Scenario: Successful edit of default sets
- **WHEN** the user updates defaultSets to a positive integer
- **THEN** the system persists the new defaultSets value

#### Scenario: Duplicate name rejected on edit
- **WHEN** the user submits a name matching a different existing exercise definition (case-insensitive)
- **THEN** the system rejects the update and displays a duplicate name error

### Requirement: Delete exercise definition
The system SHALL allow the user to delete an exercise definition after confirmation.

#### Scenario: Successful deletion
- **WHEN** the user confirms deletion
- **THEN** the system removes the exercise definition

#### Scenario: Deletion cancelled
- **WHEN** the user dismisses the confirmation dialog
- **THEN** the exercise definition is not deleted
