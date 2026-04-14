## 1. Global zoom prevention (CSS)

- [x] 1.1 Add `input, textarea, select { font-size: max(16px, 1em); }` to `src/index.css`
- [x] 1.2 Remove redundant `style={{ fontSize: '16px' }}` inline styles from `SetLogger.tsx`
- [x] 1.3 Verify no zoom on exercise name, plan name, and muscle group name inputs in the browser

## 2. PWA layout: bottom bar + scrollbar fix

- [x] 2.1 Replace `h-screen` with `h-[100dvh]` on the app root in `App.tsx`
- [x] 2.2 Ensure main scroll container height accounts for the nav bar height (check `flex-1 overflow-hidden` logic)
- [x] 2.3 Add `overflow: hidden` to `html` and `body` in `index.css` to prevent the browser-level scrollbar
- [x] 2.4 Verify bottom nav is fully visible and no scrollbar appears when launched from iPhone home screen

## 3. Slot removal persistence

- [x] 3.1 In `useActiveSession.ts`, update `removePlanSlot` to remove the entry from `session.entries` and call `sessionRepo.save(session)` (write to IndexedDB)
- [x] 3.2 Update `removeSlot` (temp slot removal) similarly — remove from `session.entries` and persist
- [x] 3.3 Remove the `removedPlanSlotIndices` React state entirely; rely on `session.entries` as the source of truth
- [x] 3.4 Update `ActiveSessionScreen.tsx` to render `session.entries` directly without filtering by `removedPlanSlotIndices`
- [x] 3.5 Update / add tests in `planSlotRemoval.test.tsx` to assert that removal calls `sessionRepo.save` and that the entry is absent from `session.entries`
- [x] 3.6 Verify: remove a slot, navigate to Stats, navigate back — slot must not reappear
