### Requirement: Remove plan slot from active session
The user SHALL be able to remove any slot from the active session, including plan-defined slots (not only temp slots). Removing a plan slot SHALL dismiss it from the current session view only; the underlying training plan SHALL NOT be modified. The removal is ephemeral and is not persisted beyond the current session.

Removal is triggered by a swipe-left gesture on the entry row. Swiping left SHALL reveal a red trash action behind the row. When the swipe passes a threshold (≥60px), releasing commits the removal. Slots that have at least one set logged SHALL NOT be removable via swipe; the gesture is disabled on those rows.

#### Scenario: Swipe-left reveals trash action
- **WHEN** user begins swiping left on a session entry row that has no sets logged
- **THEN** a red trash indicator is revealed behind the row as the row translates left

#### Scenario: Release past threshold removes slot
- **WHEN** user swipes left past the threshold and releases
- **THEN** the entry is removed from the active session view for the remainder of the session

#### Scenario: Release before threshold snaps back
- **WHEN** user swipes left but releases before the threshold
- **THEN** the row snaps back to its original position and the slot remains in the session

#### Scenario: Swipe disabled on rows with logged sets
- **WHEN** user attempts to swipe left on an entry that has at least one set logged
- **THEN** the gesture has no effect and the row does not translate

#### Scenario: Plan is unchanged after slot removal
- **WHEN** user removes a plan slot mid-session and completes the session
- **THEN** the training plan still contains the original slot on the next session start

#### Scenario: Removed slot is not logged
- **WHEN** a plan slot is removed from the session before any sets are logged
- **THEN** no session entry for that slot is created on session completion
