## MODIFIED Requirements

### Requirement: E2E tests run headlessly via Playwright
The system SHALL use Playwright with two projects: headless Chromium (Desktop Chrome) and headless Chromium with iPhone 14 emulation (`devices['iPhone 14']`). Both projects SHALL be executable on Windows without an iOS simulator or macOS. Touch events SHALL be dispatched in the iPhone 14 project, enabling tests for gesture-based interactions (drag reorder, swipe-to-delete).

#### Scenario: E2E tests run on Windows — Desktop Chrome
- **WHEN** `npx playwright test` is executed on Windows
- **THEN** tests run against a locally served app in headless Desktop Chrome and produce a pass/fail result

#### Scenario: E2E tests run on Windows — iPhone 14 emulation
- **WHEN** `npx playwright test` is executed on Windows
- **THEN** tests also run in headless Chromium with iPhone 14 device emulation (touch events enabled, 390×844 viewport, iPhone user agent) and produce a pass/fail result

#### Scenario: Touch-specific tests fire real touch events
- **WHEN** a test dispatches synthetic `touchstart`/`touchmove`/`touchend` events via `page.dispatchEvent` in the iPhone 14 project
- **THEN** the app's touch handlers respond as they would on a real iPhone
