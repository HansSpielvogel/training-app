### Requirement: Session progress indicator
The active session view SHALL display a compact progress bar below the session title showing how many slots are marked done out of the total slot count (e.g. "3 / 6"). A slot is counted as done when it reaches the done state as defined by the `session-slot-completion` capability. The bar SHALL update live as slots are marked done without requiring any user navigation.

#### Scenario: No slots done yet
- **WHEN** the session has just started and no slot has been marked done
- **THEN** the progress indicator shows "0 / N" and the filled portion of the bar is empty

#### Scenario: Some slots done
- **WHEN** the user has marked M out of N slots as done
- **THEN** the progress indicator shows "M / N" and the bar is proportionally filled

#### Scenario: All slots done
- **WHEN** all slots have been marked done
- **THEN** the progress indicator shows "N / N" and the bar is fully filled

#### Scenario: Progress updates immediately on slot done
- **WHEN** the user marks a slot as done
- **THEN** the progress bar count increments immediately without any additional action
