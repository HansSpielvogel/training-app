### Requirement: View plan slots
The system SHALL display all slots of a training plan in their defined order. Each slot SHALL show the associated muscle group name.

#### Scenario: Plan has slots
- **WHEN** the user opens a training plan
- **THEN** the system displays each slot's muscle group name in order

#### Scenario: Plan has no slots
- **WHEN** the user opens a training plan with no slots
- **THEN** the system displays an empty state with a prompt to add the first slot

### Requirement: Add slot to plan
The system SHALL allow the user to add a muscle group slot to a training plan. The new slot is appended at the end of the slot order.

#### Scenario: Successful add
- **WHEN** the user selects a muscle group and confirms
- **THEN** the system appends the slot to the plan and displays it last in the list

### Requirement: Remove slot from plan
The system SHALL allow the user to remove a slot from a training plan after confirmation.

#### Scenario: Successful removal
- **WHEN** the user confirms removal of a slot
- **THEN** the system deletes the slot; remaining slots retain their relative order

#### Scenario: Removal cancelled
- **WHEN** the user dismisses the removal confirmation
- **THEN** the slot is not removed

### Requirement: Reorder slots
The system SHALL allow the user to change the position of a slot within the plan by moving it up or down one position at a time.

#### Scenario: Move slot up
- **WHEN** the user moves a slot up and it is not already the first slot
- **THEN** the slot swaps position with the slot above it

#### Scenario: Move slot down
- **WHEN** the user moves a slot down and it is not already the last slot
- **THEN** the slot swaps position with the slot below it

#### Scenario: First slot cannot move up
- **WHEN** the user attempts to move the first slot up
- **THEN** the move action is not available (button disabled or hidden)

#### Scenario: Last slot cannot move down
- **WHEN** the user attempts to move the last slot down
- **THEN** the move action is not available (button disabled or hidden)
