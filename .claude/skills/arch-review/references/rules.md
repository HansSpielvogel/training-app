# Architecture & Convention Rules — training-app

## DDD Layer Import Rules

```
domain/         ← imports nothing outside domain/
application/    ← imports domain/ only
infrastructure/ ← implements domain/ interfaces, no imports from application/ or presentation/
presentation/   ← imports application/ only
  └─ hooks      ← EXCEPTION: hooks are the composition root and may import infrastructure/
```

Cross-bounded-context imports at the application layer are a smell. If `planning` needs exercise
names, expose a query type via the `exercises` barrel (`index.ts`), don't import deep paths.

## File Size Limits

| File type | Hard limit | Action when exceeded |
|---|---|---|
| React component (`.tsx`) | 200 lines | Extract sub-components or custom hooks |
| Custom hook (`.ts`) | 100 lines | Split by concern |
| Use case (`.ts`) | 40 lines | Single responsibility — split if larger |
| Repository (`.ts`) | 80 lines | Each method ~5 lines; split if growing |

One export per file. Inline sub-components count toward the parent's line total.

## TypeScript Conventions

- Props must be a named `interface`, never an inline object type in the function signature.
- No non-null assertion (`!`). Narrow the type with a guard or conditional.
- No `any`. Use `unknown` + type guard at boundaries; use generics internally.
- Derive types from `zod` schemas at domain boundaries: `type Foo = z.infer<typeof FooSchema>`.
- Branded ID types for each entity: `type MuscleGroupId = string & { readonly _brand: 'MuscleGroupId' }`.
- Explicit return types on all hooks and repository methods.
- `strict: true` in tsconfig — no exceptions.

## Test Conventions

- Domain layer: pure unit tests (no mocks, no fake-indexeddb needed).
- Application layer: integration tests using real in-memory Dexie via `fake-indexeddb`.
- Infrastructure layer: integration tests using `fake-indexeddb` in `beforeEach`.
- Presentation hooks: `renderHook` from `@testing-library/react` — test behavior, not internals.
- Presentation components: `@testing-library/react` — test user interactions, not DOM structure.
- No shared mutable state in `beforeEach` — use factory functions.
- Mock only at the infrastructure boundary (never mock domain or application code).
- Test names describe behavior: `it('disables submit while saving')` not `it('calls save()')`.

## DDD Domain Model Rules

**Aggregate roots**: `TrainingSession`, `ExerciseDefinition`, `TrainingPlan` are aggregate roots.
Sub-entities (`SessionEntry`, `SessionSet`, `PlanSlot`) must only be accessed through their root — never queried or stored independently. No `getSetById`, no `findEntriesByExercise` returning raw sub-entities.

**Domain logic placement**: business logic (volume calculation, set completion, variation rotation) belongs in domain entities or value objects, not in use cases or hooks. Use cases orchestrate; domain computes.

**Value objects are immutable and self-validating**: `Weight`, `RPE`, and similar objects must enforce their own invariants (e.g. non-negative weight, valid RPE range). Never mutate — return new instances.

**Cross-context coupling at domain level**: bounded contexts may only reference each other by ID type.
- `sessions/` may import `ExerciseDefinitionId` from `exercises/` but never a full `ExerciseDefinition`
- `planning/` may import `MuscleGroupId` from `exercises/` but never a full `MuscleGroup`
- `sessions/` must not import from `planning/` at all

**Repository interfaces in `domain/`**: expose only aggregate-root operations. Methods accept/return aggregate roots or IDs — never sub-entities directly.

**Ubiquitous language**: use the exact domain terms from CLAUDE.md across all layers. The UI says "session" not "workout", "entry" not "exercise-item", "set" not "log-item". Drift is a smell.

**Anemic domain model**: entity files with zero methods (pure data bags) are a design smell. Business rules that operate on entity state belong on the entity, not leaked into use cases.

## Bigger-Picture Architecture

**Use case naming**: verb-first, imperative, `camelCase`. Examples: `logSet`, `startSession`, `pickExercise`. Never noun-first (`sessionLogger`, `setManager`).

**Barrel discipline**: every bounded-context folder in every layer must have an `index.ts` that exports only its public API. Other layers import via the barrel, never via deep paths like `@application/sessions/logSet`. Domain barrels in use: `@domain/sessions`, `@domain/exercises`, `@domain/planning`, `@domain/analytics`, `@domain/shared`. Deep paths like `@domain/sessions/TrainingSession` or `@domain/shared/Weight` are violations.

**Composition root**: only hooks may instantiate infrastructure classes (repositories). Use cases accept repository interfaces via constructor injection. A use case must never `new` a repository.

**Commands vs queries**: distinguish mutating use cases (commands) from read use cases (queries). Commands should not return domain objects beyond IDs; queries should not cause side effects.

**Presentation stays thin**: hooks own composition and state. Components render and emit events only — no business logic in JSX. Domain objects must not be passed directly as props; transform to view models at the hook boundary.

## PWA / iPhone Requirements

- `viewport-fit=cover` in the `<meta name="viewport">` tag.
- `apple-mobile-web-app-status-bar-style` meta tag set to `black-translucent`.
- Bottom nav: `padding-bottom: env(safe-area-inset-bottom)` — prevents home indicator overlap.
- Touch targets: minimum 44×44 CSS px (Apple HIG).
- Service worker update: listen for `installed` event with `isUpdate=true`, show reload banner.
- Icons: separate 180×180 `apple-touch-icon` in addition to the manifest icons.
