### Requirement: RPE input in set logger
The user MAY enter an optional RPE value (integer 1–10) when logging a set. The RPE input SHALL be shown inline in the set logger but SHALL NOT block set submission when left empty. In quick mode, if an RPE value is entered, it SHALL be applied to all N sets being bulk-logged. In individual mode, each set submission uses the RPE value entered at that moment.

#### Scenario: Log set with RPE
- **WHEN** user enters a weight, reps, and an RPE value (1–10) and submits
- **THEN** the set is added with the RPE value stored on the SessionSet

#### Scenario: Log set without RPE
- **WHEN** user enters weight and reps but leaves the RPE input empty and submits
- **THEN** the set is added with no RPE value (rpe is undefined on the SessionSet)

#### Scenario: Invalid RPE rejected
- **WHEN** user enters an RPE value outside 1–10 (e.g. 0, 11, or non-integer)
- **THEN** an error is shown and the set cannot be submitted

#### Scenario: RPE applied to all sets in quick mode
- **WHEN** user submits in quick mode with an RPE value entered
- **THEN** each of the N bulk-logged sets has the same RPE value stored

#### Scenario: RPE cleared after quick-mode submission
- **WHEN** sets are submitted in quick mode
- **THEN** the RPE input resets alongside the weight and reps inputs
