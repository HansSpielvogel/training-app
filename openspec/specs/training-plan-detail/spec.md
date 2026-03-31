### Requirement: View plan slots
The system SHALL display all slots of a training plan in their defined order. Each slot SHALL show the associated muscle group name and an "Evtl" indicator when the slot is marked as optional.

#### Scenario: Plan has slots
- **WHEN** the user opens a training plan
- **THEN** the system displays each slot's muscle group name in order; slots with `optional: true` display an "Evtl" indicator alongside the name

#### Scenario: Plan has no slots
- **WHEN** the user opens a training plan with no slots
- **THEN** the system displays an empty state with a prompt to add the first slot

### Requirement: Toggle slot optional flag
The system SHALL allow the user to toggle whether a plan slot is optional. Marking a slot optional signals it may be skipped during a session; it does not remove the slot from the plan.

#### Scenario: Mark slot as optional
- **WHEN** the user toggles the optional flag on a slot that is currently required
- **THEN** the system persists `optional: true` on the slot and the "Evtl" indicator becomes visible

#### Scenario: Mark slot as required
- **WHEN** the user toggles the optional flag on a slot that is currently optional
- **THEN** the system persists `optional: false` on the slot and the "Evtl" indicator is removed

### Requirement: Explicit save and discard for plan edits
The training plan detail screen SHALL operate in draft mode. All edits (add slot, remove slot, reorder slot, toggle optional, rename plan) SHALL be held in local state and not persisted until the user explicitly saves. The screen SHALL provide a Save button that commits all pending edits to storage and returns to the plan list. The screen SHALL provide a Discard button that discards all pending edits and returns to the plan list without writing. The back-arrow navigation SHALL be removed.

#### Scenario: Save commits all pending edits
- **WHEN** the user makes one or more edits and taps Save
- **THEN** all edits are written to storage and the user is returned to the plan list

#### Scenario: Discard abandons all pending edits
- **WHEN** the user makes one or more edits and taps Discard
- **THEN** no edits are written to storage and the user is returned to the plan list with the plan unchanged

#### Scenario: No back-arrow navigation
- **WHEN** the plan detail screen is open
- **THEN** no back-arrow or swipe-back navigation is available; only Save and Discard exit the screen
