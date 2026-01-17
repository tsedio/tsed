# Project Context

## Purpose

Ts.ED is a TypeScript-first Node.js framework that unifies HTTP platforms (Express, Koa, Fastify, serverless targets) and adjacent tooling (ORM, GraphQL, OpenAPI, security, utilities). This monorepo maintains every first-party package, documentation site, and build/test workflow. Current priorities include improving documentation quality (notably symbol-only JSDoc coverage), keeping packages in sync, and ensuring the OpenSpec workflow captures all significant changes before implementation.

## Tech Stack

- TypeScript (strict mode, project references for node/test builds)
- Node.js + Yarn workspaces managed by Lerna (`yarn install/configure/build`)
- Vitest per-package configs via `@tsed/vitest/presets` (default coverage on)
- ESLint + Prettier + `eslint-plugin-simple-import-sort`
- VitePress for docs, TSDoc + `yarn api:build` for API references
- semantic-release + conventional commits for automated publishing
- OpenSpec CLI + `openspec/AGENTS.md` for proposal/apply workflows

## Project Conventions

### Code Style

- Follow ESLint + Prettier defaults enforced via `yarn test:lint` and `yarn prettier`.
- Imports between packages must remain relative (workspace rules forbid absolute cross-package paths).
- Documentation updates must respect the “symbols only” rule: JSDoc is applied to exported symbols, not their members; `@example` is replaced with Markdown headings where flagged (DI, Schema, Hooks).
- Keep comments concise; no runtime behavior changes when writing docs.

### Architecture Patterns

- Monorepo folders grouped by concern: `packages/platform/*`, `packages/orm/*`, `packages/graphql/*`, `packages/security/*`, `packages/specs/*`, `packages/third-parties/*`, `packages/utils/*`.
- Each package owns its own `vitest.config.mts`, tsconfig references, and build pipeline while sharing root tooling (TS project references, ESLint config, TSDoc).
- Cross-cutting utilities leverage decorators, DI, and metadata stores; schema tooling relies on JsonSchema stores + OpenSpec generators.

### Testing Strategy

- Run `yarn test` for the full suite or scoped variants (`yarn test:core`, `yarn test:platform`, etc.).
- Package-specific testing happens via `cd packages/<path> && yarn test`; coverage is enabled by default.
- Individual specs can run through `npx vitest run <file>` or watch mode.
- Documentation work should also run `yarn api:build` to surface TSDoc errors; docs changes may require `yarn docs:build`.

### Git Workflow

- Work happens on `production` (default) plus topic branches; integrate via PR with OpenSpec-approved changes.
- Commit messages follow conventional-commit semantics so semantic-release can version packages automatically.
- Do not rewrite history (`git reset --hard`, amend) unless explicitly requested; avoid touching unrelated dirty files.

## Domain Context

- Ts.ED targets server-side apps needing structured decorators, dependency injection, validation, and OpenAPI/JsonSchema tooling across multiple HTTP engines.
- Packages span platform adapters, DI, schema & specs, security modules (Passport, OIDC, JWKS), ORM bindings (Mongoose, Prisma, MikroORM), GraphQL adapters, and various utilities.
- Documentation (TSDoc + VitePress) plus API generation is a first-class deliverable; AGENTS emphasises keeping trackers up to date and validating with `yarn api:build`.

## Important Constraints

- Always consult `AGENTS.md` (and any package-specific trackers) before planning or implementing work; major efforts must start with OpenSpec proposals.
- Symbol-only documentation rules apply across Core/DI/Hooks/Schema and forbid `@example` tags where noted.
- Tests/linters/docs must run through Yarn (no npm scripts) to respect workspace tooling.
- Avoid network calls/installations unless required; use `rg` for search; do not revert user changes.

## External Dependencies

- Node.js toolchain (Yarn 4 workspaces, Lerna, semantic-release).
- Third-party protocols/frameworks exposed via packages (Express, Fastify, Koa, AWS/GCP serverless adapters, various ORMs, Passport/OIDC providers).
- OpenSpec CLI for change management; Amazon Q Developer and Codex integrations share the prompts installed during `openspec init`.
