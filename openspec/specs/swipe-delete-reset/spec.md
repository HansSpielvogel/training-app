### Requirement: Swipe-to-delete state does not leak between entries
Deleting a muscle-group entry via swipe SHALL NOT leave the entry that shifts into its position visually or functionally in a swiped state.

#### Scenario: Deleting an entry above a non-swiped entry
- **WHEN** a muscle group entry is deleted via swipe, and the entry below it (which shifts up into the deleted row's position) had not been swiped
- **THEN** the shifted entry renders in its normal, non-swiped state and is not itself pre-positioned for deletion

#### Scenario: Deleting an entry above an entry with logged sets
- **WHEN** a muscle group entry is deleted via swipe, and the entry that shifts into its position already has ≥1 logged set (where swipe-to-delete is blocked)
- **THEN** the shifted entry renders normally, is not shown in a swiped/translated state, and swipe remains blocked for it as expected
