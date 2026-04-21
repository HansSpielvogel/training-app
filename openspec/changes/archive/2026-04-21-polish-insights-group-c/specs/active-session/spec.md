## MODIFIED Requirements

### Requirement: Log sets
Once an exercise variation is assigned to a session entry, the user SHALL be able to log sets in one of two modes. The default mode is **quick mode**: the user enters weight, reps, and an optional RPE (1–10) once and taps "Log N sets" to add N identical sets at once, where N is the `defaultSets` value of the assigned exercise (defaulting to 3 if not set). A **segmented control** with two labelled segments — "Quick" and "Individual" — SHALL be displayed above the input fields, allowing the user to switch between modes. The mode toggle is available at any time and does not affect already-logged sets. Sets SHALL be displayed in the order they were added. The user SHALL be able to remove the last added set. When a set is logged, that entry SHALL become the active entry if it is not already active.

In **individual mode**, when at least one set has already been logged in the current session entry, the weight and reps input fields SHALL be prefilled with the values from the most recently logged set.

#### Scenario: Add sets in quick mode (default)
- **WHEN** user submits weight and reps in quick mode
- **THEN** N identical sets are appended to the entry, inputs reset, and the entry becomes active

#### Scenario: Switch to individual mode via segmented control
- **WHEN** user taps the "Individual" segment
- **THEN** the logger switches to individual mode: one set is added per submit

#### Scenario: Switch back to quick mode via segmented control
- **WHEN** user taps the "Quick" segment while in individual mode
- **THEN** the logger returns to quick mode

#### Scenario: Both mode options are always visible
- **WHEN** the set logger is open for an entry with an assigned exercise
- **THEN** the segmented control shows both "Quick" and "Individual" segments with the current mode highlighted

#### Scenario: Remove last set
- **WHEN** user taps remove on the last set
- **THEN** that set is deleted from the entry regardless of current mode

#### Scenario: Cannot add set without variation
- **WHEN** no exercise variation is assigned to the entry
- **THEN** the add-set action is unavailable

#### Scenario: Individual mode prefills from previous set
- **WHEN** user is in individual mode and has already logged at least one set in the current entry
- **THEN** the weight and reps inputs are prefilled with the values from the most recently logged set

#### Scenario: Individual mode first set — no prefill
- **WHEN** user switches to individual mode and no sets have been logged yet in the current entry
- **THEN** the weight and reps inputs are empty
