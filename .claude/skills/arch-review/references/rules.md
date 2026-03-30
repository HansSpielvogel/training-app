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

## PWA / iPhone Requirements

- `viewport-fit=cover` in the `<meta name="viewport">` tag.
- `apple-mobile-web-app-status-bar-style` meta tag set to `black-translucent`.
- Bottom nav: `padding-bottom: env(safe-area-inset-bottom)` — prevents home indicator overlap.
- Touch targets: minimum 44×44 CSS px (Apple HIG).
- Service worker update: listen for `installed` event with `isUpdate=true`, show reload banner.
- Icons: separate 180×180 `apple-touch-icon` in addition to the manifest icons.
