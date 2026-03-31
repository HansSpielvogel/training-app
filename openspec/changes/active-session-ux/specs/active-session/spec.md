## MODIFIED Requirements

### Requirement: Weight input notation
The weight input field SHALL accept short human notation and parse it into the correct `Weight` kind. Commas SHALL be accepted as decimal separators (normalized to dots before parsing). Negative values SHALL be accepted for assisted exercises (e.g. Klimmzug, Dips with support weight). A dedicated sign toggle control SHALL be available in the UI to prepend or remove a minus prefix, since the iOS decimal keyboard does not expose a minus key.

- Plain number (e.g. `"22.5"` or `"22,5"`) → `{ kind: 'single', value: 22.5 }`
- Negative number (e.g. `"-15"`) → `{ kind: 'single', value: -15 }`
- `"2×N"` or `"2xN"` (e.g. `"2x15"`) → `{ kind: 'bilateral', perSide: N }`
- `"B+A"` (e.g. `"31.5+2.3"` or `"31,5+2,3"`) → `{ kind: 'stacked', base: 31.5, added: 2.3 }`

Invalid input SHALL be flagged and prevent set submission.

#### Scenario: Parse single weight with dot
- **WHEN** user enters `"22.5"` in the weight field
- **THEN** it is parsed as `{ kind: 'single', value: 22.5 }`

#### Scenario: Parse single weight with comma
- **WHEN** user enters `"22,5"` in the weight field
- **THEN** it is parsed as `{ kind: 'single', value: 22.5 }`

#### Scenario: Parse negative weight
- **WHEN** user activates the minus toggle and enters `"15"` in the weight field
- **THEN** it is parsed as `{ kind: 'single', value: -15 }`

#### Scenario: Parse bilateral weight
- **WHEN** user enters `"2x15"` or `"2×15"` in the weight field
- **THEN** it is parsed as `{ kind: 'bilateral', perSide: 15 }`

#### Scenario: Parse stacked weight with comma
- **WHEN** user enters `"31,5+2,3"` in the weight field
- **THEN** it is parsed as `{ kind: 'stacked', base: 31.5, added: 2.3 }`

#### Scenario: Invalid weight input
- **WHEN** user enters an unparseable string in the weight field
- **THEN** an error is shown and the set cannot be submitted

---

## ADDED Requirements

### Requirement: Input zoom prevention
Weight and reps input fields SHALL render at a minimum font size of 16px to prevent iOS Safari from zooming the viewport on focus.

#### Scenario: No zoom on weight input focus
- **WHEN** user taps the weight input on an iPhone
- **THEN** the viewport does not zoom in

#### Scenario: No zoom on reps input focus
- **WHEN** user taps the reps input on an iPhone
- **THEN** the viewport does not zoom in

---

### Requirement: Scroll input into view on focus
When a weight or reps input receives focus, the system SHALL scroll it into the visible area above the on-screen keyboard. The scroll SHALL be triggered after a short delay to allow the keyboard animation to complete.

#### Scenario: Input covered by keyboard
- **WHEN** user taps a weight or reps input that is in the lower portion of the screen
- **THEN** the input scrolls into the visible area above the keyboard
