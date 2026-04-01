---
name: Training Session Flow
description: How Hans uses the app during a workout — screen layout, states, interactions, and design intent
type: project
---

## Session Flow

### 1. Starting a session

Select a training plan from the sessions list → app creates an in-progress `TrainingSession` and navigates to the active session screen.

If a session is already in progress, the sessions list routes directly to it instead.

### 2. Active session screen layout

```
HEADER:  [Plan name]                    [Abandon]
         "Tap a slot to log sets"  ← hint, until first activity

BODY: scrollable list of EntryRows (one per plan slot)

SLOT CONTROLS: [+ Add muscle group]  [+ Add plan]

FOOTER: [Finish Workout]
        → confirmation: [Keep Going]  [Finish]
```

### 3. Working through entries (happy path)

Hans works top to bottom. For each slot:

**A. Pick exercise**
- Tap entry header → expands → VariationPicker appears
- VariationPicker shows:
  - `[💡 Suggestion]` chip (green) — rotation algorithm candidate
  - Up to 3 recent variation chips (blue) — most recently used for this muscle group
  - `[Other…]` — opens full scrollable list picker
- Tap chip → exercise assigned → VariationPicker replaced by SetLogger

**B. Log sets**
- SetLogger shows "Last: W×R  W×R  ..." from previous session (if available)
- Enter weight + reps (+ optional RPE 1–10)
- Quick mode (default): [Log 3×] — logs N identical sets (N = exercise.defaultSets, default 3)
- Individual mode: [Add Set] — logs one set at a time
- Toggle between modes at any time; already-logged sets unaffected
- Only the last set can be removed

**C. Move on**
- Tap entry header (while expanded, has sets) → marks done + auto-expands next incomplete entry
- OR: tap explicit [Done] button inside expanded entry — same effect
- Tapping header when no sets logged → just collapses, no done mark

### 4. Entry row states

```
COLLAPSED (default)
  ↓ tap
EXPANDED — no exercise assigned
  shows: VariationPicker
  ↓ pick chip
EXPANDED — exercise assigned, no sets
  shows: SetLogger + [Remove slot]
  ↓ log set
EXPANDED — has sets
  shows: SetLogger with set list + [Done]
  ↓ tap header OR [Done]
DONE
  collapsed, green ✓ badge visible
  can be re-expanded to add more sets
```

Entry header always shows:
```
[MuscleGroup]  [Evtl?]  [Temp?]  [ExerciseName?]  [N sets?]  [✓?]  [X clear?]  [▾]
```
- `[X clear]`: visible when exercise is assigned but not yet done — resets to VariationPicker
- `[✓]`: green checkmark when done

### 5. Optional entries (Evtl)

Entries marked optional (`entry.optional = true`) carry an "Evtl" badge. These are skipped or removed more often than any other slot type.

Three ways to handle them:
- **Leave closed** — most common; persists as empty entry on session completion
- **Remove** — expand → [Remove slot] (only visible when no sets are logged)
- **Log normally** — expand → pick exercise → log sets → mark done

### 6. Mid-session slot management

**Add a muscle group:**
`[+ Add muscle group]` → muscle group picker → new "Temp" slot added at bottom

**Add plan slots:**
`[+ Add plan]` → plan picker (excludes current plan) → adds non-overlapping muscle group slots as "Temp"

**Remove a slot:**
Expand the slot → [Remove slot] visible when no sets logged. Works for both plan slots and temp slots.

### 7. Finishing the workout

```
[Finish Workout]
  ↓ first tap: shows inline confirmation
[Keep Going]  [Finish]
  ↓ Finish → session completed, navigates to sessions list
```

Empty/skipped entries are persisted as-is.

**Abandon:** [Abandon] (header) → confirm banner → session deleted entirely.

### 8. UX design principles for this screen

- **One-handed, thumb-reachable** — all primary actions reachable with one thumb during training
- **Top-to-bottom flow** — entries naturally progress first to last; Done auto-advances
- **44px min touch targets** — all interactive elements meet iOS tap target guidelines
- **16px min font on inputs** — prevents iOS Safari viewport zoom on focus
- **Keyboard-aware** — inputs scroll into view on focus (300ms delay for keyboard animation)
