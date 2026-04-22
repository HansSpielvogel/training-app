## ADDED Requirements

### Requirement: Reorder session entries via long-press drag
During an active session, the user SHALL be able to reorder session entries by long-pressing a drag handle and dragging up or down. The new order SHALL be persisted to IndexedDB immediately on drop. The underlying training plan SHALL NOT be modified. All session UI state follows the entry that moved — done indices, loaded exercise data, last-sets cache, and the expanded/active slot indicator are all remapped to match the new order.

A long press of at least 400ms on the drag handle activates drag mode. During drag, the row is lifted visually and the list adjusts to show the insertion point. Releasing the row commits the new position.

#### Scenario: Long-press activates drag
- **WHEN** user presses and holds a drag handle on a session entry for at least 400ms
- **THEN** the entry enters drag mode, lifting visually above the list

#### Scenario: Drag repositions entry
- **WHEN** user drags an entry to a new position and releases
- **THEN** the entry is placed at the new position in the list

#### Scenario: Reorder persisted to IndexedDB
- **WHEN** user drops an entry at a new position
- **THEN** the new order is saved to IndexedDB and survives navigation away and back

#### Scenario: Training plan unchanged after reorder
- **WHEN** user reorders entries in an active session
- **THEN** the training plan retains its original slot order for future sessions

#### Scenario: Done state follows moved entry
- **WHEN** user reorders entries and some entries were already marked done
- **THEN** the done indicators remain associated with the correct entries at their new positions

#### Scenario: Exercise data follows moved entry
- **WHEN** user reorders entries after exercise data was loaded for one or more slots
- **THEN** the exercise picker and recent-sets data for each slot reflect that slot's own muscle group, not the data of whatever was previously at that index

#### Scenario: Expanded slot follows moved entry
- **WHEN** user drags the currently expanded entry to a new position
- **THEN** the entry remains expanded at its new position

#### Scenario: Short tap on handle does not drag
- **WHEN** user taps a drag handle without holding
- **THEN** no drag is initiated and the entry remains at its position
