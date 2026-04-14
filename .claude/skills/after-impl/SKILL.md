---
name: after-impl
description: "Run the post-implementation checklist for the training app: tests, UI verification, ui-review (if UI changed), CLAUDE.md update, commit and push. Triggers on /after-impl or when the user says 'done', 'run the workflow', 'post-impl', or 'wrap up'."
---

# After Implementation Workflow

Run these steps in order after finishing any implementation task.

## Steps

### 1. Run tests and build

```bash
npm test
```

If tests fail: stop, report the failures, fix them before continuing.

Also run the production build to catch TypeScript errors that `vitest` skips:

```bash
npm run build
```

If the build fails: fix all TypeScript errors before continuing. `npm test` uses esbuild (no type-checking), so type errors only surface in `tsc -b` during build.

Also run E2E if changes touch flows covered by Playwright:

```bash
npm run test:e2e
```

### 2. UI review (if applicable)

Ask yourself: Did this change affect the UI significantly?

- Yes → invoke the `ui-review` skill
- No → skip

After the review returns:
1. Fix all **Blockers** directly without asking.
2. Enumerate **Improvements** and **Polish** findings to the user in a table, then ask: *"Which of these do you want to fix now?"* Wait for their answer before doing anything.

### 3. Architecture review

Invoke the `arch-review` skill.

After the review returns:
1. Fix all **Critical** findings directly without asking.
2. Enumerate **Warnings** and **Style** findings to the user in a table, then ask: *"Fix any of these now, or continue to CLAUDE.md update?"* Wait for their answer before doing anything.

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
