## MODIFIED Requirements

### Requirement: Log sets
Once an exercise variation is assigned to a session entry, the user SHALL be able to log sets in one of two modes. The default mode is **quick mode**: the user enters weight, reps, and an optional RPE (1–10) once and taps "Log N sets" to add N identical sets at once, where N is the `defaultSets` value of the assigned exercise (defaulting to 3 if not set). A toggle button SHALL allow switching to **individual mode**, where the user adds one set at a time. The mode toggle is available at any time and does not affect already-logged sets. Sets SHALL be displayed in the order they were added. The user SHALL be able to remove the last added set.

#### Scenario: Add sets in quick mode (default)
- **WHEN** user submits weight and reps in quick mode
- **THEN** N identical sets are appended to the entry and inputs reset

#### Scenario: Switch to individual mode
- **WHEN** user taps the individual mode toggle
- **THEN** the logger switches to individual mode: one set is added per submit

#### Scenario: Switch back to quick mode
- **WHEN** user taps the quick mode toggle while in individual mode
- **THEN** the logger returns to quick mode

#### Scenario: Remove last set
- **WHEN** user taps remove on the last set
- **THEN** that set is deleted from the entry regardless of current mode

#### Scenario: Cannot add set without variation
- **WHEN** no exercise variation is assigned to the entry
- **THEN** the add-set action is unavailable
