## Context

Greenfield strength training PWA. No existing codebase. Developer is on Windows; the app targets iPhone (Safari PWA). All subsequent changes (exercise library, session tracking, analytics) build on this foundation. Key constraints: automated testability on Windows without iOS simulator, long-term stability, offline-first.

## Goals / Non-Goals

**Goals:**
- Installable PWA on iPhone via Safari
- DDD folder structure enforced by convention (and optionally ESLint rules)
- Full test suite runnable on Windows: unit tests headless, E2E headless via Playwright
- IndexedDB as local storage via Dexie.js, wrapped behind repository interfaces
- GitHub Actions CI running on every push

**Non-Goals:**
- App Store distribution
- Backend / sync / cloud storage
- Any business domain features (exercise library, sessions, etc.)
- React Native or Expo

## Decisions

### React PWA over React Native / Expo

React (web) chosen over React Native for two reasons: (1) E2E testing — Playwright runs headlessly on Windows; Detox requires macOS iOS simulator, breaking AI-assisted automated testing; (2) longevity — HTML/CSS/JS are W3C open standards, React is Meta-backed with 13+ years of stability; Expo is a private VC-funded company with more discontinuation risk.

*Alternatives considered*: Expo (rejected: Detox/macOS constraint), Capacitor (viable migration path if native shell needed later — same React code).

### Vite over Create React App

CRA is effectively unmaintained. Vite is the current community standard, faster HMR, first-class TypeScript support.

### DDD Layer Separation

```
src/
  domain/           ← pure TypeScript, zero framework imports
    exercises/      ← future bounded context
    sessions/       ← future bounded context
    planning/       ← future bounded context
  application/      ← use cases, orchestration, pure TypeScript
  infrastructure/   ← Dexie.js repos, service worker, external adapters
  presentation/     ← React components, hooks, routing
```

Dependency rule: domain ← application ← infrastructure; domain ← application ← presentation. Domain never imports from other layers. Infrastructure implements interfaces defined in domain.

*Why strict layers*: Domain logic is testable with Vitest in milliseconds, no browser, no database. AI can iterate on business rules rapidly.

### Dexie.js for IndexedDB

Stable since 2013, TypeScript-first, wraps the W3C IndexedDB standard. Repository interfaces live in domain (no Dexie import); Dexie implementations live in infrastructure. Swappable if needed.

*Alternatives considered*: localForage (less TypeScript-native), PouchDB (adds sync complexity not needed yet), plain IndexedDB (verbose API).

### Vitest + Playwright

Vitest: same config as Vite, fast, runs domain/application tests without browser or simulator. Playwright: Microsoft-backed, headless Chromium on Windows, AI can run `npx playwright test` directly.

*Alternatives considered*: Jest (slower, separate config), Cypress (no headless mode on all platforms).

### Tailwind CSS

Utility-first, no CSS-in-JS runtime cost, works well with component libraries, easy to theme for mobile-first layout.

## Risks / Trade-offs

- PWA on iOS Safari has limited capabilities (no background sync, push notifications restricted) → acceptable for this app's use case (foreground-only training tracker)
- IndexedDB data is browser-scoped; clearing Safari data deletes all training history → mitigated by JSON export/import feature (separate change)
- No type-safe enforcement of DDD layer boundaries (only convention + optional ESLint) → acceptable for a solo project

## Migration Plan

Greenfield — no migration needed. GitHub Actions will require a public repo or GitHub Pro for private repo CI minutes.
