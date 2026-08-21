## MODIFIED Requirements

### Requirement: Collapse arrow reflects set-presence state
The collapse/expand arrow on a session entry row SHALL render in a green state whenever the entry has at least one logged set, using the same condition (`setCount > 0`) as the Done button's visibility.

#### Scenario: Entry has no sets
- **WHEN** a session entry has zero logged sets
- **THEN** the collapse arrow renders in its default (non-green) state

#### Scenario: Entry has at least one set
- **WHEN** a session entry has one or more logged sets
- **THEN** the collapse arrow renders in a green state, regardless of expanded/collapsed or done/not-done state
