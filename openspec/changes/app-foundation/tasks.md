## 1. Project Scaffold

- [ ] 1.1 Initialise Vite project with React + TypeScript template (`npm create vite@latest`)
- [ ] 1.2 Install and configure Tailwind CSS
- [ ] 1.3 Create DDD folder structure: `src/domain/`, `src/application/`, `src/infrastructure/`, `src/presentation/`
- [ ] 1.4 Create placeholder `index.ts` in each bounded context subfolder: `domain/exercises/`, `domain/sessions/`, `domain/planning/`
- [ ] 1.5 Configure TypeScript path aliases (`@domain`, `@application`, `@infrastructure`, `@presentation`) in `tsconfig.json` and `vite.config.ts`

## 2. PWA Shell

- [ ] 2.1 Install and configure `vite-plugin-pwa`
- [ ] 2.2 Create `manifest.json` with app name, `display: "standalone"`, theme colour, and 192×192 + 512×512 icons
- [ ] 2.3 Configure Service Worker via `vite-plugin-pwa` to cache the app shell (Workbox `generateSW` strategy)
- [ ] 2.4 Verify app is installable in Safari on iPhone (standalone launch, icon visible)

## 3. Testing Infrastructure

- [ ] 3.1 Install and configure Vitest with `jsdom` environment
- [ ] 3.2 Write a smoke test for a pure domain value object (e.g., a placeholder `Weight` type) to confirm Vitest runs headlessly
- [ ] 3.3 Install Playwright and run `npx playwright install chromium`
- [ ] 3.4 Write a minimal Playwright E2E test (app loads, shows root element)
- [ ] 3.5 Verify both `npx vitest run` and `npx playwright test` complete successfully on Windows

## 4. Storage Foundation

- [ ] 4.1 Install Dexie.js
- [ ] 4.2 Create `src/infrastructure/db/database.ts` with Dexie class and `version(1).stores({})` (empty schema for now)
- [ ] 4.3 Define a base `Repository<T>` interface in `src/domain/shared/Repository.ts`
- [ ] 4.4 Verify that `src/domain/` contains zero imports from Dexie (grep check)

## 5. CI/CD Pipeline

- [ ] 5.1 Create `.github/workflows/ci.yml` with jobs: install → vitest → playwright
- [ ] 5.2 Cache `node_modules` and Playwright browsers in the workflow
- [ ] 5.3 Push to GitHub and confirm the Actions workflow runs and goes green
