---
name: ui-review
description: Review the app UI by capturing iPhone 17 screenshots of all routes and providing design critique. Use after significant UI changes — not after minor edits. Triggers when the user says /ui-review, "review the UI", "check the UI", or "how does the UI look".
---

# UI Review

Capture and critique the current app UI as it would appear on an iPhone 17

## How to invoke

**Always run via a subagent** (Agent tool, general-purpose). This keeps `agent-browser` output — accessibility trees, element legends, file paths — out of the main conversation context. Only the findings return.

Before spawning, determine from the recent implementation:
1. **Which routes were visually affected** — pass only those, not all routes. For a full audit, pass all routes.
2. **Which flows to walk through** — one short interaction per changed screen (e.g. "open the add form, submit an empty name, cancel")
3. **Any relevant context** — e.g. "a new modal was added", "the list item layout changed"

Then spawn with the prompt template below, substituting `{{CHANGED_ROUTES}}`, `{{FLOWS}}`, and `{{CONTEXT}}`.

If the dev server is not running on `http://localhost:5173`, ask the user to run `npm run dev` first.

## Subagent prompt template

```
You are reviewing the UI of a React PWA strength training app. Do it also from an UX perspective.
Target user: Hans, using the app one-handed at the gym on an iPhone 17.
App URL: http://localhost:5173
Recent changes: {{CONTEXT}}

IMPORTANT — no heredoc syntax: Never use `<<'EOF'` or `<<EOF` in any bash command.
For agent-browser eval with multi-line JS: minify to a single line and use `agent-browser eval 'JS_HERE'`, or use base64: `agent-browser eval -b "$(printf '%s' 'JS_HERE' | base64 -w0)"`.

Steps:
1. Run: agent-browser set device "iPhone 16 Pro"
   (closest emulation to iPhone 17 available in agent-browser)
2. For each route in [{{CHANGED_ROUTES}}]:
   - agent-browser open http://localhost:5173/<route> && agent-browser wait --load networkidle
   - agent-browser screenshot --annotate
3. Walk through each flow in [{{FLOWS}}] using agent-browser (click, type, submit).
   Screenshot any state that reveals an issue (error message, broken layout, missing feedback).
4. Review all screenshots against the criteria below.

Review criteria (in order of severity):

BLOCKERS — unusable in a gym setting:
- Touch targets too small or too close for one-handed use with sweaty hands
- Text unreadable in variable gym lighting (low contrast, tiny font)
- Key actions buried or unreachable with a thumb
- A flow is broken: action has no visible effect, wrong navigation, or missing error feedback

IMPROVEMENTS — daily friction:
- Actions or rows that don't look tappable (affordance missing)
- No feedback after an action (slot moved, plan saved) — user can't tell it worked
- Loading flash: empty state briefly appears before real data loads
- Labels or copy that don't match what the user sees (e.g. "Tap +" when there's no + icon)
- Visual hierarchy doesn't surface the most important info immediately

POLISH — UX quality:
- Inconsistent spacing, colors, or component styles across routes
- Unnecessary whitespace or cramped density
- Bottom nav missing iOS safe area inset (home indicator overlap)

Output format — return ONLY this, no preamble:

### Blockers
- [/route] Issue. **Fix:** suggestion.

### Improvements
- [/route] Issue. **Fix:** suggestion.

### Polish
- [/route] Issue. **Fix:** suggestion.

Omit any category that has no findings. If there are no findings at all, return "No issues found."
```
