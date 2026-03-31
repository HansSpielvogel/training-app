### Requirement: RPE scale range visible in input
The RPE input in the set logger SHALL display a visible `(1–10)` range indicator so the scale is immediately understood without prior knowledge. The indicator SHALL remain visible when the field is focused (not hidden as placeholder text alone).

#### Scenario: Range indicator visible before input
- **WHEN** the set logger is shown and the RPE field is empty
- **THEN** a `(1–10)` range indicator is visible on or next to the RPE field

#### Scenario: Range indicator visible on focus
- **WHEN** user taps the RPE field to enter a value
- **THEN** the `(1–10)` range indicator remains visible (not hidden by keyboard or focus state)
