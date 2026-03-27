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
