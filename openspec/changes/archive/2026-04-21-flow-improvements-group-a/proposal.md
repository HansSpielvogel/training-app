## Why

During active workouts, Hans loses context when navigating between exercises and tabs. When an exercise finishes, he must manually find and open the next one. When returning from Stats, previously-active exercises aren't focused. And when RPE feels wrong immediately after logging, there's no way to correct it without ending the session.

These friction points break workout flow and require extra cognitive load while training.

## What Changes

- **Auto-open next unfinished exercise**: When an exercise is completed in an active session, automatically expand the next unfinished exercise/muscle group (skip already-finished ones)
- **Auto-focus active exercise on return**: In an active session, when a user has started a muscle group (selected exercise or logged a set) but hasn't finished it, then switches tabs (e.g., to Stats) and returns, automatically open and focus that active exercise
- **Change RPE after logging**: Allow changing RPE on an already-logged set during the same active session (immediate correction: "that was tougher than I thought")

## Capabilities

### New Capabilities

- `session-navigation-flow`: Auto-navigation between exercises during active sessions — open next unfinished exercise on completion, restore focus to active exercise when returning from other tabs
- `rpe-editing`: Edit RPE values on already-logged sets during the same active session

### Modified Capabilities

- `active-session`: Add state tracking for "currently active exercise" (one that user has started but not finished) to support auto-focus behavior

## Impact

**Presentation layer:**
- `ActiveSessionView` — add auto-scroll/open logic when exercise completes
- `ExerciseCard` or session entry component — add RPE edit affordance (button/tap target)
- Session navigation logic — detect tab switches and restore active exercise focus

**Application layer:**
- Session state management — track which exercise is "active" (started but not finished)
- Set editing use case — support updating RPE on existing logged sets

**Domain layer:**
- `SessionSet` — RPE is already mutable, no changes needed
- Session completion rules — define "active exercise" concept (has logged sets but slot not marked done)
