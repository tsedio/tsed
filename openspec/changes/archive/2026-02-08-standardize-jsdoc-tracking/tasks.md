1. **Create a canonical docs home for JSDoc trackers.**
   - Add `reports/jsdoc/README.md` (or equivalent) that explains the symbol-only workflow, how to interpret status legends, and why `yarn api:build` validation matters.
   - Validation: `yarn lint reports/jsdoc` (or `yarn docs:lint` if available) passes so the new docs conform to existing markdown rules.
2. **Port the Ts.ED Core tracker into docs.**
   - Move the content from `.plan/core-jsdoc-status/plan.md` into `reports/jsdoc/core.md`, preserving the purpose, summary tables, symbol checklist (`StaticMethodDecorator` pending), priorities, and validation notes.
   - Validation: run `yarn api:build` after the next Core documentation batch and note the result in the tracker.
3. **Port the Ts.ED DI tracker into docs.**
   - Capture the browser/common/node breakdown, outstanding interfaces/utils/registries, execution plan, and statistics inside `reports/jsdoc/di.md`.
   - Validation: `yarn api:build` shows no TSDoc regressions for `packages/di`, and the tracker’s counts match the state of the repo.
4. **Port the Ts.ED Hooks tracker into docs and mark validation complete.**
   - Since Hooks is already documented, focus on documenting the requirements plus checking off the pending `yarn api:build` validation.
   - Validation: run `yarn api:build` once and add the completion note to the tracker.
5. **Port the Ts.ED Schema tracker into docs.**
   - Migrate the phase breakdown (core foundation, user-facing API, supporting components, implementation details), category summaries, and statistics into `reports/jsdoc/schema.md`.
   - Validation: `yarn api:build` against `packages/specs/schema` completes successfully, and the tracker reflects the outstanding decorators/components/utils backlog.
6. **Retire the legacy `.plan` directory and update contributor guidance.**
   - Remove the `.plan/*` markdown files once all four trackers live under `reports/jsdoc/`, and update contributor guidance to reference the new location plus the OpenSpec specs.
   - Validation: `git status` shows the `.plan` directory removed, and the docs build (`yarn docs:build`) continues to succeed.
