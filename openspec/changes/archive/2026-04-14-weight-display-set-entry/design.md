## Context

Four independent fixes in the active session UI. The app already has a global CSS zoom-prevention rule (`font-size: max(16px, 1em)`) and `formatSets` for the "Last:" display, but both have gaps. Set prefill and the Bauch seed defect are missing entirely.

## Goals / Non-Goals

**Goals:**
- Eliminate iOS zoom on every input across the app
- Show stacked weight components separately (and with LH prefix for barbell exercises) in the "Last:" line
- Prefill individual-mode inputs from the previous set in the current session
- Fix Oblique Crunch appearing under Bauch in exercise suggestions

**Non-Goals:**
- Adding a formal `isBarbell` flag to `ExerciseDefinition` — name-based detection is sufficient
- Changing how weights are stored or parsed

## Decisions

**Zoom fix — CSS `!important`**
The global rule `input, textarea, select { font-size: max(16px, 1em) }` is overridden by Tailwind utility classes (`text-sm`, `text-xs`) which have higher specificity (class selector > type selector). Adding `!important` guarantees the minimum applies regardless of Tailwind classes. This is correct because 16px is a safety floor, not a stylistic preference.

**LH detection — name suffix check**
No `isBarbell` property exists on `ExerciseDefinition`. All barbell exercises end in `" LH"` (e.g. "Schulterdrücken LH"). A simple `name.endsWith(' LH')` check in the formatter is accurate and requires no schema change. If the naming convention changes, the formatter is the single place to update.

**"Last:" stacked weight formatting — specialized formatter function**
`formatSets` is a generic formatter used in multiple places. A separate `formatLastWeight(weight, exerciseName?)` function isolates the new display logic without changing existing call sites. The `SetLogger` gains an optional `exerciseName` prop; `EntryRow` passes the exercise name it already has.

**Individual mode prefill — retain inputs after submit**
Quick mode resets weight/reps inputs to `''` after each submit (N identical sets are done). Individual mode should NOT reset them — the user logs one set and immediately edits the next. This is a one-line condition in the submit handler: skip clearing when `individualMode && sets.length > 0`.

**Bauch seed fix — remove `mg-bauch` from Oblique Crunch**
"Oblique Crunch" has `["mg-bauch", "mg-bauch-seite"]`. It targets the oblique/lateral muscles, so it belongs exclusively to `mg-bauch-seite`. Removing `mg-bauch` from its `muscleGroupIds` is the correct fix.

## Risks / Trade-offs

- `!important` on font-size makes it harder to explicitly set a smaller font on an input if ever needed → acceptable given the constraint is a platform safety requirement
- Name-based LH detection: exercises named with "LH" but that aren't barbell (unlikely) would get the LH display format → low risk given controlled seed data
