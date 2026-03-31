## ADDED Requirements

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
