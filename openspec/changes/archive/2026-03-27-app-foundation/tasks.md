## 1. Project Scaffold

- [x] 1.1 Initialise Vite project with React + TypeScript template (`npm create vite@latest`)
- [x] 1.2 Install and configure Tailwind CSS
- [x] 1.3 Create DDD folder structure: `src/domain/`, `src/application/`, `src/infrastructure/`, `src/presentation/`
- [x] 1.4 Create placeholder `index.ts` in each bounded context subfolder: `domain/exercises/`, `domain/sessions/`, `domain/planning/`
- [x] 1.5 Configure TypeScript path aliases (`@domain`, `@application`, `@infrastructure`, `@presentation`) in `tsconfig.json` and `vite.config.ts`

## 2. PWA Shell

- [x] 2.1 Install and configure `vite-plugin-pwa`
- [x] 2.2 Create `manifest.json` with app name, `display: "standalone"`, theme colour, and 192×192 + 512×512 icons
- [x] 2.3 Configure Service Worker via `vite-plugin-pwa` to cache the app shell (Workbox `generateSW` strategy)
- [x] 2.4 Verify app is installable in Safari on iPhone (standalone launch, icon visible)

## 3. Testing Infrastructure

- [x] 3.1 Install and configure Vitest with `jsdom` environment
- [x] 3.2 Write a smoke test for a pure domain value object (e.g., a placeholder `Weight` type) to confirm Vitest runs headlessly
- [x] 3.3 Install Playwright and run `npx playwright install chromium`
- [x] 3.4 Write a minimal Playwright E2E test (app loads, shows root element)
- [x] 3.5 Verify both `npx vitest run` and `npx playwright test` complete successfully on Windows

## 4. Storage Foundation

- [x] 4.1 Install Dexie.js
- [x] 4.2 Create `src/infrastructure/db/database.ts` with Dexie class and `version(1).stores({})` (empty schema for now)
- [x] 4.3 Define a base `Repository<T>` interface in `src/domain/shared/Repository.ts`
- [x] 4.4 Verify that `src/domain/` contains zero imports from Dexie (grep check)

## 5. CI/CD Pipeline

- [x] 5.1 Create `.github/workflows/ci.yml` with jobs: install → vitest → playwright
- [x] 5.2 Cache `node_modules` and Playwright browsers in the workflow
- [x] 5.3 Push to GitHub and confirm the Actions workflow runs and goes green
