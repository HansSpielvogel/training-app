## ADDED Requirements

### Requirement: Moved sum calculation
The system SHALL compute a `movedSum` value for each session data point in the exercise progression. `movedSum` is defined as the sum of `normalizedWeight × reps` across all sets logged for the exercise in that session. Weight normalization follows the same rules as the progression chart: `single → value`, `bilateral → perSide`, `stacked → base + added`. Sets with zero reps or unparseable weight SHALL be excluded from the sum. `movedSum` SHALL be exposed as an optional field on `ExerciseProgressionPoint` in the analytics domain.

#### Scenario: Moved sum computed for a session with uniform sets
- **WHEN** a session has 3 sets of 60 kg × 10 reps
- **THEN** `movedSum` for that session is 1800 (60 × 10 × 3)

#### Scenario: Moved sum computed for a session with varying sets
- **WHEN** a session has sets: 60 kg × 10, 65 kg × 8, 65 kg × 7
- **THEN** `movedSum` is 60×10 + 65×8 + 65×7 = 600 + 520 + 455 = 1575

#### Scenario: Session with bilateral weight
- **WHEN** a set has `{ kind: 'bilateral', perSide: 15 }` × 12 reps
- **THEN** the contribution to `movedSum` is 15 × 12 = 180 (perSide, consistent with chart normalization)

#### Scenario: Session with stacked weight
- **WHEN** a set has `{ kind: 'stacked', base: 31.5, added: 2.5 }` × 10 reps
- **THEN** the contribution to `movedSum` is 34 × 10 = 340

### Requirement: Moved sum metric display in progression screen
The exercise progression screen SHALL offer a metric selector with three options: **Weight**, **Reps**, and **Volume**. The selected metric determines what is displayed in both chart and list views. The metric selector SHALL be visible when progression data is present. Default selected metric is **Weight** (preserving existing behavior).

In **chart view**:
- **Weight** selected: shows the existing weight line chart (max weight per session, blue)
- **Reps** selected: shows average reps per session as a line chart (orange)
- **Volume** selected: shows moved sum per session as a line chart (purple), Y-axis labelled "kg moved"

In **list view**, each row displays the value of the selected metric for that session alongside the date and sets summary.

#### Scenario: Default metric is Weight
- **WHEN** user navigates to the progression screen and selects an exercise
- **THEN** the Weight metric is active and the existing chart/list behavior is unchanged

#### Scenario: Select Volume metric in chart view
- **WHEN** user selects the Volume metric while in chart view
- **THEN** the chart displays a line of moved-sum values per session with the Y-axis labelled "kg moved"

#### Scenario: Select Volume metric in list view
- **WHEN** user selects the Volume metric while in list view
- **THEN** each session row shows the moved sum value (e.g., "1 800 kg moved") alongside the date and sets

#### Scenario: Select Reps metric in chart view
- **WHEN** user selects the Reps metric while in chart view
- **THEN** the chart displays a single average-reps line (orange), same scale as the existing reps secondary axis

#### Scenario: Metric selection persists when toggling chart/list
- **WHEN** user selects Volume, then switches from chart to list view
- **THEN** the list view shows volume values; switching back to chart still shows Volume chart

#### Scenario: No moved sum data available
- **WHEN** an exercise session has no sets with valid weight and reps
- **THEN** that session is omitted from the Volume chart and list metric display
