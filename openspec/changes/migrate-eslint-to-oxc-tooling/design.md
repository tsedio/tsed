## Context

Ts.ED currently runs linting through a root flat ESLint config plus several ESLint plugins, and formatting through Prettier. The lint workflow also includes a monorepo-specific guard from `eslint-plugin-workspaces` that rejects absolute imports between workspace packages. Migrating to Oxc must keep the same entry points for contributors and CI while avoiding a silent loss of that workspace constraint.

## Goals / Non-Goals

**Goals:**

- Make `oxlint` the default lint entry point for the repository.
- Make `oxfmt` the default formatting entry point for the repository and pre-commit flow.
- Preserve current ignore patterns and the important Vitest/import sorting conventions already enforced in the repo.
- Keep the no-absolute-imports guard enforced even if it moves outside `oxlint`.

**Non-Goals:**

- Perfect one-to-one reproduction of every ESLint plugin rule when Oxc has no equivalent.
- Broad documentation refresh across every historical README badge in this same pass.
- Introducing type-aware linting or new style rules that are unrelated to the migration.

## Decisions

1. **Use native Oxc config files committed at the repo root**

   - Rationale: contributors and CI need deterministic config discovery without wrapper scripts.
   - Approach: add an `oxlint` config for rules/ignores and an `oxfmt` config only if the repo needs non-default formatting behavior.
   - Alternative considered: CLI-only scripts with inline flags; rejected because editor and hook integration becomes fragile.

2. **Preserve the workspace import guard with a dedicated script**

   - Rationale: `eslint-plugin-workspaces/no-absolute-imports` has no clear native `oxlint` replacement.
   - Approach: keep that rule’s intent through a small repository script wired into lint commands.
   - Alternative considered: drop the guard during migration; rejected because it would reduce monorepo safety.

3. **Replace scripts first, then remove legacy dependencies**

   - Rationale: script changes establish the supported workflow before package cleanup.
   - Approach: update `test:lint`, `test:lint:fix`, formatting scripts, and `lint-staged`, then remove root/package-level ESLint and Prettier dependencies.
   - Alternative considered: dependency cleanup first; rejected because it would temporarily leave broken scripts.

4. **Limit rule parity to what the current repo actually enforces**

   - Rationale: the existing ESLint config intentionally disables most strict TypeScript rules and only enforces a small rule set.
   - Approach: configure `oxlint` for current ignores, Vitest checks, import ordering, and disabled parity for `expect-expect`.
   - Alternative considered: enabling broader recommended categories; rejected to avoid noisy unrelated findings.

## Risks / Trade-offs

- **[Risk] `oxlint` rule semantics differ from ESLint equivalents** → Mitigation: validate on the existing codebase and adjust the config to match current expectations before declaring the migration complete.
- **[Risk] `oxfmt` formatting differs from Prettier in edge cases** → Mitigation: run targeted formatting checks and keep the first pass focused on workspace scripts/config rather than mass reformatting the repo.
- **[Risk] Some documentation still mentions ESLint/Prettier after the tooling switch** → Mitigation: update the primary workflow docs now and leave broad badge cleanup for a follow-up if needed.

## Migration Plan

1. Add OpenSpec artifacts for the migration and define the repository behavior contract.
2. Update root scripts and configs to use `oxlint` and `oxfmt`.
3. Add the replacement workspace import validation script and wire it into lint commands.
4. Remove legacy root ESLint/Prettier dependencies and package-level `eslint` devDependencies.
5. Regenerate the lockfile and run targeted validation for lint and format commands.

Rollback strategy:

- Revert the tooling/configuration commit and restore the previous lockfile state if the Oxc workflow proves incompatible with repository requirements.

## Open Questions

- Whether `oxfmt` defaults are sufficient, or whether the repo needs an explicit config file for future editor consistency even with default settings.
- Whether the wide set of README badge references to Prettier should be cleaned in this change or left for a documentation-only follow-up.
