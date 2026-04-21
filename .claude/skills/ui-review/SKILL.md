---
name: ui-review
description: Review the app UI by capturing iPhone 17 screenshots of all routes and providing design critique. Use after significant UI changes — not after minor edits. Triggers when the user says /ui-review, "review the UI", "check the UI", or "how does the UI look".
---

# UI Review

Capture and critique the current app UI as it would appear on an iPhone 17. Review both individual screens and complete user flows — not just static appearance.

## How to invoke

**Always run via a subagent** (Agent tool, general-purpose). This keeps `agent-browser` output — accessibility trees, element legends, file paths — out of the main conversation context. Only the findings return.

Before spawning, determine from the recent implementation:
1. **Which routes were visually affected** — pass only those, not all routes. For a full audit, pass all routes.
2. **Which flows to walk through** — walk the main changed journey end-to-end, not just one step. Also check adjacent flows for regressions (e.g. if a modal was added, also check cancel and error paths).
3. **Any relevant context** — e.g. "a new modal was added", "the list item layout changed", "this is the active session screen"

Then spawn with the prompt template below, substituting `{{CHANGED_ROUTES}}`, `{{FLOWS}}`, and `{{CONTEXT}}`.

If the dev server is not running on `http://localhost:5173`, ask the user to run `npm run dev` first.

**After the subagent returns:** scan findings for anything too large to fix in the current session (new bounded context, multi-screen redesign, new interaction pattern). Add those to `openspec/memory/project_roadmap.md` under `## Future (not scheduled)` as a brief bullet with the why and acceptance criteria.

## Subagent prompt template

```
You are reviewing the UI of a React PWA strength training app from both a visual design and UX flow perspective.
Target user: Hans, using the app one-handed at the gym on an iPhone 17.
App URL: http://localhost:5173
Recent changes: {{CONTEXT}}

IMPORTANT — no heredoc syntax: Never use `<<'EOF'` or `<<EOF` in any bash command.
For agent-browser eval with multi-line JS: minify to a single line and use `agent-browser eval 'JS_HERE'`, or use base64: `agent-browser eval -b "$(printf '%s' 'JS_HERE' | base64 -w0)"`.

Steps:
1. Run: agent-browser set device "iPhone 16 Pro"
   (closest emulation to iPhone 17 available in agent-browser)
2. Static screenshots — for each route in [{{CHANGED_ROUTES}}]:
   - agent-browser open http://localhost:5173/<route> && agent-browser wait --load networkidle
   - agent-browser screenshot --annotate
3. Flow walkthroughs — walk through each flow in [{{FLOWS}}] using agent-browser.
   For each flow, also walk the cancel path, the error/empty-input path, and any confirmation dialogs.
   Screenshot any state that reveals an issue (broken layout, missing feedback, dead end, wrong copy).
4. Review all screenshots against ALL criteria below — both the visual and flow criteria.

---

## Review criteria

### BLOCKERS — unusable in a gym setting
Touch & reach:
- Touch targets smaller than ~44px or too close together for one-handed, sweaty-hand use
- Key actions not reachable with a thumb (top-left corner, center of tall screens)
- Primary CTA not in the thumb zone (bottom half of screen)

Readability:
- Text unreadable in bright or variable gym lighting (low contrast, font below ~14px)
- Weight/rep numbers not large and instantly scannable (these are the core data)

Flow blockers:
- An action has no visible effect and no error message
- Wrong navigation after an action (lands on unexpected screen)
- A flow has a dead end: no way to go back, cancel, or proceed
- Required data missing with no indication of what to do

### IMPROVEMENTS — daily friction
Affordance & feedback:
- Rows or areas that look tappable but aren't, or vice versa
- No confirmation after an action (saved, deleted, moved) — user can't tell it worked
- Destructive actions (delete, clear) with no undo or confirmation step
- Non-destructive actions (save, add) that ask for unnecessary confirmation

State & copy:
- Loading flash — empty state briefly appears before real data loads
- Empty states with no guidance on what to do next (e.g. "No exercises" with no add button nearby)
- Stale or wrong labels: button says "Add" but icon is a checkmark; "Tap +" when there's no + visible
- Error messages that don't tell the user what to fix

Visual hierarchy & flow logic:
- The most important info (current weight, current set number) is not immediately scannable
- Secondary/tertiary info competes visually with primary info
- A multi-step flow has no progress indication — user doesn't know where they are
- Related actions are separated; unrelated actions are grouped

### POLISH — UX quality and visual design
Consistency:
- Inconsistent spacing, font sizes, colors, or component styles across routes (different button styles, different card padding)
- Icons used differently in different places (same icon, different meaning)
- Color used without semantic meaning (e.g. red used for both errors and delete buttons and highlights)

Layout & density:
- Unnecessary whitespace that pushes content off-screen on a small phone
- Cramped density that makes the screen feel overwhelming
- Safe area insets missing: content hidden by notch, home indicator, or keyboard

Visual design:
- Typography lacks hierarchy — everything the same size/weight
- Primary actions not visually distinct from secondary/tertiary actions
- List items that could be scannable but require reading each word
- Long-press or swipe interactions with no discoverability hint

---

Output format — return ONLY this block, no preamble or explanations outside it:

### Blockers
- [/route] Issue. **Fix:** suggestion.

### Improvements
- [/route] Issue. **Fix:** suggestion.

### Polish
- [/route] Issue. **Fix:** suggestion.

### Roadmap candidates
- Brief description of any finding that is valid but too large for a small fix (multi-screen redesign, new interaction pattern, new feature). One line each. These will be added to the project roadmap by the caller.

Omit any category that has no findings. If there are no findings at all, return "No issues found."
```
