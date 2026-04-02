## MODIFIED Requirements

### Requirement: Completed session list
The system SHALL display a chronological list of all completed training sessions, ordered most recent first, each showing: date, plan name, and total number of exercises logged. Tapping a session card SHALL toggle an inline expansion that lists the exercises performed in that session.

#### Scenario: Sessions exist
- **WHEN** the user views the training calendar screen
- **THEN** the system SHALL display each completed session as a card with date, plan name, and exercise count

#### Scenario: No completed sessions
- **WHEN** no completed sessions exist
- **THEN** the system SHALL display a message encouraging the user to complete their first session

#### Scenario: Expanding a session card
- **WHEN** the user taps a session card
- **THEN** the card SHALL expand inline to show the list of exercises logged in that session, each with its name and a summary of the sets performed (weight and reps)

#### Scenario: Collapsing a session card
- **WHEN** the user taps an already-expanded session card
- **THEN** the card SHALL collapse back to its default summary view
