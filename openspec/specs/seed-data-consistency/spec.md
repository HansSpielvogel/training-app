### Requirement: Torso Rotation is not suggested for general Bauch selection
"Torso Rotation" SHALL NOT be suggested when the user is selecting an exercise for the general Bauch (`mg-bauch`) muscle group — it belongs to the distinct side-abs (`mg-bauch-seite`) group.

#### Scenario: Selecting an exercise for general Bauch slot
- **WHEN** the user opens the variation picker for a slot whose muscle group is `mg-bauch`
- **THEN** "Torso Rotation" does not appear as a suggestion or in the exercise list for that slot

#### Scenario: Selecting an exercise for Bauch Seite slot
- **WHEN** the user opens the variation picker for a slot whose muscle group is `mg-bauch-seite`
- **THEN** "Torso Rotation" is available as before

#### Scenario: Seed data stays internally consistent
- **WHEN** `exercise-library.json` tagging for any exercise changes
- **THEN** `sessions-seed.json` is audited so every referencing entry's `muscleGroupId` remains one of that exercise's current `muscleGroupIds`
