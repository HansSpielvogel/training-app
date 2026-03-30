---
name: after-impl
description: "Run the post-implementation checklist for the training app: tests, UI verification, ui-review (if UI changed), CLAUDE.md update, commit and push. Triggers on /after-impl or when the user says 'done', 'run the workflow', 'post-impl', or 'wrap up'."
---

# After Implementation Workflow

Run these steps in order after finishing any implementation task.

## Steps

### 1. Run tests

```bash
npm test
```

If tests fail: stop, report the failures, fix them before continuing.

Also run E2E if changes touch flows covered by Playwright:

```bash
npm run test:e2e
```

### 23. UI review (if applicable)

Ask yourself: Did this change affect the UI significantly?

- Yes → invoke the `ui-review` skill
- No → skip

### 3. Architecture review

Invoke the `arch-review` skill.

### 4. Update CLAUDE.md

Read `/home/hans/src/training-app/CLAUDE.md` and consider whether anything learned during this implementation should be added — new conventions, constraints, architectural decisions, or insights that future developers (and Claude) should know.

Only update if there is something genuinely new and non-obvious. Do not pad.

### 5. Commit and push

Stage changed files, create a commit following the project format:

```
Hans | <short description>
```

Then push:

```bash
git push
```
