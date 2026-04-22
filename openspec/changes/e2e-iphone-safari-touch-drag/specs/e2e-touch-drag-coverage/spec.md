## ADDED Requirements

### Requirement: Touch-drag reorder with duplicate muscle groups shows correct exercises
When a session entry is drag-reordered on a plan that contains the same muscle group more than once, the exercise picker for each entry SHALL display exercises for its own muscle group slot — not stale data from a previously expanded slot that occupied the same index.

#### Scenario: Drag moves entry to earlier position — expanded slot shows correct exercises
- **WHEN** an active session has two slots for the same muscle group, exercise data has been loaded for both, the second slot is dragged before the first, and the user expands the moved slot
- **THEN** the exercise chips shown are for that slot's muscle group, not for the entry that previously occupied that index

#### Scenario: Drag moves entry to later position — remaining slot shows correct exercises
- **WHEN** an active session has two slots for the same muscle group, the first slot is dragged after the second, and the user expands the slot that shifted position
- **THEN** the exercise chips shown are for that slot's own muscle group data

#### Scenario: E2E drag test executes via touch events on iPhone emulation
- **WHEN** the Playwright iPhone 14 project runs the drag-reorder test
- **THEN** the test dispatches `touchstart`, `touchmove`, and `touchend` events and the drag completes without error
