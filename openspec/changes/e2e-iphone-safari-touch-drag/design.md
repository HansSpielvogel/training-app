## Context

The app is an iPhone-only PWA. All interactive gestures use the browser's Touch API (`touchstart`, `touchmove`, `touchend`). The existing Playwright setup runs Desktop Chrome only — no touch events are dispatched, so `useDragReorder` and `useSwipeToDelete` cannot be exercised in E2E tests.

Playwright ships `devices['iPhone 14']` (and similar), which configures headless Chromium with a mobile viewport, iPhone user agent, and — critically — touch event support via `page.touchscreen` and touch-aware pointer dispatch. No iOS simulator, no macOS, runs on any platform including Windows CI.

The drag handle activates on a 400 ms long-press (`touchstart` held ≥ 400 ms), then moves on `touchmove` and drops on `touchend`. Playwright can simulate this via `page.touchscreen.tap` for taps, but long-press + drag requires `page.touchscreen` coordinate sequences or the `mouse` API in touch mode.

## Goals / Non-Goals

**Goals:**
- Add `iPhone 14` Playwright project so touch events fire in all E2E tests
- Write a drag-reorder test for Oberkörper A (duplicate `mg-schultern` at positions 2 and 5) that fails when `exerciseDataMap` is not remapped after drag
- Run all existing E2E tests on both Desktop Chrome and iPhone 14

**Non-Goals:**
- Testing on real Safari (WebKit) — Playwright WebKit is flaky on Linux CI; this change uses Chromium with iPhone emulation, not actual Safari
- Testing swipe-to-delete in E2E (already exercised indirectly by the removal test; a dedicated swipe test can be a separate change)
- Removing the Desktop Chrome project — keep it so failures are attributed to the right platform

## Decisions

**Decision: Use `devices['iPhone 14']` (Chromium, not WebKit)**

Playwright has two iPhone options: `devices['iPhone 14']` (Chromium-based) and `devices['iPhone 14 Safari']` (WebKit). WebKit on Linux is significantly less stable and has known flakiness with complex touch sequences. Since the goal is testing touch *interaction logic* (not Safari rendering), Chromium with iPhone emulation is the right trade-off. The `testing-setup` spec already requires headless Chromium.

**Decision: Keep Desktop Chrome project, add iPhone 14 alongside**

All existing tests run on both projects. Regressions can then be attributed to platform (e.g., "fails on iPhone only" = touch-specific bug). The cost is roughly doubling CI test time, which is acceptable given the small test suite.

**Decision: Long-press drag via `page.mouse` down + move + up (not `page.touchscreen`)**

Playwright's `page.touchscreen` API does not natively support holding a touch point while moving step-by-step in a way that triggers `touchmove` with intermediate coordinates. The `page.mouse` API in a touch-emulated context dispatches `pointerdown/move/up` which React's touch event handlers do not listen to. The correct approach: use `page.dispatchEvent` with synthetic `TouchEvent` objects (using `createTouchEvent` helpers in the test) to fire `touchstart` → wait 450 ms → `touchmove` (step-by-step) → `touchend`. This is the same pattern used in other Playwright touch-drag tests for mobile PWAs.

**Decision: Test scenario — drag second `mg-schultern` (index 5) before first (index 2)**

After the drag, slot at new index 2 would be the one that was at 5. If `exerciseDataMap` was not remapped, expanding the moved slot would show exercise data for the wrong muscle group slot. The test expands both slots before dragging to pre-populate `exerciseDataMap`, making the stale-data bug observable.

## Risks / Trade-offs

- [Synthetic TouchEvent dispatch is verbose] → Mitigation: extract a `dragRow(page, fromIndex, toIndex)` helper in a test utility file shared across E2E specs
- [Long-press timing is environment-sensitive (400 ms threshold)] → Mitigation: wait 500 ms between `touchstart` and first `touchmove` to give comfortable margin
- [CI time increase] → Mitigation: acceptable; test suite is small (<20 tests total)
