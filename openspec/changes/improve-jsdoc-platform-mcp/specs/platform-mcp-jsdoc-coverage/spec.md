## ADDED Requirements

### Requirement: Exported Platform MCP APIs include canonical TSDoc

All publicly exported classes, decorators, factories, and helpers under `packages/platform/platform-mcp/src` SHALL declare a TSDoc-compliant block that summarizes behavior and lists every parameter, type parameter, and return value.

#### Scenario: Export lacks documentation

- **WHEN** a developer inspects any symbol exported from the Platform MCP barrel files
- **THEN** they SHALL see a TSDoc block that includes a summary line, `@module platform/mcp`, and structured tags for all inputs/outputs

### Requirement: Metadata supports automated docs and LLM context

JSDoc SHALL include additional tags (e.g., `@since`, `@example`, `@deprecated`) whenever applicable so that the TSDoc → Markdown pipeline can surface versioning/usage guidance without manual edits.

#### Scenario: Feature introduces usage nuance

- **WHEN** a decorator or helper has prerequisites, side effects, or version constraints
- **THEN** its TSDoc SHALL document those details using the appropriate tags so downstream consumers and LLM tools receive the context

### Requirement: Documentation build validates coverage

`yarn api:build` (or an equivalent scoped run) MUST succeed without TSDoc warnings for Platform MCP before the change is merged.

#### Scenario: Docs build runs after comment updates

- **WHEN** the documentation build executes following the JSDoc refresh
- **THEN** it SHALL complete without emitting TSDoc errors or dropping Platform MCP symbols from the generated markdown
