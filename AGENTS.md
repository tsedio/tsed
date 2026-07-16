# AGENTS: Ts.ED Development Guidelines

## Build & Configuration

### Project Structure

- `packages/platform/*` – Platform adapters (Express, Fastify, Koa, etc.)
- `packages/orm/*` – ORM integrations (Mongoose, Prisma, MikroORM, etc.)
- `packages/graphql/*` – GraphQL integrations (Apollo, TypeGraphQL)
- `packages/security/*` – Security plugins (Passport, OIDC, JWKS)
- `packages/specs/*` – Schema and specification tools (AJV, JSON Schema, Swagger)
- `packages/third-parties/*` – Third-party integrations
- `packages/utils/*` – Utility packages

### Setup Commands

```bash
yarn install      # Install dependencies via Yarn workspaces
yarn configure    # Generate workspace package references
yarn build        # Build all packages
yarn api:build    # Generate API documentation
```

### Key Configuration Files & Tools

- **Lerna** configuration selects Yarn as npm client, manages 8+ package categories.
- **TypeScript** project references via `tsconfig.json` -> `tsconfig.node.json` + `tsconfig.spec.json`.
- **Oxc tooling** integrates `oxlint`, `oxfmt`, import ordering, and workspace boundary validation.
- **Vitest** multi-project setup with per-package configs.

## Testing

### Framework

- **Vitest** with individual `vitest.config.mts` per package, leveraging `@tsed/vitest/presets`.

### Running Tests

```bash
yarn test                # Run all tests
yarn test:core           # Core packages (@tsed/{core,di,config,hooks,engines})
yarn test:platform       # Platform packages (@tsed/platform-*)
yarn test:specs          # Schema packages (@tsed/{ajv,exceptions,json-mapper,schema,swagger})
yarn test:orm            # ORM packages (@tsed/{adapters,mongoose,prisma,etc})
yarn test:graphql        # GraphQL packages (@tsed/{apollo,typegraphql})
yarn test:security       # Security packages (@tsed/{jwks,oidc-provider,passport})
yarn test:third-parties  # Third-party integrations
cd packages/<path> && yarn test   # Run tests for specific package
yarn test --coverage     # Coverage enabled by default per package
```

- To speed iteration, run package-scoped tests from the package directory (e.g., `cd packages/specs/schema && yarn test`).
- Individual test files: `npx vitest run specific-file.spec.ts` and watch mode via `npx vitest watch`.

## Code Quality

### Linting & Formatting

```bash
yarn test:lint       # Lint workspace with oxlint + workspace import guard
yarn test:lint:fix   # Fix lint issues
yarn format          # Format all files
```

- `oxlint` is the repository-standard linter, with Vitest checks and import ordering configured at the root.
- A dedicated workspace import guard preserves the prohibition on absolute imports between packages.

### TypeScript Configuration

- Project references enable incremental builds with separate configs for Node code and tests.
- Base `tsconfig` sets `baseUrl: "."` for consistent resolution.

## Workflow & Tooling

1. **Package Management**: Lerna + Yarn workspaces.
2. **Build System**: TypeScript project references with incremental compilation.
3. **Testing**: Vitest per-package configs.
4. **Documentation**: TSDoc for API docs, VitePress for user docs.
5. **CI/CD**: Parallelized suites with concurrency limits.

### Documentation

```bash
yarn api:build   # Build API docs
yarn docs:build  # Build user docs
yarn docs:serve  # Serve docs locally
```

### Monorepo Utilities

```bash
yarn clean               # Clean all packages
yarn sync:packages       # Sync dependencies
yarn build:references    # Update TS references
lerna run <command> --stream  # Run command across packages
```

### Release Process

- **semantic-release** drives automated releases with conventional commits.
- Lerna manages individual package versioning.

### Performance & Benchmarking

```bash
yarn benchmarks
yarn benchmarks:prepare
```

## Planning conventions (AI plans storage)

- Use the OpenSpec workflow for all non-trivial work. Review `openspec/AGENTS.md` and `openspec/project.md` before drafting a proposal.
- Store new plans/specs under `openspec/changes/<change-id>/` with the standard `proposal.md`, `tasks.md`, `design.md`, and `specs/` structure.
- JSDoc coverage progress now lives in `reports/jsdoc/`; do not recreate `.plan/*` trackers. For historical context see `openspec/changes/standardize-jsdoc-tracking`.

## JSDoc coverage trackers

- Package-specific progress reports live under `reports/jsdoc/` (`core.md`, `di.md`, `hooks.md`, `json-mapper.md`, `schema.md`).
- Each tracker captures the symbol-only rules (including language-specific reminders) plus validation expectations.
- When you update documentation in any of these packages, update the corresponding tracker and run `yarn api:build` to validate TSDoc.

This AGENTS file is the authoritative source for Ts.ED development guidance. Update this document first whenever processes change, and mirror references elsewhere.
