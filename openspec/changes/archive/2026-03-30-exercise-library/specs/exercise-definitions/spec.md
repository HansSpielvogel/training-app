## ADDED Requirements

### Requirement: Browse exercise definitions
The system SHALL display all exercise definitions, sorted alphabetically by name. Each entry SHALL show its associated muscle group names.

#### Scenario: List is empty
- **WHEN** no exercise definitions exist
- **THEN** the system displays an empty state with a prompt to add the first exercise definition

#### Scenario: List has entries
- **WHEN** one or more exercise definitions exist
- **THEN** the system displays each definition with its name and associated muscle groups in alphabetical order

### Requirement: Filter by muscle group
The system SHALL allow the user to filter the exercise definition list to show only definitions associated with a given muscle group.

#### Scenario: Filter applied
- **WHEN** the user selects a muscle group filter
- **THEN** only exercise definitions associated with that muscle group are shown

#### Scenario: Filter cleared
- **WHEN** the user clears the filter
- **THEN** all exercise definitions are shown

### Requirement: Create exercise definition
The system SHALL allow the user to create a new exercise definition with a name and at least one muscle group association. Names MUST be unique (case-insensitive).

#### Scenario: Successful creation
- **WHEN** the user submits a non-empty, unique name with at least one muscle group selected
- **THEN** the system persists the exercise definition and shows it in the list

#### Scenario: Duplicate name rejected
- **WHEN** the user submits a name that matches an existing exercise definition (case-insensitive)
- **THEN** the system rejects the input and displays a duplicate name error

#### Scenario: No muscle group selected
- **WHEN** the user submits without selecting any muscle group
- **THEN** the system rejects the input and displays a validation error

#### Scenario: Empty name rejected
- **WHEN** the user submits an empty or whitespace-only name
- **THEN** the system rejects the input and displays a validation error

### Requirement: Edit exercise definition
The system SHALL allow the user to modify the name and muscle group associations of an existing exercise definition.

#### Scenario: Successful edit
- **WHEN** the user submits a valid updated name and at least one muscle group
- **THEN** the system persists the changes

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
