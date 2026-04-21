## MODIFIED Requirements

### Requirement: Remove plan slot from active session
The user SHALL be able to remove any slot from the active session, including plan-defined slots (not only temp slots). Removing a plan slot SHALL dismiss it from the current session view only; the underlying training plan SHALL NOT be modified. The removal is ephemeral and is not persisted beyond the current session.

Removal is triggered by a two-step gesture: swipe-left to reveal the trash button, then tap the button to confirm removal. Swiping left SHALL reveal a red trash button behind the row. When the swipe passes the snap threshold (≥40px), releasing snaps the row open and keeps the trash button visible. Tapping the trash button commits the removal. Slots that have at least one set logged SHALL NOT be removable; the gesture is disabled on those rows.

#### Scenario: Swipe-left reveals trash button
- **WHEN** user swipes left past the snap threshold (≥40px) on an entry with no sets logged and releases
- **THEN** the row snaps fully open (80px) and the red trash button remains visible

#### Scenario: Tap trash button removes slot
- **WHEN** the trash button is visible and the user taps it
- **THEN** the entry is removed from the active session view for the remainder of the session

#### Scenario: Release before threshold snaps back
- **WHEN** user swipes left but releases before the snap threshold (<40px)
- **THEN** the row snaps back to its original position and the slot remains in the session

#### Scenario: Swipe-right closes revealed trash button
- **WHEN** the row is in the open (trash visible) state and user swipes right
- **THEN** the row snaps back to its original position, hiding the trash button

#### Scenario: Swipe disabled on rows with logged sets
- **WHEN** user attempts to swipe left on an entry that has at least one set logged
- **THEN** the gesture has no effect and the row does not translate

#### Scenario: Plan is unchanged after slot removal
- **WHEN** user removes a plan slot mid-session and completes the session
- **THEN** the training plan still contains the original slot on the next session start

#### Scenario: Removed slot is not logged
- **WHEN** a plan slot is removed from the session before any sets are logged
- **THEN** no session entry for that slot is created on session completion
