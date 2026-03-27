## ADDED Requirements

### Requirement: Source code is organised in DDD layers
The system SHALL use a four-layer folder structure under `src/`: `domain/`, `application/`, `infrastructure/`, `presentation/`. Each layer has a defined responsibility and import direction.

#### Scenario: Domain layer has no framework imports
- **WHEN** any file under `src/domain/` is inspected
- **THEN** it contains no imports from React, Dexie, or any infrastructure/presentation module

#### Scenario: Infrastructure implements domain interfaces
- **WHEN** a repository or adapter exists in `src/infrastructure/`
- **THEN** it implements an interface or abstract class defined in `src/domain/`

### Requirement: Bounded contexts are separated by subfolder
The system SHALL organise domain and application code into subfolders per bounded context (e.g., `domain/exercises/`, `domain/sessions/`, `domain/planning/`). Cross-context imports SHALL go through application-layer services, not directly between domain modules.

#### Scenario: Bounded context folder exists
- **WHEN** a new domain concept is introduced
- **THEN** it is placed in a named subfolder under `src/domain/` corresponding to its bounded context

### Requirement: Presentation layer accesses domain only through application layer
The system SHALL prevent React components from importing domain aggregates or repositories directly. All data flow from domain to UI SHALL pass through application-layer use cases or query services.

#### Scenario: Component uses application layer
- **WHEN** a React component needs domain data
- **THEN** it calls an application-layer function or hook, not a domain or infrastructure class directly
