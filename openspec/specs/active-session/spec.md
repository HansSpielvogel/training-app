### Requirement: Start session from plan
The system SHALL allow the user to start a new training session by selecting a training plan. Starting a session SHALL create a `TrainingSession` with status `in-progress`, recording the plan ID, plan name (snapshot), and start timestamp. The session SHALL contain one `SessionEntry` slot per `PlanSlot` in the plan, pre-populated with the plan slot's muscle group ID, but with no exercise or sets yet.

#### Scenario: Start session
- **WHEN** user selects a training plan and taps "Start"
- **THEN** a new in-progress TrainingSession is created and the active session view opens

#### Scenario: Cannot start two concurrent sessions
- **WHEN** there is already an in-progress session
- **THEN** the system SHALL prevent starting a new one and show the existing session instead

---

### Requirement: Pick exercise variation per slot
For each session entry (muscle group slot), the system SHALL display the last up to 4 distinct `ExerciseDefinition`s used for that muscle group across previous completed sessions (newest-first). The user SHALL be able to select one of these recent variations or choose any other `ExerciseDefinition` for the same muscle group from a full list. The chosen `ExerciseDefinition` SHALL be assigned to the entry.

#### Scenario: Recent variations shown
- **WHEN** user opens a slot to log sets
- **THEN** up to 4 most recently used ExerciseDefinitions for that muscle group are displayed as quick-pick options

#### Scenario: Pick recent variation
- **WHEN** user taps a recent variation
- **THEN** that ExerciseDefinition is assigned to the entry

#### Scenario: Pick from full list
- **WHEN** user opens the full exercise picker for a muscle group
- **THEN** all ExerciseDefinitions for that muscle group are shown and user can select one

#### Scenario: No history available
- **WHEN** no completed sessions exist with data for this muscle group
- **THEN** no recent variations are shown and user must pick from the full list

---

### Requirement: Log sets
Once an exercise variation is assigned to a session entry, the user SHALL be able to add sets. Each set SHALL record weight (a `Weight` value) and reps (positive integer). Sets SHALL be displayed in the order they were added. The user SHALL be able to remove the last added set.

#### Scenario: Add a set
- **WHEN** user submits weight and reps for a set
- **THEN** the set is appended to the entry's set list and the inputs reset for the next set

#### Scenario: Remove last set
- **WHEN** user taps remove on the last set
- **THEN** that set is deleted from the entry

#### Scenario: Cannot add set without variation
- **WHEN** no exercise variation is assigned to the entry
- **THEN** the add-set action is unavailable

---

### Requirement: Weight input notation
The weight input field SHALL accept short human notation and parse it into the correct `Weight` kind:
- Plain number (e.g. `"22.5"`) → `{ kind: 'single', value: 22.5 }`
- `"2×N"` or `"2xN"` (e.g. `"2x15"`) → `{ kind: 'bilateral', perSide: N }`
- `"B+A"` (e.g. `"31.5+2.3"`) → `{ kind: 'stacked', base: 31.5, added: 2.3 }`

Invalid input SHALL be flagged and prevent set submission.

#### Scenario: Parse single weight
- **WHEN** user enters `"22.5"` in the weight field
- **THEN** it is parsed as `{ kind: 'single', value: 22.5 }`

#### Scenario: Parse bilateral weight
- **WHEN** user enters `"2x15"` or `"2×15"` in the weight field
- **THEN** it is parsed as `{ kind: 'bilateral', perSide: 15 }`

#### Scenario: Parse stacked weight
- **WHEN** user enters `"31.5+2.3"` in the weight field
- **THEN** it is parsed as `{ kind: 'stacked', base: 31.5, added: 2.3 }`

#### Scenario: Invalid weight input
- **WHEN** user enters an unparseable string in the weight field
- **THEN** an error is shown and the set cannot be submitted

---

### Requirement: Complete session
The user SHALL be able to mark the in-progress session as completed. Completing the session SHALL record the end timestamp, set status to `completed`, and persist the session. Entries with no sets logged SHALL still be persisted (they were skipped).

#### Scenario: Complete session
- **WHEN** user taps "Finish workout"
- **THEN** the session status is set to `completed` with an end timestamp and the user is returned to the plan selection screen

#### Scenario: Session persisted on completion
- **WHEN** a session is completed
- **THEN** it is stored in IndexedDB and available for variation history queries in future sessions
