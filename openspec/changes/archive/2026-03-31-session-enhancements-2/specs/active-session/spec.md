## MODIFIED Requirements

### Requirement: Weight input notation
The weight input field SHALL accept short human notation and parse it into the correct `Weight` kind. Commas SHALL be accepted as decimal separators (normalized to dots before parsing). Negative values SHALL be accepted for assisted exercises (e.g. Klimmzug, Dips with support weight). A dedicated sign toggle control SHALL be available in the UI to prepend or remove a minus prefix, since the iOS decimal keyboard does not expose a minus key. An optional secondary "added weight" field SHALL be provided; when filled, it combines with the base weight field to produce a stacked weight without requiring `+` notation in the main field.

- Plain number (e.g. `"22.5"` or `"22,5"`) → `{ kind: 'single', value: 22.5 }`
- Negative number (e.g. `"-15"`) → `{ kind: 'single', value: -15 }`
- `"2×N"` or `"2xN"` (e.g. `"2x15"`) → `{ kind: 'bilateral', perSide: N }`
- `"B+A"` (e.g. `"31.5+2.3"`) → `{ kind: 'stacked', base: 31.5, added: 2.3 }`
- Base field `"B"` + added field `"A"` → `{ kind: 'stacked', base: B, added: A }`

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

#### Scenario: Parse stacked weight via separate added field
- **WHEN** user enters `"12"` in the weight field and `"2.5"` in the added-weight field
- **THEN** it is parsed as `{ kind: 'stacked', base: 12, added: 2.5 }`

#### Scenario: Invalid weight input
- **WHEN** user enters an unparseable string in the weight field
- **THEN** an error is shown and the set cannot be submitted
