## ADDED Requirements

### Requirement: Preset inputs from last session
When an exercise is assigned to a session entry and prior set data exists for that exercise, the system SHALL display a compact preset button inside the set logger showing a summary of the last session's data (e.g. `⟲ Last: 60 kg × 10 × 3`). Tapping the button SHALL pre-fill the weight, reps, and RPE input fields with the values from the first set of the most recent prior session for that exercise. RPE is only filled if the prior set recorded one. Tapping the button does not submit a set — it only fills the inputs. The button SHALL only be shown when `lastSets` is non-null and non-empty.

In quick mode, the shared weight, reps, and RPE fields are filled. In individual mode, the weight and reps fields are filled from the first set of the prior session.

#### Scenario: Preset button visible when prior data exists
- **WHEN** user has assigned an exercise and the exercise has been logged in a prior completed session
- **THEN** a preset button showing a summary of the last session's data is displayed in the set logger

#### Scenario: Preset button absent when no prior data
- **WHEN** user has assigned an exercise that has never been logged before
- **THEN** no preset button is shown

#### Scenario: Preset fills weight and reps in quick mode
- **WHEN** user taps the preset button in quick mode
- **THEN** the weight and reps input fields are filled with the values from the first set of the last session for that exercise

#### Scenario: Preset fills RPE when prior RPE exists
- **WHEN** the prior session's first set recorded an RPE value and user taps the preset button
- **THEN** the RPE field is also filled with that value

#### Scenario: Preset leaves RPE blank when prior RPE absent
- **WHEN** the prior session's first set has no RPE and user taps the preset button
- **THEN** the RPE field remains empty

#### Scenario: Preset fills weight and reps in individual mode
- **WHEN** user taps the preset button in individual mode
- **THEN** the weight and reps inputs are filled from the first set of the last session for that exercise

#### Scenario: Preset does not auto-submit
- **WHEN** user taps the preset button
- **THEN** no sets are logged automatically; user must tap the log button to record a set
