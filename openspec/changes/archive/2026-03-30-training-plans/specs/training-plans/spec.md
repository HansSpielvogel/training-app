## ADDED Requirements

### Requirement: Browse training plans
The system SHALL display all training plans as a list, ordered by name. Each entry SHALL show the plan name and the number of slots it contains.

#### Scenario: List is empty
- **WHEN** no training plans exist
- **THEN** the system displays an empty state with a prompt to create the first plan

#### Scenario: List has entries
- **WHEN** one or more training plans exist
- **THEN** the system displays each plan with its name and slot count

### Requirement: Create training plan
The system SHALL allow the user to create a new training plan with a name. Names MUST be unique (case-insensitive).

#### Scenario: Successful creation
- **WHEN** the user submits a non-empty, unique name
- **THEN** the system persists the plan and shows it in the list

#### Scenario: Duplicate name rejected
- **WHEN** the user submits a name that matches an existing plan (case-insensitive)
- **THEN** the system rejects the input and displays a duplicate name error

#### Scenario: Empty name rejected
- **WHEN** the user submits an empty or whitespace-only name
- **THEN** the system rejects the input and displays a validation error

### Requirement: Edit training plan name
The system SHALL allow the user to rename an existing training plan. The new name MUST be unique (case-insensitive, excluding the plan itself).

#### Scenario: Successful rename
- **WHEN** the user submits a valid, unique new name
- **THEN** the system persists the updated name

#### Scenario: Duplicate name rejected on edit
- **WHEN** the user submits a name matching a different existing plan (case-insensitive)
- **THEN** the system rejects the update and displays a duplicate name error

### Requirement: Delete training plan
The system SHALL allow the user to delete a training plan and all its slots after confirmation.

#### Scenario: Successful deletion
- **WHEN** the user confirms deletion
- **THEN** the system removes the plan and all its slots

#### Scenario: Deletion cancelled
- **WHEN** the user dismisses the confirmation
- **THEN** the plan is not deleted

### Requirement: Seed training plans on first launch
The system SHALL seed Hans's 5 training plans with their ordered muscle group slots when the plans table is empty on app boot.

#### Scenario: Fresh install
- **WHEN** the app starts and no training plans exist
- **THEN** the system creates the 5 seeded plans (Oberkörper A, Oberkörper B, Core, Beine & Po, Core+Beine) with their slots in order

#### Scenario: Plans already exist
- **WHEN** the app starts and at least one training plan exists
- **THEN** the system does not modify existing plans
