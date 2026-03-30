### Requirement: Completed session list
The system SHALL display a chronological list of all completed training sessions, ordered most recent first, each showing: date, plan name, and total number of exercises logged.

#### Scenario: Sessions exist
- **WHEN** the user views the training calendar screen
- **THEN** the system SHALL display each completed session as a card with date, plan name, and exercise count

#### Scenario: No completed sessions
- **WHEN** no completed sessions exist
- **THEN** the system SHALL display a message encouraging the user to complete their first session

### Requirement: Analytics tab navigation
The system SHALL expose an Analytics tab in the bottom navigation bar, providing access to the training calendar, muscle group volume, and exercise progression views.

#### Scenario: Navigating to Analytics
- **WHEN** the user taps the "Stats" tab in the bottom navigation
- **THEN** the system SHALL navigate to the analytics section, defaulting to the training calendar view

### Requirement: Analytics section tabs
Within the Analytics section, the system SHALL provide tab-based navigation between the three analytics views: Calendar, Volume, and Progression.

#### Scenario: Switching analytics views
- **WHEN** the user taps a tab within the analytics section (Calendar, Volume, or Progression)
- **THEN** the system SHALL display the corresponding analytics view
