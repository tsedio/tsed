## Context

Ts.ED is a large TypeScript monorepo with many package categories and shared compiler settings through project references. The change introduces TypeScript 6, which is expected to enforce stricter checks and expose latent typing issues across source, tests, and generated type surfaces. The migration must keep workspace builds stable while minimizing disruption for maintainers and package consumers.

## Goals / Non-Goals

**Goals:**

- Make the monorepo compile successfully with TypeScript 6 under strict compilation expectations.
- Apply a repeatable remediation strategy for type errors across packages.
- Preserve runtime behavior; focus on type-system correctness and build reliability.
- Keep CI and local workflows aligned on a single supported TypeScript major.

**Non-Goals:**

- Refactoring unrelated architecture or runtime features.
- Rewriting public APIs beyond changes required by stricter type constraints.
- Introducing package-level behavior changes unrelated to compiler compatibility.

## Decisions

1. **Adopt a staged migration instead of a single bulk refactor**

   - Rationale: the monorepo scope is broad and a one-shot update would make regressions hard to isolate.
   - Approach: split into phases (toolchain upgrade, baseline diagnostics, package-batch fixes, CI hardening).
   - Alternative considered: one large compatibility PR; rejected due to review/debug risk.

2. **Use TypeScript 6 as source of truth for diagnostics from day one**

   - Rationale: avoiding mixed compiler versions prevents false confidence and divergent failures.
   - Approach: bump root dependency and run all type-check/build commands on TS6 during migration.
   - Alternative considered: dual TS5/TS6 support window; rejected to reduce matrix complexity.

3. **Fix errors by tightening types, not by weakening compiler guarantees**

   - Rationale: the objective is long-term type safety under stricter checks.
   - Approach: prefer explicit narrowing, safer generics constraints, precise return types, and null/undefined handling over global `skipLibCheck`-style escapes.
   - Alternative considered: temporary broad tsconfig relaxations; rejected except for narrowly scoped, time-boxed exceptions if blockers appear.

4. **Prioritize shared and high-fanout packages first**

   - Rationale: fixes in foundational packages reduce downstream error volume.
   - Approach: address core/shared utility layers before adapter/integration packages.
   - Alternative considered: alphabetical package order; rejected as low leverage.

5. **Protect migration with targeted validation gates**

   - Rationale: partial fixes can regress quickly in a multi-package workspace.
   - Approach: run package-scoped tests during remediation and full workspace build/test gates before completion.
   - Alternative considered: full-suite-only validation at the end; rejected due to late failure discovery.

6. **Introduce a temporary migration dashboard for diagnostics tracking**
   - Rationale: coordinating parallel remediation across many packages requires a shared, current view of remaining type debt.
   - Approach: maintain a lightweight dashboard (diagnostic count by package/category, owner, status) updated at agreed checkpoints.
   - Exit criterion: remove the dashboard once workspace diagnostics reach zero under TS6 and migration tasks are complete.
   - Alternative considered: rely only on ad hoc local outputs; rejected due to poor cross-team visibility.

## Risks / Trade-offs

- **[Risk] Hidden type debt causes larger-than-expected fix volume** → Mitigation: batch work by package category and track unresolved diagnostics per batch.
- **[Risk] Public type signatures become stricter and affect consumers** → Mitigation: mark type-surface changes explicitly and document breaking implications in release notes.
- **[Risk] CI duration increases during migration** → Mitigation: use scoped test/type-check loops during development, reserve full matrix checks for merge gates.
- **[Risk] Overuse of temporary suppressions reduces migration quality** → Mitigation: require each suppression to be narrowly scoped with follow-up cleanup tasks.

## Migration Plan

1. Upgrade TypeScript dependency and any directly coupled tooling/configuration to TS6-compatible versions.
2. Generate an initial diagnostic baseline via workspace build/type-check commands.
3. Remediate errors in prioritized batches (core/shared first, then platform/specs/orm/graphql/security/third-parties/utils).
4. Validate each batch with package-scoped tests and type checks, then run full workspace build/test/lint before finalization.
5. Update CI to enforce TS6 as the default compiler path and remove legacy TS5 assumptions.
6. Document breaking type-surface changes and migration notes for maintainers/consumers.

Rollback strategy:

- If an unrecoverable blocker appears, pin back to the previous TypeScript major and retain remediation commits behind feature branch history for incremental re-apply.

## Open Questions

- Which TypeScript 6 options are newly strict by default in our current config stack, and do any require explicit overrides?
- Do any third-party typings used by Ts.ED packages currently lag behind TS6 compatibility?
