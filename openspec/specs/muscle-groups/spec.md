## ADDED Requirements

### Requirement: Browse muscle groups
The system SHALL display all muscle groups in a list, sorted alphabetically by name.

#### Scenario: List is empty
- **WHEN** no muscle groups exist
- **THEN** the system displays an empty state with a prompt to add the first muscle group

#### Scenario: List has entries
- **WHEN** one or more muscle groups exist
- **THEN** the system displays each muscle group name in alphabetical order

### Requirement: Create muscle group
The system SHALL allow the user to create a new muscle group with a name. Names MUST be unique (case-insensitive).

#### Scenario: Successful creation
- **WHEN** the user submits a non-empty name that does not already exist
- **THEN** the system persists the muscle group and shows it in the list

#### Scenario: Duplicate name rejected
- **WHEN** the user submits a name that matches an existing muscle group (case-insensitive)
- **THEN** the system rejects the input and displays a duplicate name error

#### Scenario: Empty name rejected
- **WHEN** the user submits an empty or whitespace-only name
- **THEN** the system rejects the input and displays a validation error

### Requirement: Rename muscle group
The system SHALL allow the user to rename an existing muscle group. The new name MUST be unique (case-insensitive).

#### Scenario: Successful rename
- **WHEN** the user submits a non-empty name that does not conflict with another muscle group
- **THEN** the system persists the updated name

#### Scenario: Duplicate name rejected on rename
- **WHEN** the user submits a name matching a different existing muscle group (case-insensitive)
- **THEN** the system rejects the update and displays a duplicate name error

### Requirement: Delete muscle group
The system SHALL allow the user to delete a muscle group only when no exercise definitions reference it.

#### Scenario: Successful deletion
- **WHEN** the muscle group is not referenced by any exercise definition
- **THEN** the system removes it after user confirmation

#### Scenario: Deletion blocked by references
- **WHEN** one or more exercise definitions reference the muscle group
- **THEN** the system prevents deletion and informs the user which exercises must be removed or reassigned first

#### Scenario: Deletion cancelled
- **WHEN** the user dismisses the confirmation dialog
- **THEN** the muscle group is not deleted
