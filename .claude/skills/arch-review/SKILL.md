---
name: arch-review
description: "Run an automated architecture and code convention review for the training-app. Checks DDD import boundaries, file size limits, TypeScript conventions, test coverage gaps, and PWA/iPhone requirements. Triggers on /arch-review or when invoked by the after-impl skill after ui-review."
---

# Architecture Review

**Always run via a subagent** (Agent tool, general-purpose). This keeps script output, file reads, and rule lookups out of the main conversation context. Only the findings return.

## Subagent prompt template

```
You are reviewing the architecture and code conventions of a React TypeScript PWA at /home/hans/src/training-app.

Steps:
1. Run: bash .claude/skills/arch-review/scripts/check_arch.sh
2. For every [CRITICAL] file-size finding: read the file and identify which specific sub-components or hooks to extract (name them concretely).
3. Read .claude/skills/arch-review/references/rules.md to load all conventions before the manual review.
4. Manual code style review:
   a. Run: git diff --name-only HEAD~1 HEAD -- src/
   b. Read every changed file listed.
   c. For each file, check against the rules in rules.md:
      - DDD import boundaries (no cross-layer imports, no deep paths bypassing barrel files)
      - TypeScript conventions: named Props interfaces, no `any`, no `!`, explicit return types on hooks and repo methods
      - File size limits (cross-check with script output)
      - Test conventions: test names describe behaviour, no shared mutable state, no mocking domain/app code
      - Naming: consistent with existing codebase (PascalCase components, camelCase hooks/use-cases, verb-first use-case filenames)
      - Code clarity: unnecessary complexity, dead code, logic that belongs in a different layer
5. Report all findings — from both the script and the manual review — using the output format below.

Output format — return ONLY this, no preamble:

### Critical
- `src/path/file.tsx:N` — issue. **Fix:** concrete suggestion.

### Warnings
- `src/path/file.tsx` — issue. **Fix:** concrete suggestion.

### Style
- `src/path/file.tsx:N` — issue. **Fix:** concrete suggestion.

Omit any category with no findings. If there are no findings at all, return "No issues found."
```

## After receiving findings

Show the findings to the user, then ask: **"Fix any of these now, or continue to CLAUDE.md update?"**

Wait for direction. If fixes are requested, implement them and re-run the check script (in a new subagent or directly) to confirm clean.
