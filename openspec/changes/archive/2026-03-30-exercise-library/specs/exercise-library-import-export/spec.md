## ADDED Requirements

### Requirement: Export exercise library
The system SHALL allow the user to export the full exercise library (all muscle groups and exercise definitions) as a JSON file download.

#### Scenario: Export with data
- **WHEN** the user triggers export and data exists
- **THEN** the system downloads a JSON file containing all muscle groups and exercise definitions

#### Scenario: Export with empty library
- **WHEN** the user triggers export and no data exists
- **THEN** the system downloads a valid JSON file with empty arrays

### Requirement: Import exercise library
The system SHALL allow the user to import a previously exported JSON file. Import SHALL replace the entire existing library after explicit confirmation.

#### Scenario: Successful import
- **WHEN** the user selects a valid export JSON file and confirms the replacement
- **THEN** the system clears the existing library and inserts all records from the file

#### Scenario: Import cancelled
- **WHEN** the user dismisses the confirmation dialog
- **THEN** the existing library is not modified

#### Scenario: Invalid file rejected
- **WHEN** the user selects a file that does not match the expected JSON structure
- **THEN** the system rejects the import and displays an error; existing data is not modified
