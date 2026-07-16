# oxc-tooling-workflow Specification

## ADDED Requirements

### Requirement: Repository linting uses Oxc tooling

The repository SHALL run JavaScript and TypeScript lint checks through `oxlint` as the default lint command for local development and CI.

#### Scenario: Maintainer runs the lint command

- **WHEN** a maintainer executes the repository lint script
- **THEN** the command runs `oxlint` against the workspace using the committed repository configuration

### Requirement: Repository formatting uses Oxc tooling

The repository SHALL run source formatting through `oxfmt` as the default formatting command and staged-file formatter.

#### Scenario: Maintainer formats the workspace

- **WHEN** a maintainer executes the repository format script or a staged-file formatting hook
- **THEN** the command formats matching files with `oxfmt` instead of Prettier

### Requirement: Workspace import boundaries remain enforced

The repository MUST continue rejecting absolute imports between workspace packages after migrating away from ESLint.

#### Scenario: Workspace package uses an absolute internal import

- **WHEN** a source file imports another workspace package through an absolute path that violates repository package-boundary rules
- **THEN** the lint workflow fails and reports the invalid import to the maintainer
