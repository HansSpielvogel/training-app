## MODIFIED Requirements

### Requirement: Pick exercise variation per slot
For each session entry (muscle group slot), the system SHALL display a smart rotation suggestion when one can be computed, followed by the last up to 3 distinct `ExerciseDefinition`s used for that muscle group across previous completed sessions (newest-first). The user SHALL be able to select the suggested variation, one of the recent variations, or any other `ExerciseDefinition` for the same muscle group from a full list. The chosen `ExerciseDefinition` SHALL be assigned to the entry. When an exercise is selected, that entry SHALL become the active entry.

The rotation suggestion is derived from the last 5 completed sessions containing an entry for the slot's muscle group. The `ExerciseDefinition` used least frequently among those sessions is suggested, excluding the most recently used exercise. On a count tie, the one used longest ago is preferred. No suggestion is shown when fewer than 2 distinct exercises appear in those 5 sessions, or when all non-recent candidates share the same frequency.

#### Scenario: Recent variations shown
- **WHEN** user opens a slot to log sets
- **THEN** up to 3 most recently used ExerciseDefinitions for that muscle group are displayed as quick-pick options

#### Scenario: Rotation suggestion shown
- **WHEN** user opens a slot and the rotation algorithm finds a least-used exercise that is not the most recently used among the last 5 sessions
- **THEN** a 💡 suggestion chip is displayed inline with the recent-variations list identifying the recommended ExerciseDefinition

#### Scenario: No rotation suggestion
- **WHEN** user opens a slot and fewer than 2 distinct exercises appear in the last 5 sessions, or all non-recent candidates are equally frequently used
- **THEN** no suggestion chip is shown and only the recent-variations list appears

#### Scenario: Pick rotation suggestion
- **WHEN** user taps the rotation suggestion chip
- **THEN** that ExerciseDefinition is assigned to the entry and the entry becomes active

#### Scenario: Pick recent variation
- **WHEN** user taps a recent variation
- **THEN** that ExerciseDefinition is assigned to the entry and the entry becomes active

#### Scenario: Pick from full list
- **WHEN** user opens the full exercise picker for a muscle group
- **THEN** all ExerciseDefinitions for that muscle group are shown and user can select one

#### Scenario: No history available
- **WHEN** no completed sessions exist with data for this muscle group
- **THEN** no recent variations are shown and user must pick from the full list

---

### Requirement: Log sets
Once an exercise variation is assigned to a session entry, the user SHALL be able to log sets in one of two modes. The default mode is **quick mode**: the user enters weight, reps, and an optional RPE (1–10) once and taps "Log N sets" to add N identical sets at once, where N is the `defaultSets` value of the assigned exercise (defaulting to 3 if not set). A toggle button SHALL allow switching to **individual mode**, where the user adds one set at a time. The mode toggle is available at any time and does not affect already-logged sets. Sets SHALL be displayed in the order they were added. The user SHALL be able to remove the last added set. When a set is logged, that entry SHALL become the active entry if it is not already active.

In **individual mode**, when at least one set has already been logged in the current session entry, the weight and reps input fields SHALL be prefilled with the values from the most recently logged set.

#### Scenario: Add sets in quick mode (default)
- **WHEN** user submits weight and reps in quick mode
- **THEN** N identical sets are appended to the entry, inputs reset, and the entry becomes active

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

#### Scenario: Individual mode prefills from previous set
- **WHEN** user is in individual mode and has already logged at least one set in the current entry
- **THEN** the weight and reps inputs are prefilled with the values from the most recently logged set

#### Scenario: Individual mode first set — no prefill
- **WHEN** user switches to individual mode and no sets have been logged yet in the current entry
- **THEN** the weight and reps inputs are empty
