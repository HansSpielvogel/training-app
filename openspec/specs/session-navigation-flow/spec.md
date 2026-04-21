### Requirement: Auto-open next unfinished exercise
When a session entry slot is marked complete during an in-progress session, the system SHALL automatically expand the next unfinished session entry (skipping already-completed slots). If no unfinished slots remain, no slot SHALL be opened. The system SHALL scroll the newly opened slot into view.

#### Scenario: Auto-open next slot after completion
- **WHEN** user marks a session entry complete and there is at least one unfinished entry after it
- **THEN** the system automatically expands the next unfinished entry and scrolls it into view

#### Scenario: No unfinished slots remain
- **WHEN** user marks the last unfinished session entry complete
- **THEN** no slot is opened automatically

#### Scenario: Skip already-completed slots
- **WHEN** user marks entry #1 complete, entry #2 is already marked complete, and entry #3 is unfinished
- **THEN** the system skips entry #2 and auto-opens entry #3

---

### Requirement: Restore focus to active exercise on return
When the user navigates away from the active session view (e.g., to Stats tab) and returns while a session is in progress, the system SHALL automatically expand and scroll to the session entry that was active before navigation. An entry is considered active if the user has selected an exercise variation or logged at least one set, but has not yet marked the slot complete.

#### Scenario: Return to active exercise
- **WHEN** user has started logging sets for an entry, switches to Stats tab, and returns to active session view
- **THEN** the system expands and scrolls to that entry

#### Scenario: No active exercise
- **WHEN** user switches tabs and no entry has been started (no exercise selected, no sets logged)
- **THEN** no slot is auto-opened on return

#### Scenario: Active exercise completed while away
- **WHEN** user starts an exercise, switches tabs, marks it complete via another UI path (if applicable), and returns
- **THEN** the system does not open the now-completed entry
