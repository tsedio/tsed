# Change: Add @tsed/mcp package for MCP endpoints

## Why

Ts.ED users can currently self-host a Model Context Protocol server only through the experimental CLI project under
`packages/third-parties/mcp/.cli-mcp`. That code exposes `defineTool` helpers and MCP transports, but it cannot be
consumed inside Ts.ED HTTP applications or decorated controllers. Without a first-party package there is no way to mount
`/mcp` on Express/Fastify/Koa adapters, share DI-managed tools/prompts/resources, or reuse the existing CLI abstractions
across projects.

## What Changes

- Scaffold a new workspace package `@tsed/mcp` under `packages/platform/platform-mcp` with build configs, exports, README,
  and a dependency on `@tsed/platform-http` + `@modelcontextprotocol/sdk`.
- Extract the reusable MCP helpers from `.cli-mcp` (tool/resource/prompt definitions, server factory) so that both the
  CLI and Ts.ED apps can share the same DI-aware functional API.
- Provide a `PlatformMcpModule` (or equivalent platform service) that registers a configurable `/mcp` route on any Ts.ED HTTP
  adapter using `@tsed/platform-http`, instantiating a single `McpServer` and wiring transports (streamable HTTP +
  stdio).
- Add decorator-level ergonomics (`@Tool`, `@Prompt`, `@Resource`, etc.) so developers can opt into declarative
  registrations without manually calling the functional API.
- Cover the new surface with unit/integration tests, configuration docs, and validation that existing adapters can mount
  the endpoint.

## Impact

- Affected specs: `mcp-endpoint`
- Affected code: `packages/platform/platform-mcp`, `.cli-mcp` (shared helpers), Ts.ED platform wiring via
  `@tsed/platform-http`
