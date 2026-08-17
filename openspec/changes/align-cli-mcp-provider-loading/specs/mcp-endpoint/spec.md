## MODIFIED Requirements

### Requirement: Functional MCP APIs

The package SHALL export functional helpers (`defineTool`, `definePrompt`, `defineResource`) that accept JsonSchema/Zod definitions, register DI tokens, and reuse the `.cli-mcp` DI-context execution model (per-call `DIContext`, structured error handling). Tools/resources/prompts registered through these helpers MUST automatically attach to the singleton `McpServer` without manual wiring. Both HTTP and CLI server factories MUST combine providers registered by MCP type with the matching `mcp.tools`, `mcp.resources`, and `mcp.prompts` configuration arrays.

#### Scenario: Register tool via helper

- **WHEN** a developer calls `defineTool({ name: "hello", handler })` and adds the returned provider token to a module's `providers`
- **THEN** the `McpServer` reports a `hello` tool in its metadata and the handler executes inside a Ts.ED DI context when the MCP client invokes it.

#### Scenario: Register configured CLI providers

- **WHEN** a CLI application configures MCP tool, resource, or prompt tokens under `mcp`
- **THEN** its CLI MCP server registers those definitions without importing `@tsed/platform-http`.
