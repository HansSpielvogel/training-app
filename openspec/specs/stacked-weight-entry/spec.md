### Requirement: Dedicated added-weight input field
The set logger SHALL provide an optional secondary "added weight" input field alongside the main weight field. When the user enters a value in the added-weight field, the system SHALL combine it with the base weight field to produce a `{ kind: 'stacked', base, added }` weight value. When the added-weight field is empty, the main weight field is parsed as usual. The added-weight field SHALL accept the same decimal input rules (dot or comma as separator).

#### Scenario: Log stacked weight via separate field
- **WHEN** user enters `"12"` in the weight field and `"2.5"` in the added-weight field
- **THEN** the set is logged with weight `{ kind: 'stacked', base: 12, added: 2.5 }`

#### Scenario: Added-weight field empty — behaves as normal weight
- **WHEN** user enters `"20"` in the weight field and leaves the added-weight field empty
- **THEN** the set is logged with weight `{ kind: 'single', value: 20 }` (or `bilateral` if `2xN` notation used)

#### Scenario: Comma accepted in added-weight field
- **WHEN** user enters `"2,5"` in the added-weight field
- **THEN** it is treated as `2.5`
