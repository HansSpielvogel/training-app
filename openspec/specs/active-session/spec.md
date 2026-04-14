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
For each session entry (muscle group slot), the system SHALL display a smart rotation suggestion when one can be computed, followed by the last up to 3 distinct `ExerciseDefinition`s used for that muscle group across previous completed sessions (newest-first). The user SHALL be able to select the suggested variation, one of the recent variations, or any other `ExerciseDefinition` for the same muscle group from a full list. The chosen `ExerciseDefinition` SHALL be assigned to the entry.

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

---

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

---

### Requirement: Weight input notation
The weight input field SHALL accept short human notation and parse it into the correct `Weight` kind. Commas SHALL be accepted as decimal separators (normalized to dots before parsing). Negative values SHALL be accepted for assisted exercises (e.g. Klimmzug, Dips with support weight). A dedicated sign toggle control SHALL be available in the UI to prepend or remove a minus prefix, since the iOS decimal keyboard does not expose a minus key. An optional secondary "added weight" field SHALL be provided; when filled, it combines with the base weight field to produce a stacked weight without requiring `+` notation in the main field.

- Plain number (e.g. `"22.5"` or `"22,5"`) → `{ kind: 'single', value: 22.5 }`
- Negative number (e.g. `"-15"`) → `{ kind: 'single', value: -15 }`
- `"2×N"` or `"2xN"` (e.g. `"2x15"`) → `{ kind: 'bilateral', perSide: N }`
- `"B+A"` (e.g. `"31.5+2.3"`) → `{ kind: 'stacked', base: 31.5, added: 2.3 }`
- Base field `"B"` + added field `"A"` → `{ kind: 'stacked', base: B, added: A }`

Invalid input SHALL be flagged and prevent set submission.

#### Scenario: Parse single weight with dot
- **WHEN** user enters `"22.5"` in the weight field
- **THEN** it is parsed as `{ kind: 'single', value: 22.5 }`

#### Scenario: Parse single weight with comma
- **WHEN** user enters `"22,5"` in the weight field
- **THEN** it is parsed as `{ kind: 'single', value: 22.5 }`

#### Scenario: Parse negative weight
- **WHEN** user activates the minus toggle and enters `"15"` in the weight field
- **THEN** it is parsed as `{ kind: 'single', value: -15 }`

#### Scenario: Parse bilateral weight
- **WHEN** user enters `"2x15"` or `"2×15"` in the weight field
- **THEN** it is parsed as `{ kind: 'bilateral', perSide: 15 }`

#### Scenario: Parse stacked weight with comma
- **WHEN** user enters `"31,5+2,3"` in the weight field
- **THEN** it is parsed as `{ kind: 'stacked', base: 31.5, added: 2.3 }`

#### Scenario: Parse stacked weight via separate added field
- **WHEN** user enters `"12"` in the weight field and `"2.5"` in the added-weight field
- **THEN** it is parsed as `{ kind: 'stacked', base: 12, added: 2.5 }`

#### Scenario: Invalid weight input
- **WHEN** user enters an unparseable string in the weight field
- **THEN** an error is shown and the set cannot be submitted

---

### Requirement: Input zoom prevention
Every input field in the active session view — including weight, reps, RPE, and any other text input — SHALL render at a minimum font size of 16px to prevent iOS Safari from zooming the viewport on focus. This is fulfilled by the global CSS rule defined in the `pwa-shell` capability; no per-input inline styles are required.

#### Scenario: No zoom on weight input focus
- **WHEN** user taps the weight input on an iPhone
- **THEN** the viewport does not zoom in

#### Scenario: No zoom on reps input focus
- **WHEN** user taps the reps input on an iPhone
- **THEN** the viewport does not zoom in

#### Scenario: No zoom on RPE input focus
- **WHEN** user taps the RPE input on an iPhone
- **THEN** the viewport does not zoom in

---

### Requirement: Scroll input into view on focus
When a weight or reps input receives focus, the system SHALL scroll it into the visible area above the on-screen keyboard. The scroll SHALL be triggered after a short delay to allow the keyboard animation to complete.

#### Scenario: Input covered by keyboard
- **WHEN** user taps a weight or reps input that is in the lower portion of the screen
- **THEN** the input scrolls into the visible area above the keyboard

---

### Requirement: Complete session
The user SHALL be able to mark the in-progress session as completed. Completing the session SHALL record the end timestamp, set status to `completed`, and persist the session. Entries with no sets logged SHALL still be persisted (they were skipped).

#### Scenario: Complete session
- **WHEN** user taps "Finish workout"
- **THEN** the session status is set to `completed` with an end timestamp and the user is returned to the plan selection screen

#### Scenario: Session persisted on completion
- **WHEN** a session is completed
- **THEN** it is stored in IndexedDB and available for variation history queries in future sessions
