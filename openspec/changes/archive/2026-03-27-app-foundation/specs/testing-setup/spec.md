## ADDED Requirements

### Requirement: Unit and integration tests run headlessly on Windows
The system SHALL use Vitest to run all tests under `src/domain/` and `src/application/` without a browser, simulator, or special runtime. Tests SHALL complete using only Node.js.

#### Scenario: Domain tests run without browser
- **WHEN** `npx vitest run` is executed on Windows
- **THEN** all domain and application tests pass without launching a browser or requiring any native dependency

### Requirement: E2E tests run headlessly via Playwright
The system SHALL use Playwright with headless Chromium to run end-to-end tests. Tests SHALL be executable on Windows without an iOS simulator or macOS.

#### Scenario: E2E tests run on Windows
- **WHEN** `npx playwright test` is executed on Windows
- **THEN** tests run against a locally served app in headless Chromium and produce a pass/fail result

### Requirement: CI runs all tests on every push
The system SHALL include a GitHub Actions workflow that installs dependencies, runs Vitest, and runs Playwright on every push to any branch. The workflow SHALL fail if any test fails.

#### Scenario: CI blocks on test failure
- **WHEN** a push is made with a failing test
- **THEN** the GitHub Actions workflow reports failure and does not proceed to any deploy step

#### Scenario: CI passes on green tests
- **WHEN** all tests pass
- **THEN** the GitHub Actions workflow completes successfully
