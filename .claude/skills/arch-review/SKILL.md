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
5. DDD correctness and bigger-picture review (read src/domain/ and src/application/ for the bounded contexts touched by the changed files):
   a. **Ubiquitous language**: are domain terms (TrainingSession, SessionEntry, SessionSet, PlanSlot, MuscleGroup, ExerciseDefinition, Weight types) used consistently across all layers? Flag rename drift — e.g. UI says "workout" but domain says "session".
   b. **Aggregate integrity**: are sub-entities (SessionEntry, SessionSet, PlanSlot) only accessible through their aggregate root? Flag any repository method that returns or queries sub-entities directly (e.g. getSetById).
   c. **Domain logic placement**: is business logic (volume, set completion, variation rotation) in domain entities/value objects, not in use cases or hooks? Use cases orchestrate; they do not compute.
   d. **Value object correctness**: do value objects enforce their own invariants (non-negative weight, valid RPE range)? Are they treated as immutable?
   e. **Cross-context coupling**: at the domain level, sessions/ may only reference ExerciseDefinitionId — never a full ExerciseDefinition. planning/ may only reference MuscleGroupId. Flag full-object cross-context references.
   f. **Anemic domain model**: flag entity files that are pure data bags with zero methods — ask where the missing behavior has leaked to (use case? hook?).
   g. **Repository contracts**: repository interfaces in domain/ must expose only aggregate-root operations. No sub-entity queries.
   h. **Use case SRP**: each use case file does exactly one thing. Flag files that contain two distinct operations.
   i. **Bigger picture**: flag growing coupling that will become a structural problem — hooks doing too much orchestration, use cases growing beyond their scope, bounded contexts bleeding into each other, presentation importing domain objects as props.
6. For large structural problems that would take significant effort (e.g. introducing domain events, reshaping a bounded context boundary, extracting a sub-domain): append a bullet to the `## Future` section of `openspec/memory/project_roadmap.md` and include it in the ### New Features output section. Add the why and acceptance criterias.
7. Report all findings — from the script and all manual review steps — using the output format below.

Output format — return ONLY this, no preamble:

### Critical
- `src/path/file.tsx:N` — issue. **Fix:** concrete suggestion.

### Warnings
- `src/path/file.tsx:N` — issue. **Fix:** concrete suggestion.

### Style
- `src/path/file.tsx:N` — issue. **Fix:** concrete suggestion.

### New Features
- Express the new idea of the feature and why it is neccessary.

Omit any category with no findings. If there are no findings at all, return "No issues found."
```

## After receiving findings

Show the findings to the user, then ask: **"Fix any of these now, or continue to CLAUDE.md update?"**

Wait for direction. If fixes are requested, implement them and re-run the check script (in a new subagent or directly) to confirm clean.
