## ADDED Requirements

### Requirement: All app data is persisted locally in IndexedDB via Dexie.js
The system SHALL store all user data (exercises, plans, sessions) in the browser's IndexedDB using Dexie.js as the wrapper. Data SHALL survive page refreshes and app restarts.

#### Scenario: Data persists across sessions
- **WHEN** a user enters data and closes and reopens the app
- **THEN** the previously entered data is still present

### Requirement: Domain layer defines repository interfaces without Dexie dependency
The system SHALL define repository interfaces (e.g., `ExerciseRepository`) in `src/domain/` using only TypeScript. The domain layer SHALL NOT import Dexie.js or any IndexedDB API directly.

#### Scenario: Domain repository is a pure TypeScript interface
- **WHEN** `src/domain/` is inspected for Dexie imports
- **THEN** no such imports exist; only interface definitions are present

### Requirement: Infrastructure layer provides Dexie implementations of repository interfaces
The system SHALL implement each domain repository interface in `src/infrastructure/` using Dexie.js. The Dexie database schema SHALL be defined once in a central infrastructure file.

#### Scenario: Repository implementation uses Dexie
- **WHEN** `src/infrastructure/` is inspected
- **THEN** each repository class implements its corresponding domain interface and uses a Dexie Table for persistence

### Requirement: IndexedDB schema versioning is managed through Dexie migrations
The system SHALL define the IndexedDB schema using Dexie's versioned `.version()` API so that schema changes can be applied incrementally without data loss.

#### Scenario: Schema version is defined
- **WHEN** the Dexie database is initialised
- **THEN** at least one `.version(1).stores(...)` call is present defining the initial schema
