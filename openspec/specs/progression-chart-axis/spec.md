### Requirement: Progression chart y-axis shows intermediate values
Each metric axis (weight, reps, volume) in the progression chart SHALL display intermediate tick values between the minimum and maximum, computed as rounded "nice numbers", so users can read approximate values without interpolating between two extremes.

#### Scenario: Chart with widely spread data points
- **WHEN** a progression chart renders data with roughly 8 entries and a wide value range
- **THEN** the y-axis shows 3-5 evenly spaced, rounded intermediate tick labels between min and max, in addition to the min/max labels

#### Scenario: Chart with a narrow value range
- **WHEN** all data points fall within a small range (e.g. 45-50 kg)
- **THEN** the y-axis still shows readable intermediate ticks without duplicate or overlapping labels
