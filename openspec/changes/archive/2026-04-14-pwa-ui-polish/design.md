## Context

Three p1 regressions in the iPhone PWA:

1. **Bottom bar clipping + scrollbar** — `App.tsx` root uses `h-screen / flex`, nav has `paddingBottom: env(safe-area-inset-bottom)`, but a spurious scrollbar appears and the bar is partially cut off in standalone mode. Root cause is likely `overflow-hidden` on the scroll container not accounting for the full nav height, or a height calculation mismatch between `h-screen` and the actual viewport in standalone.

2. **Inconsistent zoom prevention** — `SetLogger.tsx` applies `style={{ fontSize: '16px' }}` to weight/reps/RPE inputs. All other inputs (ExerciseForm, InlineEditForm, MuscleGroupsPage, TrainingPlansScreen) use `text-sm` (14px), triggering iOS Safari auto-zoom on focus.

3. **Removed slot reappears** — `useActiveSession.ts` tracks removed plan slot indices in a local `useState<Set<number>>`. This state is not persisted to IndexedDB. On navigation away the component unmounts; on return it remounts, `refresh()` re-fetches the session from IndexedDB, and the Set resets to empty — deleted slots reappear.

## Goals / Non-Goals

**Goals:**
- Bottom nav fully visible with no scrollbar in standalone PWA mode
- All text inputs (weight, reps, exercise name, plan name, muscle group name) use ≥16px font size
- Removed temp slots and removed plan slots remain removed across navigation

**Non-Goals:**
- Changing the domain model or adding new IndexedDB tables
- Fixing any other PWA layout bugs not listed in Group A

## Decisions

### 1. Bottom bar fix: use `dvh` + explicit nav height

`h-screen` equals `100vh`, which in standalone mode on iOS can differ from the actual visual viewport. Replace with `h-[100dvh]` (dynamic viewport height) on the app root. Also ensure the main scroll container uses `calc(100dvh - <nav-height>)` or Tailwind's `pb-safe` pattern so content is never hidden under the nav.

For the scrollbar: ensure the scroll container is `overflow-y-auto` (not `overflow-auto`) with no `overscroll-behavior: auto` on the body, and add `overflow: hidden` on the root HTML/body to kill the browser-level scrollbar.

### 2. Zoom prevention: global CSS rule

Scatter-patching individual inputs is fragile. Add a single CSS rule to `index.css`:

```css
input, textarea, select {
  font-size: max(16px, 1em);
}
```

This guarantees ≥16px for all inputs without touching individual component files. Remove the per-input `style={{ fontSize: '16px' }}` inline styles from `SetLogger.tsx` (they become redundant), or leave them — either way is correct.

### 3. Removed slot persistence: write to IndexedDB on removal

When `removePlanSlot` is called, remove the entry from `session.entries` in-place and call `sessionRepo.save(session)`. The session is already in IndexedDB (started when the plan was selected); updating it with the entry removed makes IndexedDB the source of truth. On remount, `refresh()` loads the pruned session — slot is gone permanently.

This requires no new domain fields and no schema migration. It does mean the session document loses the entry permanently (before completion), which is the correct behavior: the user explicitly removed it.

## Risks / Trade-offs

- [dvh support] `100dvh` is supported on iOS 15.4+ (Safari 15.4, 2022). All modern iPhones are covered. → No mitigation needed.
- [Global CSS font-size] `max(16px, 1em)` could enlarge fonts if a component explicitly set smaller text via `em` units. In practice all inputs use `px` or Tailwind `text-*` which resolves to `px`. → Low risk; monitor in ui-review.
- [Irreversible slot deletion] Once the slot entry is removed from the session in IndexedDB, it cannot be recovered without restarting the session. Consistent with the stated requirement ("deleted entries should remain gone"). → Acceptable.
