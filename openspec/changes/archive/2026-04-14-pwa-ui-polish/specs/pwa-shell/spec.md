## ADDED Requirements

### Requirement: Bottom navigation bar is fully visible in standalone mode
In PWA standalone mode the bottom navigation bar SHALL be fully visible and not clipped by the device home indicator or viewport edge. The app root SHALL use `100dvh` (dynamic viewport height) so the layout adapts to the actual visual viewport height.

#### Scenario: Bottom bar visible on iPhone in standalone mode
- **WHEN** the app is launched from the iPhone home screen in standalone mode
- **THEN** the bottom navigation bar and all its icons are fully visible and not cut off

### Requirement: No spurious scrollbar in standalone mode
In PWA standalone mode the app SHALL NOT display a browser-level scrollbar on the root viewport. Scrolling within the main content area SHALL be contained to that area only.

#### Scenario: No scrollbar in standalone mode
- **WHEN** the app is opened in standalone PWA mode
- **THEN** no scrollbar is visible on the outer viewport or outside the main content scroll area

### Requirement: All text inputs suppress iOS zoom
Every `<input>`, `<textarea>`, and `<select>` element in the app SHALL render at a minimum font size of 16px so that iOS Safari does not zoom the viewport on focus. This applies globally, not only to the set-logger inputs.

#### Scenario: No zoom on exercise name input focus
- **WHEN** user taps the exercise name input field
- **THEN** the viewport does not zoom in

#### Scenario: No zoom on training plan name input focus
- **WHEN** user taps a training plan name input field
- **THEN** the viewport does not zoom in

#### Scenario: No zoom on muscle group name input focus
- **WHEN** user taps a muscle group name input field
- **THEN** the viewport does not zoom in
