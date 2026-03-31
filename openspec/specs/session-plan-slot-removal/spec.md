### Requirement: Remove plan slot from active session
The user SHALL be able to remove any slot from the active session, including plan-defined slots (not only temp slots). Removing a plan slot SHALL dismiss it from the current session view only; the underlying training plan SHALL NOT be modified. The removal is ephemeral and is not persisted beyond the current session.

#### Scenario: Remove a plan-defined slot
- **WHEN** user taps the remove action on a plan-defined session entry
- **THEN** the entry is removed from the active session view for the remainder of the session

#### Scenario: Plan is unchanged after slot removal
- **WHEN** user removes a plan slot mid-session and completes the session
- **THEN** the training plan still contains the original slot on the next session start

#### Scenario: Removed slot is not logged
- **WHEN** a plan slot is removed from the session before any sets are logged
- **THEN** no session entry for that slot is created on session completion
