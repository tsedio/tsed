## 1. Package scaffolding

- [ ] 1.1 Create `packages/platform/platform-mcp/src` with standard entrypoints, `package.json`, tsconfigs, and build/test scripts that match other platform packages.
- [ ] 1.2 Declare dependencies (`@tsed/platform-http`, `@modelcontextprotocol/sdk`, etc.) plus tsconfig references so the workspace build can emit CJS/ESM bundles and types.

## 2. Shared MCP primitives

- [ ] 2.1 Extract or move the `.cli-mcp/src/fn` helpers (`defineTool`, `definePrompt`, `defineResource`) and the MCP server factory into the new package so both projects share the same DI-aware implementations.
- [ ] 2.2 Provide re-exported functional APIs (`defineTool`, `defineResource`, `definePrompt`) and ensure `.cli-mcp` builds against the shared code to avoid duplication.

## 3. Platform module & configuration

- [ ] 3.1 Introduce `McpSettings` (path, mode, adapter toggles) exposed via `@Configuration({mcp: ...})`.
- [ ] 3.2 Implement `PlatformMcpModule` (or equivalent service) that injects `PlatformApplication`, registers the `/mcp` route for all adapters, and instantiates a singleton `McpServer` with the shared helpers.
- [ ] 3.3 Wire the HTTP transport handler that uses `StreamableHTTPServerTransport` to process Model Context Protocol requests and respects the configurable path/mode.

## 4. Decorators & DI registration

- [ ] 4.1 Add decorators (`@Tool`, `@Prompt`, `@Resource`) that capture metadata and register providers with the MCP module.
- [ ] 4.2 Ensure decorators plug into Ts.ED DI (hooks/tests) so annotated services automatically register their handlers with the singleton server.

## 5. Tests & documentation

- [ ] 5.1 Add targeted unit tests for functional helpers, decorators, and the MCP server factory (DI context wiring, error handling, schema validation).
- [ ] 5.2 Create end-to-end / integration tests covering tool registration, HTTP transport handling, configuration overrides, and decorator-driven wiring.
- [ ] 5.3 Write user-facing docs both in `packages/platform/platform-mcp/README.md` and `docs/docs/mcp.md` (VitePress) covering installation, configuration, tools/prompts/resources, adapter usage, and referencing the `@tsed/cli-mcp` (CLI v7 beta) option for CLI-based MCP servers; update any relevant changelogs or root docs referencing MCP.

## 6. Validation & release prep

- [ ] 6.1 Run lint/tests for the package (and affected suites) plus `openspec validate add-mcp-package --strict --no-interactive` before requesting review.
