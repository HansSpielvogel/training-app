### Requirement: Mark slot as done
The user SHALL be able to mark a session entry slot as done via a dedicated button. The done state is UI-only and ephemeral — it does not affect the persisted session data. Sets logged to the slot remain visible and editable after the slot is marked done. When a slot is marked done, the clear-exercise button for that slot SHALL be hidden.

#### Scenario: Mark slot done via button
- **WHEN** the user taps the "Done" button on an expanded slot
- **THEN** the slot shows a green done indicator, the clear-exercise button is hidden, and the done callback fires

#### Scenario: Sets remain editable after done
- **WHEN** a slot is marked done
- **THEN** the slot can still be expanded and sets can still be added or removed

---

### Requirement: Auto-expand next incomplete slot
After a session entry slot is finished — either by pressing the done button or by collapsing a slot that has at least one logged set — the system SHALL automatically expand the next incomplete slot in plan order. An incomplete slot is any slot not yet marked done and not yet collapsed after logging.

#### Scenario: Auto-expand after done button
- **WHEN** the user taps the done button on slot N
- **THEN** the lowest-indexed slot after N that is not done automatically expands

#### Scenario: Auto-expand after log-and-collapse
- **WHEN** the user collapses a slot that has at least one logged set
- **THEN** the lowest-indexed slot after it that is not done automatically expands

#### Scenario: No incomplete slot remaining
- **WHEN** the user finishes the last incomplete slot
- **THEN** no slot is auto-expanded
