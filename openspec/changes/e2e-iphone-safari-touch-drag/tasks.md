## 1. Playwright config — add iPhone 14 project

- [ ] 1.1 In `playwright.config.ts`, import `devices` (already imported) and add a second project `{ name: 'iphone-14', use: { ...devices['iPhone 14'] } }` alongside the existing Desktop Chrome project
- [ ] 2.2 Run `npx playwright test e2e/app.spec.ts` and confirm both projects execute and pass

## 2. Touch-drag helper utility

- [ ] 2.1 Create `e2e/touch-helpers.ts` exporting a `dragRow(page, fromSelector, toSelector, options?)` helper that dispatches `touchstart` on the drag handle of `fromSelector`, waits 500 ms (long-press threshold), then dispatches incremental `touchmove` events to `toSelector`'s position, and finally `touchend`
- [ ] 2.2 Verify the helper compiles (no TypeScript errors) by running `npx tsc --noEmit`

## 3. Drag-reorder E2E test

- [ ] 3.1 In `e2e/duplicate-muscle-group.spec.ts`, add a second test: `'stale exerciseDataMap: after dragging an entry, the moved slot shows correct exercises'`
- [ ] 3.2 Test setup: open Oberkörper A, wait for active session, expand the first Schultern slot (index 2) to load its exercise data, then collapse
- [ ] 3.3 Test action: use the `dragRow` helper to drag index 5 (second Schultern) before index 2 (first Schultern) via the drag handle
- [ ] 3.4 Test assertion: expand the moved slot (now at index 2) and assert that no exercises from the wrong slot appear (e.g., the suggestion chip corresponds to the correct `mg-schultern` history, not `mg-schultern` at its old cached index)
- [ ] 3.5 Run `npx playwright test e2e/duplicate-muscle-group.spec.ts` on the `iphone-14` project and confirm both tests pass

## 4. Verify all existing tests pass on iPhone 14

- [ ] 4.1 Run the full Playwright suite (`npx playwright test`) and confirm all existing tests pass on both `chromium` and `iphone-14` projects (or document and fix any failures caused by viewport/touch differences)
