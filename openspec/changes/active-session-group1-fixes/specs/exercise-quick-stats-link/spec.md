## ADDED Requirements

### Requirement: Direct link to exercise history/stats from the variation picker
When selecting an exercise for a muscle group slot in an active session, the user SHALL be able to jump directly to that exercise's history/stats/progression view without first selecting it as the active variation.

#### Scenario: User taps stats shortcut on a suggestion chip
- **WHEN** the user taps the stats/history shortcut on the suggested exercise chip
- **THEN** the app navigates to that exercise's history/stats/progression view
- **AND** the exercise is not marked as selected for the current slot

#### Scenario: User taps stats shortcut on a chip in the expanded "Other…" list
- **WHEN** the user expands the full exercise list and taps the stats shortcut on any listed exercise
- **THEN** the app navigates to that exercise's history/stats/progression view
- **AND** the current slot's selection is unchanged
