## Context

MCP SDK v2 separates server primitives into `@modelcontextprotocol/server` and Node.js HTTP adapters into `@modelcontextprotocol/node`. It replaces the flat `RequestHandlerExtra` handler argument with `ServerContext`.

## Decisions

- Use `McpServer` and all MCP protocol types from `@modelcontextprotocol/server`.
- Use `NodeStreamableHTTPServerTransport` from `@modelcontextprotocol/node/streamableHttp` because Ts.ED forwards Node HTTP request and response objects.
- Keep the endpoint stateless with `sessionIdGenerator: undefined` and continue closing each per-request transport on response close.
- Keep the public option property named `transportOptions`, using the v2-compatible options alias exported by the Node adapter.

## Risks

- v2 requires Zod 4.2 or newer; the package's existing Zod 4 range must be raised accordingly.
- Registration and HTTP behavior can differ subtly, so existing Express and Fastify integration tests remain part of the migration validation.
