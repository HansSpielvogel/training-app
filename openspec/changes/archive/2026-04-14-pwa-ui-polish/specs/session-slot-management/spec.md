## MODIFIED Requirements

### Requirement: Remove temp slot
The user SHALL be able to remove a temp slot from the active session, but only when no sets have been logged to it. Removing a temp slot with logged sets SHALL be blocked to prevent accidental data loss. Removal SHALL be persisted immediately to IndexedDB so the slot remains gone if the user navigates away and returns.

#### Scenario: Remove empty temp slot
- **WHEN** user taps the remove button on a temp slot that has no sets logged
- **THEN** the temp slot is removed from the active session and the removal persists through navigation

#### Scenario: Removed slot stays gone after navigation
- **WHEN** user removes a temp slot and then navigates to another screen and back
- **THEN** the removed slot does not reappear

#### Scenario: Cannot remove temp slot with sets
- **WHEN** a temp slot has at least one set logged
- **THEN** the remove button is disabled (or hidden) for that slot

#### Scenario: Cannot remove original plan slots
- **WHEN** user views a slot that originated from the training plan
- **THEN** no remove option is shown

## ADDED Requirements

### Requirement: Plan slot removal persists through navigation
When the user removes a plan slot during an active session, the removal SHALL be persisted to IndexedDB immediately. If the user navigates away and returns to the active session, the removed slot SHALL remain absent.

#### Scenario: Removed plan slot stays gone after navigation
- **WHEN** user removes a plan slot and then navigates to another screen (e.g. Stats) and returns
- **THEN** the removed slot does not reappear in the active session
