## Context

MCP SDK v2 separates server primitives into `@modelcontextprotocol/server` and Node.js HTTP adapters into `@modelcontextprotocol/node`. It replaces the flat `RequestHandlerExtra` handler argument with `ServerContext`.

## Decisions

- Use `McpServer` and all MCP protocol types from `@modelcontextprotocol/server`.
- Use `NodeStreamableHTTPServerTransport` from `@modelcontextprotocol/node/streamableHttp` because Ts.ED forwards Node HTTP request and response objects.
- Keep the endpoint stateless with `sessionIdGenerator: undefined` and continue closing each per-request transport on response close.
- Keep the public option property named `transportOptions`, using the v2-compatible options alias exported by the Node adapter.
- Compile Ts.ED `JsonSchema` instances with `s.compile()` and pass the resulting document to `fromJsonSchema()`. This lets the SDK v2 advertise and validate JSON Schema without a Zod conversion.

## Risks

- The v2 JSON Schema adapter validates input with the SDK-selected runtime validator; integration tests must cover the advertised schemas and tool execution.
- Registration and HTTP behavior can differ subtly, so existing Express and Fastify integration tests remain part of the migration validation.
