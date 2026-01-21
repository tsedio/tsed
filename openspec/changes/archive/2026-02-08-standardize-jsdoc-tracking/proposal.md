# Proposal: Standardize package JSDoc tracking under OpenSpec

## Discovery Notes

- `openspec/project.md` is not present in the repo, so there is no project-level charter to reference.
- After installing the `openspec` CLI (`npm install -g @fission-ai/openspec@latest`), `openspec list` shows the in-flight `standardize-jsdoc-tracking` change plus the earlier `add-jsonschema-object-transforms`, and `openspec list --specs` reports “No specs found,” meaning no global specs exist yet.
- The existing `.plan` directory contains four markdown trackers (`core-jsdoc-status`, `di-jsdoc-status`, `hooks-jsdoc-status`, `schema-jsdoc-status`) that capture purpose statements, symbol-only documentation rules, status tables, execution plans, and statistics for their respective packages.
- Each tracker currently lives outside the OpenSpec workflow, so none of the requirements or next steps are discoverable through `openspec` tooling.

## Problem Statement

Ts.ED relies on package-specific markdown trackers in `.plan/*` to coordinate JSDoc coverage sweeps, but those documents sit outside the canonical OpenSpec process. As a result:

- Contributors have to find and interpret ad-hoc plan files instead of spec-linked requirements.
- Progress data (status tables, per-symbol checklists, execution plans) is duplicated manually and is invisible to OpenSpec change reviews.
- There is no traceable link between the outstanding coverage work (e.g., DI utils, Schema decorators) and the specification system that drives approval.

We need to migrate the intent and structure of those trackers into OpenSpec so the remaining documentation work can be reasoned about, scheduled, and validated like any other change.

## Goals

1. Capture the scope, rules, and progress data for each package tracker (Core, DI, Hooks, Schema) as capabilities under a single OpenSpec change.
2. Preserve the granular signals from the `.plan` files—status legends, per-folder summaries, per-symbol checklists, priority lists, and statistics—so downstream implementation tasks stay actionable.
3. Highlight the outstanding work unique to each package (e.g., DI browser utilities still pending, Schema decorators Phase 2 backlog) to guide future task planning.
4. Define validation expectations (documentation updates plus `yarn api:build` runs) directly inside the specs so adoption can be verified.

## Non-Goals

- Writing or updating any JSDoc in the packages themselves (that happens during apply).
- Reformatting or deleting the existing `.plan` files; removal can happen after the OpenSpec-backed flow proves out.
- Building automation for status tracking—the deliverable is structured requirements, not tooling.

## Proposed Approach (High Level)

- Create a new OpenSpec change (`standardize-jsdoc-tracking`) that contains one spec delta per package tracker: `core-jsdoc-tracker`, `di-jsdoc-tracker`, `hooks-jsdoc-tracker`, and `schema-jsdoc-tracker`.
- For each spec delta, translate the source plan into requirements that cover (a) scope/purpose/rules, (b) progress views (summary tables, per-symbol checklists, or statistics), (c) execution plans or priority lists, and (d) validation expectations.
- Keep the language grounded in the observed data (exact folder names, counts, outstanding symbols) so implementation tasks can point back to specific requirements.
- Provide a concise design document that explains how the `.plan` data maps into spec capabilities and how future migrations (e.g., removing `.plan`) would proceed.

## Risks & Unknowns

- Without the `openspec` CLI we cannot auto-validate the change; manual review must ensure format correctness.
- The `.plan` files may continue evolving while this proposal is reviewed, so we will need to sync any updates before apply.
- Some trackers (e.g., Schema) are extremely detailed; capturing every bullet verbatim could inflate the spec, so we focus on requirements-level fidelity instead of literal copies.

## Success Measures

- Each `.plan/*/plan.md` has a corresponding spec delta that makes its scope, rules, progress, and next actions accessible through OpenSpec.
- Contributors can reference the specs instead of the ad-hoc `.plan` files when planning JSDoc work, including explicit acceptance criteria such as `yarn api:build`.
- Future tasks (e.g., deleting the `.plan` directory or updating docs) can cite these specs during apply, keeping the initiative on the critical path of OpenSpec reviews.
