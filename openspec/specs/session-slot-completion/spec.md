### Requirement: Mark slot as done
The user SHALL be able to mark a session entry slot as done via a dedicated button. The Done button SHALL only be visible when at least one set has been logged for that slot. The done state is UI-only and ephemeral — it does not affect the persisted session data. Sets logged to the slot remain visible and editable after the slot is marked done. When a slot is marked done, the clear-exercise button for that slot SHALL be hidden.

Collapsing an expanded slot that has at least one logged set also marks it as done (same visual and behavioural result as pressing the Done button).

#### Scenario: Mark slot done via button
- **WHEN** the user taps the "Done" button on an expanded slot (requires at least one set logged)
- **THEN** the slot shows a green done indicator, the clear-exercise button is hidden, and the done callback fires

#### Scenario: Done button hidden until sets are logged
- **WHEN** a slot is expanded but no sets have been logged yet
- **THEN** the Done button is not shown

#### Scenario: Mark slot done via collapse
- **WHEN** the user collapses a slot that has at least one logged set
- **THEN** the slot shows a green done indicator and the clear-exercise button is hidden

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
