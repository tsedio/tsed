1. **Create `reports/jsdoc/json-mapper.md`.**
   - Mirror the structure of `reports/jsdoc/di.md` (purpose, rules, legend, summaries, checklists, execution plan, statistics) but scoped to `packages/specs/json-mapper`.
   - Call out the “no `@example` tag” rule (use Markdown headings instead) and explicitly mention that only exported symbols—not members—are documented.
   - Validation: `git diff reports/jsdoc/json-mapper.md` shows the expected sections before continuing.
2. **Populate folder-level summaries and per-symbol checklists.**
   - Group files under the six top-level folders (`domain`, `components`, `decorators`, `hooks`, `interfaces`, `utils`) and list each file with `[ ]/[~]/[x]` statuses.
   - Add detailed checklists for high-impact exports (e.g., `JsonSerializer`, `JsonDeserializer`, `JsonMapperSettings`, `JsonMapperCompiler`, `serialize.ts`, `deserialize.ts`, mapper components) noting any pending work.
   - Validation: peer review or self-audit of the package confirms the listed files/symbols match the current repo layout.
3. **Define the execution plan, priorities, and statistics.**
   - Outline phased work (e.g., Phase 1: domain + utils, Phase 2: components + decorators/hooks, Phase 3: interfaces + advanced hooks) and capture current counts/percentages.
   - State that each batch must run `yarn api:build --filter @tsed/json-mapper` (or equivalent) to validate TSDoc.
   - Validation: stats section includes totals and percentages; execution plan references the validation command.
4. **Update tracker references.**
   - Mention JSON Mapper in `reports/jsdoc/README.md` (package list and workflow tips) and, if needed, in `AGENTS.md`’s JSDoc tracker guidance.
   - Validation: those docs now list `json-mapper.md` alongside the existing trackers.
5. **Validate the OpenSpec change.**
   - Run `openspec validate elevate-json-mapper-jsdoc --strict` and resolve any issues.
   - Validation: command exits 0; record the result in the PR/summary.
