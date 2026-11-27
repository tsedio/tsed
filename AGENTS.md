# AGENTS: Ts.ED Development Guidelines

Authoritative guidance for humans and agents working on Ts.ED. `CLAUDE.md` is a symlink to this file. Update it first whenever a process changes.

## Repository map

| Path                                    | Content                                                            |
| --------------------------------------- | ------------------------------------------------------------------ |
| `packages/{core,di,hooks,engines,perf}` | Core runtime                                                       |
| `packages/platform/*`                   | Platform adapters (Express, Fastify, Koa, ...)                     |
| `packages/specs/*`                      | Schema and specs (AJV, JSON Schema, JSON mapper, Swagger)          |
| `packages/orm/*`                        | ORM integrations (Mongoose, Prisma, MikroORM, ...)                 |
| `packages/graphql/*`                    | GraphQL integrations (Apollo, TypeGraphQL)                         |
| `packages/security/*`                   | Security plugins (Passport, OIDC, JWKS)                            |
| `packages/config/*`                     | Configuration sources                                              |
| `packages/third-parties/*`              | Third-party integrations                                           |
| `packages/testcontainers/*`             | Testcontainers helpers                                             |
| `plugins/*`                             | Agent plugins (Claude Code / Codex) for Ts.ED app developers       |
| `openspec/`                             | Living specs (`specs/`) and changes (`changes/`)                   |
| `.agents/skills`                        | Shared contributor skills (exposed to Claude via `.claude/skills`) |
| `reports/jsdoc/`                        | JSDoc coverage trackers                                            |

Stack: Yarn workspaces + Lerna, TypeScript project references (`tsconfig.node.json` / `tsconfig.spec.json`), Vitest (one `vitest.config.mts` per package using `@tsed/vitest/presets`), Oxc (`oxlint`, `oxfmt`), VitePress docs, semantic-release with conventional commits.

## Commands

```bash
yarn install && yarn configure   # Install, then generate workspace package references
yarn build                       # Build all packages
yarn build:references            # Update TS project references
yarn barrels                     # Regenerate src/index.ts barrels (also per package)

yarn test                        # All tests
yarn test:{core,platform,specs,orm,graphql,security,third-parties}   # One package family
cd packages/<path> && yarn test  # One package (fastest loop)
npx vitest run <file>.spec.ts    # One file, from the package directory

yarn test:lint                   # oxlint + workspace import guard + agent plugins check
yarn test:lint:fix               # Autofix lint issues
yarn format                      # oxfmt on the whole repo; `yarn oxfmt <files>` for changed files

yarn api:build                   # Build API docs and validate TSDoc
yarn docs:serve                  # Serve user docs locally
```

## Code rules

- Never import another package through an absolute path: the workspace import guard (`yarn test:lint`) rejects it.
- New file in `src/`: run `yarn barrels` in the package so `src/index.ts` exports it.
- Agent hooks (`.claude/settings.json`, `.codex/hooks.json`) run `tools/agents/hooks/lint-format.mjs`: edited files are fixed with oxlint and formatted with oxfmt after each edit, and at the end of a turn changed files are checked with `oxlint` and the workspace import guard: on failure the agent is sent back once to fix them (the checks are skipped when the turn was already continued by the hook, to avoid a loop). Codex asks to trust the project hooks on first run.
- Tests: never instantiate DI services or modules with `new`. Resolve them with `await PlatformTest.invoke(Token)` or `inject(Token)` so the real provider scope and dependency graph are exercised.
- Integration tests boot a real app with `PlatformTestSdk` + SuperTest (see `packages/security/passport/test`).
- JSDoc: when documenting `core`, `di`, `hooks`, `json-mapper` or `schema`, update the matching tracker in `reports/jsdoc/` and run `yarn api:build`. Do not recreate `.plan/*` trackers.

## Agent workflow

### Plan with OpenSpec

- Any non-trivial task (3+ steps or an architectural decision) starts with an OpenSpec change. Read `openspec/config.yaml` and the related specs in `openspec/specs/` first.
- `openspec-explore` (`/opsx:explore`) to think a problem through; `openspec-propose` (`/opsx:propose`) to write `proposal.md`, `design.md`, `tasks.md` and delta `specs/` under `openspec/changes/<change-id>/`.
- Write the specs upfront with `#### Scenario:` blocks (WHEN/THEN): they remove ambiguity and double as the verification plan. Run `openspec validate <change-id>`.
- Check in with the user before implementing (`openspec-apply-change` / `/opsx:apply`), then tick `tasks.md` items as you go.
- If something goes sideways, stop and re-plan: update `design.md` and `tasks.md` instead of pushing on.
- Once merged, sync the specs (`openspec-sync-specs`) and archive the change (`openspec-archive-change`).

### Execute

- **Root cause first**: identify the responsible layer (Ts.ED package, integration, third-party library) before changing code. No temporary fixes.
- **Bugs**: reproduce with a failing test, then fix it autonomously from logs, errors and failing tests. Fix failing CI without being told how.
- **Subagents**: offload research, exploration and parallel analysis to keep the main context clean, one focused task per subagent.
- **Minimal impact**: make every change as simple as possible and touch only what is necessary.
- **Elegance, balanced**: for non-trivial changes, ask whether there is a more elegant way and challenge your own work before presenting it. Do not over-engineer obvious fixes.

### Verify before done

- Never mark a task complete without proof: package tests, `yarn test:lint`, type check, logs.
- Compare the behaviour of the base branch with your changes when relevant.
- Ask yourself: "Would a staff engineer approve this?" Then give a high-level summary of what changed.

### Learn

- After any correction from the user, add a rule to `.agents/lessons.md` that prevents the same mistake.
- Review `.agents/lessons.md` at the start of each session.
