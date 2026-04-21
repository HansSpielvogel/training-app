## Context

The active session UI currently requires manual navigation between exercises and has no mechanism for correcting RPE immediately after logging. Hans manually opens each exercise, and when returning from Stats tab, the app loses focus on the in-progress exercise. This creates friction during workouts.

Current state:
- Exercise slots are manually expanded/collapsed by the user
- No tracking of which exercise is "currently active"
- RPE is write-once; correcting it requires ending the session or abandoning the data
- Tab navigation doesn't preserve workout context

## Goals / Non-Goals

**Goals:**
- Auto-expand next unfinished exercise when current one is marked complete
- Restore focus to the active exercise when returning to active-session view from other tabs
- Allow editing RPE on logged sets during the same session

**Non-Goals:**
- Editing RPE after session completion (archive state is immutable)
- Auto-advancing to next exercise while sets are still being logged (only on explicit completion)
- Saving UI scroll position across tab switches (focus restoration is semantic, not pixel-perfect)

## Decisions

### Decision 1: Track "active exercise" in session state
**Rationale:** The app needs to know which exercise the user is currently working on. An exercise becomes "active" when the user selects a variation or logs the first set, and remains active until the slot is marked complete or the user starts another exercise.

**Implementation:** Add optional `activeEntryIndex: number | null` to the session view state (not domain — this is ephemeral UI state, not persisted). Updated when:
- User picks an exercise for a slot → set activeEntryIndex to that slot
- User logs a set → set activeEntryIndex to that slot if not already active
- User marks slot complete → clear activeEntryIndex
- User starts a different slot → set activeEntryIndex to new slot

**Alternative considered:** Track at domain level in `TrainingSession`. Rejected because "active" is a UI concern (which accordion is open), not training data.

### Decision 2: Auto-open next unfinished on completion
**Rationale:** Manual navigation between muscle groups is low-value friction. When a slot is marked complete, the next logical step is to move to the next incomplete slot.

**Implementation:** In the slot completion handler:
1. Mark slot complete
2. Clear activeEntryIndex
3. Find first slot with index > current where slot is not complete
4. Set activeEntryIndex to that slot (triggers UI expansion)
5. Scroll to the newly opened slot

**Edge case:** If no incomplete slots remain, don't open anything (workout is effectively done).

### Decision 3: Restore active exercise on tab return
**Rationale:** When Hans checks Stats mid-workout, then returns, he shouldn't have to remember which exercise he was working on.

**Implementation:** 
- Persist `activeEntryIndex` in component state (survives tab switch since ActiveSessionView stays mounted)
- On component mount/visibility (via `useEffect` with empty deps), check if `activeEntryIndex` is set and scroll to it
- This works because React preserves component state during tab navigation in the PWA

**Alternative considered:** Store in sessionStorage. Rejected as overkill — component state is sufficient for tab switches within same browser session.

### Decision 4: RPE edit as inline action
**Rationale:** RPE corrections are rare but immediate ("I said 7 but that was really an 8"). The affordance should be discoverable but not prominent.

**Implementation:** Add a small edit icon next to the RPE value in each logged set row. Tap → inline number input (1–10), confirm → update the set's RPE in the domain entity. Only available during active session (status `in-progress`). Hidden after session completes.

**Alternative considered:** Long-press gesture. Rejected due to poor discoverability on touch.

**Alternative considered:** Swipe-to-edit. Rejected because swipe-left is reserved for delete in iOS patterns.

### Decision 5: RPE editing preserves set identity
**Rationale:** Editing RPE should mutate the existing `SessionSet`, not create a new one. Weight and reps stay unchanged.

**Implementation:** Application layer: `updateSetRpe(sessionId, entryIndex, setIndex, newRpe)` use case. Domain: `SessionSet` is already mutable (not frozen), so direct mutation is allowed. Repository: `sessionsRepository.update(session)` writes the modified session.

**No breaking change:** Domain model supports this without schema migration.

## Risks / Trade-offs

**Risk:** Auto-opening next exercise could be disruptive if user wants to review or adjust the just-completed exercise.  
**Mitigation:** User can always scroll back up or manually collapse/expand slots. The auto-open is a convenience default, not a lock.

**Risk:** If user rapidly switches tabs, `activeEntryIndex` could become stale (e.g., user started a new exercise while Stats tab was open in background).  
**Mitigation:** Acceptable — tab switching while actively logging sets is not a primary flow. Worst case: wrong exercise is focused; user scrolls to correct one.

**Risk:** RPE edit button increases visual clutter in set rows.  
**Mitigation:** Use a minimal icon (pencil) with low opacity until hovered/tapped. Only shown in active sessions.

**Trade-off:** Auto-open behavior is not user-configurable.  
**Rationale:** Adding a setting adds complexity for a feature that aligns with 90% use case. If user feedback indicates strong preference for manual control, we can add a toggle later.
