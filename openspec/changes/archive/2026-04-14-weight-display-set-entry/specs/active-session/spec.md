## MODIFIED Requirements

### Requirement: Log sets
Once an exercise variation is assigned to a session entry, the user SHALL be able to log sets in one of two modes. The default mode is **quick mode**: the user enters weight, reps, and an optional RPE (1–10) once and taps "Log N sets" to add N identical sets at once, where N is the `defaultSets` value of the assigned exercise (defaulting to 3 if not set). A toggle button SHALL allow switching to **individual mode**, where the user adds one set at a time. The mode toggle is available at any time and does not affect already-logged sets. Sets SHALL be displayed in the order they were added. The user SHALL be able to remove the last added set.

In **individual mode**, when at least one set has already been logged in the current session entry, the weight and reps input fields SHALL be prefilled with the values from the most recently logged set.

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

#### Scenario: Individual mode prefills from previous set
- **WHEN** user is in individual mode and has already logged at least one set in the current entry
- **THEN** the weight and reps inputs are prefilled with the values from the most recently logged set

#### Scenario: Individual mode first set — no prefill
- **WHEN** user switches to individual mode and no sets have been logged yet in the current entry
- **THEN** the weight and reps inputs are empty

### Requirement: Last weight display
In the active session slot, the system SHALL display the weights and reps from the most recent prior session's sets for the same exercise (the "Last:" line) using the following formatting rules:

- **Single weight**: displayed as `{value} kg` (e.g. `22.5 kg`)
- **Bilateral weight**: displayed as `{perSide} kg/side` (e.g. `15 kg/side`)
- **Stacked weight (general)**: displayed as `{base} +{added} kg` (e.g. `31.5 +2.5 kg`) — components are shown separately, NOT summed
- **Stacked weight for Langhantel (LH) exercises**: displayed as `LH +{added} kg` (e.g. `LH +10 kg`) — the bar weight is implicit and the base is omitted. An exercise is LH when its name ends with ` LH`.

When all sets share the same weight and reps, the display SHALL be compact: `{weight} × {reps} ({N} sets)`.

#### Scenario: Last stacked weight shown separately
- **WHEN** the previous session's sets used `{ kind: 'stacked', base: 31.5, added: 2.5 }`
- **THEN** the "Last:" line shows `31.5 +2.5 kg × {reps}`

#### Scenario: Last LH weight shows only added
- **WHEN** the exercise name ends with ` LH` and previous sets used `{ kind: 'stacked', base: 20, added: 10 }`
- **THEN** the "Last:" line shows `LH +10 kg × {reps}`

#### Scenario: Last single weight unchanged
- **WHEN** previous sets used `{ kind: 'single', value: 22.5 }`
- **THEN** the "Last:" line shows `22.5 kg × {reps}`
