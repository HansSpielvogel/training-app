## MODIFIED Requirements

### Requirement: Browse exercise definitions
The system SHALL display all exercise definitions, sorted alphabetically by name. Each entry SHALL show its associated muscle group names. Each entry SHALL also show a formatted summary of all sets from the most recent session for that exercise if any history exists; entries with no history SHALL show no history indicator.

Set summary format: if all sets in the session are identical, display `25 kg × 10 (3 sets)`; if sets differ, display each as a comma-separated list `25 kg × 10, 25 kg × 9`. RPE is appended as `@N` when logged.

#### Scenario: List is empty
- **WHEN** no exercise definitions exist
- **THEN** the system displays an empty state with a prompt to add the first exercise definition

#### Scenario: List has entries with no history
- **WHEN** one or more exercise definitions exist but none have been logged in a completed session
- **THEN** the system displays each definition with its name and associated muscle groups, with no last-used sets shown

#### Scenario: List has entries with history
- **WHEN** one or more exercise definitions have been logged in at least one completed session
- **THEN** each such entry displays a formatted sets summary from the most recent session alongside the name and muscle groups

#### Scenario: Filter applied
- **WHEN** the user selects a muscle group filter
- **THEN** only exercise definitions associated with that muscle group are shown, each with their last-used sets summary if available

#### Scenario: Filter cleared
- **WHEN** the user clears the filter
- **THEN** all exercise definitions are shown with their last-used sets summary if available
