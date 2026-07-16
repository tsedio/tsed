## 1. OpenSpec And Tooling Setup

- [x] 1.1 Add the OpenSpec proposal, design, and spec artifacts for the Oxc migration.
- [x] 1.2 Add repository `oxlint` configuration and any required `oxfmt` configuration files.
- [x] 1.3 Update root scripts and pre-commit automation to use `oxlint` and `oxfmt`.

## 2. Legacy Stack Removal

- [x] 2.1 Replace the workspace import guard currently supplied by ESLint with a dedicated validation step.
- [x] 2.2 Remove root ESLint/Prettier dependencies and package-level `eslint` devDependencies no longer needed by the supported workflow.
- [x] 2.3 Remove obsolete ESLint configuration files and stale script references.

## 3. Validation

- [x] 3.1 Regenerate the lockfile and install the Oxc tooling packages.
- [x] 3.2 Run targeted lint and format validation and fix migration issues.
- [x] 3.3 Update the task checklist to reflect the completed migration work.
