## ADDED Requirements

### Requirement: Muscle-group filter on progression exercise list
The Progression tab exercise selection list SHALL display a horizontal scrollable row of filter chips, one per muscle group that has at least one exercise with session history. By default no chip is selected and all exercises are shown. Tapping a chip filters the list to exercises belonging to that muscle group; tapping the active chip again deselects it and restores the full list. Only one chip may be active at a time.

#### Scenario: No filter selected (default)
- **WHEN** the user opens the Progression tab
- **THEN** all exercises with session history are shown and no chip is highlighted

#### Scenario: Select a muscle-group filter chip
- **WHEN** the user taps a muscle-group chip
- **THEN** only exercises belonging to that muscle group are shown in the list and the chip appears selected

#### Scenario: Deselect the active chip
- **WHEN** the user taps the currently active muscle-group chip
- **THEN** the filter is cleared and all exercises with history are shown again

#### Scenario: Only relevant chips shown
- **WHEN** the Progression tab loads
- **THEN** only muscle groups that have at least one exercise with session history appear as chips; muscle groups with no history are omitted

#### Scenario: Filter chip row scrolls horizontally
- **WHEN** there are more muscle-group chips than fit the screen width
- **THEN** the chip row scrolls horizontally rather than wrapping to a second line
