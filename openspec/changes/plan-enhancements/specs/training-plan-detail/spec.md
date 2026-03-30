## MODIFIED Requirements

### Requirement: View plan slots
The system SHALL display all slots of a training plan in their defined order. Each slot SHALL show the associated muscle group name and an "Evtl" indicator when the slot is marked as optional.

#### Scenario: Plan has slots
- **WHEN** the user opens a training plan
- **THEN** the system displays each slot's muscle group name in order; slots with `optional: true` display an "Evtl" indicator alongside the name

#### Scenario: Plan has no slots
- **WHEN** the user opens a training plan with no slots
- **THEN** the system displays an empty state with a prompt to add the first slot

## ADDED Requirements

### Requirement: Toggle slot optional flag
The system SHALL allow the user to toggle whether a plan slot is optional. Marking a slot optional signals it may be skipped during a session; it does not remove the slot from the plan.

#### Scenario: Mark slot as optional
- **WHEN** the user toggles the optional flag on a slot that is currently required
- **THEN** the system persists `optional: true` on the slot and the "Evtl" indicator becomes visible

#### Scenario: Mark slot as required
- **WHEN** the user toggles the optional flag on a slot that is currently optional
- **THEN** the system persists `optional: false` on the slot and the "Evtl" indicator is removed
