## MODIFIED Requirements

### Requirement: Functional MCP APIs

The package SHALL export functional helpers (`defineTool`, `definePrompt`, `defineResource`) that accept JsonSchema/Zod definitions, register DI tokens, and reuse the `.cli-mcp` DI-context execution model (per-call `DIContext`, structured error handling). Tools/resources/prompts registered through these helpers MUST automatically attach to the singleton `McpServer` without manual wiring.

#### Scenario: Runtime server registration is covered

- **WHEN** the common MCP server factory registers configured or discovered providers
- **THEN** unit tests verify that the expected MCP registrations are available.

#### Scenario: CLI transport selection is covered

- **WHEN** `mcpServerConnect()` receives an HTTP or stdio mode
- **THEN** unit tests verify that only the matching CLI transport is invoked.
