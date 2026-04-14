## Why

Three p1 bugs degrade the in-gym iPhone PWA experience: the bottom nav bar is clipped and a scrollbar bleeds in from the browser shell, text inputs outside the set-logger still trigger iOS zoom, and deleted session slots silently reappear after navigating away.

## What Changes

- Fix bottom navigation bar visibility in PWA standalone mode (no clipping, no stray scrollbar)
- Extend no-zoom behavior to all text inputs across the app (exercise name editing and any other non-set-logger inputs)
- Fix deleted temp slot removal so the slot stays gone when the user navigates away and returns

## Capabilities

### New Capabilities

_(none — all changes are corrections to existing behavior)_

### Modified Capabilities

- `pwa-shell`: Add requirements for bottom-bar full visibility and no spurious scrollbar in standalone mode
- `active-session`: Extend input zoom prevention to cover all text inputs app-wide, not only weight/reps fields
- `session-slot-management`: Add explicit persistence requirement: removed temp slots must stay removed after navigation

## Impact

- `src/presentation/` — layout/shell component (bottom bar, overflow), input components (font-size / zoom)
- `src/presentation/` — active session state management for slot removal
- No domain or infrastructure changes required
