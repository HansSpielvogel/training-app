### Requirement: Add temp muscle group slot
During an active session, the user SHALL be able to add a new muscle group slot not present in the original training plan. The added slot SHALL be treated as temporary: it participates fully in the session (exercise assignment, set logging, done state) and is persisted as part of the completed session, but it SHALL NOT modify the training plan. Temp slots SHALL be visually distinguished from plan slots (e.g. a "temp" badge).

#### Scenario: Add a temp slot
- **WHEN** user taps "Add muscle group" during an active session and selects a muscle group
- **THEN** a new session entry slot for that muscle group is appended to the session with isTemp: true, and the user can assign an exercise and log sets to it

#### Scenario: Temp slot persisted in completed session
- **WHEN** the session is completed with at least one temp slot
- **THEN** the temp slot and any sets logged to it are saved in the completed TrainingSession

#### Scenario: Training plan is not modified
- **WHEN** a temp slot is added to an active session
- **THEN** the original TrainingPlan remains unchanged

---

### Requirement: Remove temp slot
The user SHALL be able to remove a temp slot from the active session, but only when no sets have been logged to it. Removing a temp slot with logged sets SHALL be blocked to prevent accidental data loss.

#### Scenario: Remove empty temp slot
- **WHEN** user taps the remove button on a temp slot that has no sets logged
- **THEN** the temp slot is removed from the active session

#### Scenario: Cannot remove temp slot with sets
- **WHEN** a temp slot has at least one set logged
- **THEN** the remove button is disabled (or hidden) for that slot

#### Scenario: Cannot remove original plan slots
- **WHEN** user views a slot that originated from the training plan
- **THEN** no remove option is shown

---

### Requirement: Add another plan's slots as temp
During an active session, the user SHALL be able to select a training plan and add all of its muscle group slots as temp slots to the current session. Only muscle groups not already represented in the session (by any existing entry, original or temp) SHALL be added. If all muscle groups from the target plan are already present in the session, no slots are added.

#### Scenario: Add plan slots — some new muscle groups
- **WHEN** user selects a training plan to add and it contains muscle groups not already in the session
- **THEN** temp slots for those new muscle groups are appended to the session

#### Scenario: Add plan slots — all already present
- **WHEN** user selects a training plan to add and all its muscle groups are already covered by session entries
- **THEN** no slots are added and a message informs the user

#### Scenario: Slots added as temp
- **WHEN** slots are added from another training plan
- **THEN** they are marked isTemp: true and the original training plans remain unchanged
