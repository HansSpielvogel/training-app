## Why

The app is an iPhone PWA used one-handed at the gym. All interactive gestures (touch-drag reorder, swipe-to-delete) use touch events exclusively, which Desktop Chrome cannot fire — leaving the drag bug we just fixed completely untested by E2E. iPhone emulation via Playwright's built-in `devices['iPhone 14']` runs on headless Chromium with full touch support, requiring no iOS simulator or macOS.

## What Changes

- Add `iPhone 14` as a second Playwright project alongside Desktop Chrome, enabling touch-event E2E tests
- Migrate all existing E2E tests to also run on iPhone 14 (the real target platform), keeping Desktop Chrome as a secondary pass
- Add a new E2E test: touch-drag reorder with a duplicate-muscle-group plan (Oberkörper A), asserting that exercises shown after drag reflect the correct muscle group

## Capabilities

### New Capabilities
- `e2e-touch-drag-coverage`: E2E test that performs a long-press touch drag in an active session with duplicate muscle groups, then verifies no stale exercise data is shown for the moved slot

### Modified Capabilities
- `testing-setup`: Add iPhone 14 Playwright project; existing tests run on both Desktop Chrome and iPhone 14

## Impact

- `playwright.config.ts` — add iPhone 14 project
- `e2e/duplicate-muscle-group.spec.ts` — add drag test
- All existing `e2e/*.spec.ts` — now also execute on iPhone 14 (no test changes needed if they use only pointer/keyboard interactions Playwright maps to touch automatically; swipe and drag tests are touch-explicit)
- CI time increases modestly (running each test twice)
