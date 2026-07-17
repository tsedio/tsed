## MODIFIED Requirements

### Requirement: Platform MCP endpoint

`@tsed/platform-mcp` SHALL provide a `PlatformMcpModule` that injects `@tsed/platform-http` to register a configurable POST endpoint (default `/mcp`). The module SHALL instantiate a singleton `McpServer` from `@modelcontextprotocol/server`, create a stateless `NodeStreamableHTTPServerTransport` from `@modelcontextprotocol/node` for each request, and allow Ts.ED apps on Express, Fastify, or Koa to mount the endpoint by declaring `imports: [PlatformMcpModule]` and optional `mcp` configuration.

#### Scenario: Custom path served on Express

- **WHEN** a Ts.ED Express application imports `PlatformMcpModule` and sets `configuration.mcp.path = "/ai/mcp"`
- **THEN** issuing a `POST /ai/mcp` request delivers the payload to the shared `McpServer` via `NodeStreamableHTTPServerTransport`, and the request is logged alongside other platform routes.

#### Scenario: Tool handler receives v2 context

- **WHEN** an MCP client invokes a registered tool
- **THEN** its handler receives the MCP SDK v2 `ServerContext` as its second argument.
