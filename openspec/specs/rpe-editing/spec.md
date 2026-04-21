### Requirement: Edit RPE on logged set
During an in-progress session, the user SHALL be able to edit the RPE value of any already-logged set within that session. The edit action SHALL update the RPE field of the existing `SessionSet` entity without modifying weight, reps, or set order. Editing RPE SHALL NOT be available after the session is completed.

#### Scenario: Edit RPE on logged set
- **WHEN** user taps the edit icon next to an RPE value on a logged set in an in-progress session
- **THEN** an inline input appears allowing the user to enter a new RPE value (1–10)

#### Scenario: Confirm RPE edit
- **WHEN** user enters a new RPE value and confirms
- **THEN** the set's RPE is updated and the new value is displayed

#### Scenario: Cancel RPE edit
- **WHEN** user opens the RPE edit input and cancels without saving
- **THEN** the original RPE value remains unchanged

#### Scenario: RPE edit unavailable after session completion
- **WHEN** the session status is `completed`
- **THEN** no edit affordance is shown on logged sets

#### Scenario: Edit RPE on set with no prior RPE
- **WHEN** user edits a set that was logged without an RPE value
- **THEN** the system allows setting an RPE value (1–10) for the first time
