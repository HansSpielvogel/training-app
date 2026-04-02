## MODIFIED Requirements

### Requirement: Completed session list
The system SHALL display a chronological list of all completed training sessions, ordered most recent first, each showing: date, plan name, and total number of exercises logged. Tapping a session card SHALL toggle an inline expansion that lists the exercises performed in that session.

Set summary format: if all sets for an exercise are identical, display `25 kg × 10 (3 sets)`; if sets differ, display each as a comma-separated list `25 kg × 10, 25 kg × 9`. RPE is appended as `@N` when logged and consistent across sets; omitted in the collapsed form when RPE varies between sets.

#### Scenario: Sessions exist
- **WHEN** the user views the training calendar screen
- **THEN** the system SHALL display each completed session as a card with date, plan name, and exercise count

#### Scenario: No completed sessions
- **WHEN** no completed sessions exist
- **THEN** the system SHALL display a message encouraging the user to complete their first session

#### Scenario: Expanding a session card
- **WHEN** the user taps a session card
- **THEN** the card SHALL expand inline to show the list of exercises logged in that session, each with its name and a formatted sets summary

#### Scenario: Collapsing a session card
- **WHEN** the user taps an already-expanded session card
- **THEN** the card SHALL collapse back to its default summary view
