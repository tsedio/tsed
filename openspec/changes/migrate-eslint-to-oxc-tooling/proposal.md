## Why

The current code-quality stack relies on ESLint plus Prettier, which increases install cost and lint latency across a large monorepo. Moving to the Oxc toolchain lets the workspace standardize on faster linting and formatting with a single ecosystem.

## What Changes

- Replace root lint scripts so `oxlint` becomes the default JavaScript/TypeScript linter for local and CI workflows.
- Replace root formatting scripts and staged formatting so `oxfmt` becomes the default formatter in place of Prettier.
- Add committed Oxc configuration files that preserve current ignore patterns and key lint behavior used by the repository.
- Remove the root ESLint/Prettier dependencies and the repeated package-level `eslint` devDependency declarations that are no longer part of the supported stack.
- Preserve the existing absolute-import guard with a dedicated workspace validation script where `oxlint` has no native equivalent.

## Capabilities

### New Capabilities

- `oxc-tooling-workflow`: Defines the repository-standard linting and formatting workflow around `oxlint`, `oxfmt`, and the retained workspace import guard.

### Modified Capabilities

<!-- Existing capabilities whose REQUIREMENTS are changing (not just implementation).
     Only list here if spec-level behavior changes. Each needs a delta spec file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->

## Impact

- Affected code: root tooling configuration, package manifests, git hooks, and any documentation that references ESLint or Prettier as the default stack.
- APIs: no runtime API changes.
- Dependencies: remove ESLint/Prettier packages and add `oxlint`/`oxfmt`.
- Systems: local developer workflow, CI lint/format checks, and pre-commit automation.
