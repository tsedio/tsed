## Context

Platform MCP exposes the MCP-specific adapters, decorators, and helper factories that glue Ts.ED services to the Model Context Protocol lifecycle. The package currently mixes complete, partial, and missing JSDoc, so our TSDoc parser either emits thin markdown or drops symbols entirely when building the `/docs` API reference. The repo-wide guidance requires updated JSDoc before TSDoc coverage reports can advance, so we need a clear pass on every exported surface under `packages/platform/platform-mcp/src`.

## Goals / Non-Goals

**Goals:**

- Audit every exported class/function/constant in `packages/platform/platform-mcp/src` and ensure it carries a TSDoc-compliant comment.
- Capture params, type parameters, return types, side effects, and usage notes so LLM prompts and docs consumers have the same authoritative metadata.
- Align comment structure with Ts.ED conventions (`@module`, `@since`, `@example`, `@param`, `@returns`, `@deprecated` as needed) to keep generated markdown uniform.
- Validate the new comments via `yarn api:build` (TSDoc step) before landing.

**Non-Goals:**

- Changing runtime logic, signatures, or emitted types.
- Restructuring modules, renaming exports, or touching packages outside Platform MCP.
- Automating documentation coverage enforcement beyond this change (e.g., no new lint rule in this iteration).

## Decisions

1. **Scope = exported API only**

   - _Choice_: Document everything we export from the package barrels plus any internally exported helpers that users import directly. Private/local helpers remain untouched unless documenting them clarifies a public API.
   - _Rationale_: Keeps effort focused on the API surface that hits docs and downstream consumers; private helpers can be handled later if we adopt automated coverage gates.

2. **Use Ts.ED-standard TSDoc blocks**

   - _Choice_: Adopt the same block format we use in other packages—summary sentence, optional details paragraph, `@module`, `@since`, and per-parameter/returns tags.
   - _Alternatives considered_: Free-form comments (too inconsistent) or relying on `@tsed/common` defaults (insufficient detail).
   - _Why this works_: Aligns with the parser settings already in place for `yarn api:build`, ensuring the generated markdown inherits the correct metadata keys.

3. **Verification via targeted builds**

   - _Choice_: After editing comments, run `yarn api:build` (or at minimum `yarn api:build --filter platform-mcp` if available) to ensure TSDoc parsing succeeds and the new text renders. Spot-check the emitted markdown under `/docs` for representative symbols.
   - _Rationale_: Prevents regressions where malformed tags silently break docs or introduce broken anchors.

4. **Track coverage progress**
   - _Choice_: Update/extend the Platform MCP entry in `reports/jsdoc/` (or create one if missing) summarizing the new coverage level and any follow-up needed.
   - _Rationale_: Keeps Ts.ED-wide documentation tracking consistent and signals when this package reaches parity with others.

## Risks / Trade-offs

- **Out-of-date behavioral notes** → Mitigation: Confirm descriptions against implementation while editing to avoid codifying stale behavior.
- **Tag drift vs. existing docs** → Mitigation: Reuse phrasing from official guides where possible and run the docs build to catch mismatches early.
- **Time sink for low-value internals** → Mitigation: Stick to exported APIs for now and capture any remaining internal gaps in `reports/jsdoc` as future work.

## Migration Plan

1. Inventory exports (barrel files + package.json exports) to create a checklist.
2. Add/refresh TSDoc blocks file by file, keeping changes comment-only.
3. Update the Platform MCP entry in `reports/jsdoc/` with the new coverage summary.
4. Run `yarn api:build` to validate TSDoc and inspect generated markdown.
5. Land the change once lint/tests pass; no runtime rollout steps required.

## Open Questions

- Do we want to introduce a lint/coverage guard (e.g., custom eslint rule or script) in a follow-up to prevent regressions?
- Should private helper utilities that power public decorators also receive minimal doc blocks for future internal tooling, or is that out of scope for now?
