## MODIFIED Requirements

### Requirement: Input zoom prevention
Every input field in the active session view — including weight, reps, RPE, and any other text input — SHALL render at a minimum font size of 16px to prevent iOS Safari from zooming the viewport on focus. This is fulfilled by the global CSS rule defined in the `pwa-shell` capability; no per-input inline styles are required.

#### Scenario: No zoom on weight input focus
- **WHEN** user taps the weight input on an iPhone
- **THEN** the viewport does not zoom in

#### Scenario: No zoom on reps input focus
- **WHEN** user taps the reps input on an iPhone
- **THEN** the viewport does not zoom in

#### Scenario: No zoom on RPE input focus
- **WHEN** user taps the RPE input on an iPhone
- **THEN** the viewport does not zoom in
