## ADDED Requirements

### Requirement: App is installable on iPhone via Safari
The system SHALL be installable as a PWA on iPhone by using Safari's "Add to Home Screen" feature. The app SHALL launch in standalone mode (no browser chrome) after installation.

#### Scenario: User installs the app
- **WHEN** a user opens the app URL in Safari on iPhone and taps "Add to Home Screen"
- **THEN** the app appears on the home screen with the correct app name and icon

#### Scenario: Standalone launch
- **WHEN** the user launches the installed app from the home screen
- **THEN** the app opens without Safari's address bar or navigation chrome

### Requirement: App loads offline after first visit
The system SHALL cache the application shell via a Service Worker so that the app loads without a network connection after the initial visit.

#### Scenario: Offline load
- **WHEN** the user opens the app without an internet connection (after having visited once)
- **THEN** the app loads fully and is usable

#### Scenario: First visit requires network
- **WHEN** the user visits the app for the first time without an internet connection
- **THEN** the app does not load and shows a network error (acceptable — not an error state)

### Requirement: App manifest is correctly configured
The system SHALL include a web app manifest with name, short name, icons, display mode, and theme colour so that browsers and iOS Safari recognise it as an installable PWA.

#### Scenario: Manifest is served
- **WHEN** a browser fetches the app's manifest.json
- **THEN** it receives a valid manifest with `name`, `short_name`, `display: "standalone"`, and at least one icon sized 192×192

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

The CSS rule SHALL use `!important` to guarantee the 16px minimum is not overridden by component-level Tailwind utility classes (e.g. `text-sm`).

#### Scenario: No zoom on exercise name input focus
- **WHEN** user taps the exercise name input field
- **THEN** the viewport does not zoom in

#### Scenario: No zoom on training plan name input focus
- **WHEN** user taps a training plan name input field
- **THEN** the viewport does not zoom in

#### Scenario: No zoom on muscle group name input focus
- **WHEN** user taps a muscle group name input field
- **THEN** the viewport does not zoom in

#### Scenario: Tailwind text-sm class does not override zoom prevention
- **WHEN** an input has the `text-sm` Tailwind class applied
- **THEN** the effective font size is still at least 16px and iOS does not zoom on focus
