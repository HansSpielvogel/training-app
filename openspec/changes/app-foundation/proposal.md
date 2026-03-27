## Why

The strength training app needs a technical foundation before any domain features can be built. This change establishes the project scaffold, DDD architecture, automated test infrastructure, and offline-capable PWA setup that all subsequent changes (exercise library, training plans, session tracking) will build on.

## What Changes

- New React + TypeScript project via Vite, installable as PWA on iPhone
- Domain-Driven Design folder structure with bounded context conventions
- Vitest configured for unit/integration tests (domain layer, headless, runs on Windows)
- Playwright configured for E2E tests (AI can run and debug automatically)
- Dexie.js (IndexedDB) base layer with repository pattern foundation
- GitHub Actions CI pipeline running all tests on push
- Tailwind CSS for styling

## Capabilities

### New Capabilities

- `pwa-shell`: Installable PWA with Vite + React 18 + TypeScript, offline-capable via Service Worker, deployable to iPhone via Safari "Add to Home Screen"
- `ddd-architecture`: Bounded context folder conventions, layer separation (domain / application / infrastructure / presentation), dependency rules
- `testing-setup`: Automated test infrastructure — Vitest for unit/integration (pure TS domain), Playwright for E2E (headless, runs on Windows without simulator)
- `storage-foundation`: Dexie.js IndexedDB wrapper, base repository interface, local-first data persistence

### Modified Capabilities

## Impact

- New project: no existing code affected
- Dependencies introduced: React 18, TypeScript, Vite, Vitest, Playwright, Dexie.js, Tailwind CSS
- GitHub repository required for CI/CD (GitHub Actions)
- No backend, no external APIs — fully local, offline-first
