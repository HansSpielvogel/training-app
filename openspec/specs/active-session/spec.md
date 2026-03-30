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
For each session entry (muscle group slot), the system SHALL display a smart rotation suggestion when one can be computed, followed by the last up to 4 distinct `ExerciseDefinition`s used for that muscle group across previous completed sessions (newest-first). The user SHALL be able to select the suggested variation, one of the recent variations, or any other `ExerciseDefinition` for the same muscle group from a full list. The chosen `ExerciseDefinition` SHALL be assigned to the entry.

The rotation suggestion is derived from the last 5 completed sessions containing an entry for the slot's muscle group. The `ExerciseDefinition` used least frequently among those sessions is suggested, excluding the most recently used exercise. On a count tie, the one used longest ago is preferred. No suggestion is shown when fewer than 2 distinct exercises appear in those 5 sessions, or when all non-recent candidates share the same frequency.

#### Scenario: Recent variations shown
- **WHEN** user opens a slot to log sets
- **THEN** up to 4 most recently used ExerciseDefinitions for that muscle group are displayed as quick-pick options

#### Scenario: Rotation suggestion shown
- **WHEN** user opens a slot and the rotation algorithm finds a least-used exercise that is not the most recently used among the last 5 sessions
- **THEN** a suggestion chip is displayed above the recent-variations list identifying the recommended ExerciseDefinition

#### Scenario: No rotation suggestion
- **WHEN** user opens a slot and fewer than 2 distinct exercises appear in the last 5 sessions, or all non-recent candidates are equally frequently used
- **THEN** no suggestion chip is shown and only the recent-variations list appears

#### Scenario: Pick rotation suggestion
- **WHEN** user taps the rotation suggestion chip
- **THEN** that ExerciseDefinition is assigned to the entry

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
Once an exercise variation is assigned to a session entry, the user SHALL be able to log sets in one of two modes. The default mode is **quick mode**: the user enters weight and reps once and taps "Log N sets" to add N identical sets at once, where N is the `defaultSets` value of the assigned exercise (defaulting to 3 if not set). A toggle button SHALL allow switching to **individual mode**, where the user adds one set at a time. The mode toggle is available at any time and does not affect already-logged sets. Sets SHALL be displayed in the order they were added. The user SHALL be able to remove the last added set.

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
