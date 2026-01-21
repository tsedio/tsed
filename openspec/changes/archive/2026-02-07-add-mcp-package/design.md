## Context

- The existing MCP effort lives entirely inside `packages/third-parties/mcp/.cli-mcp`, which boots a standalone MCP server for the Ts.ED CLI. Its helpers (`defineTool`, `definePrompt`, `defineResource`, server factory) already assume Ts.ED's DI container but are not published as a reusable package.
- Ts.ED HTTP apps (Express, Fastify, Koa, etc.) currently have no way to expose a Model Context Protocol endpoint or share CLI tools/prompts/resources. Each adapter would need a bespoke transport setup and there is no module that wires it into `@tsed/platform-http`.
- The user request is to create `@tsed/mcp` so regular Ts.ED applications can declare MCP tools (either via functions or decorators) and auto-mount a `/mcp` endpoint that works across adapters.

## Goals / Non-Goals

- Goals:
  - Publish `@tsed/mcp` as a first-party package that depends on `@tsed/platform-http` and `@modelcontextprotocol/sdk`.
  - Share the MCP helper implementations with `.cli-mcp` so there is a single source of truth for tool/prompt/resource definitions and server wiring.
  - Provide both functional and decorator-based APIs so teams can choose DI tokens or annotations to register MCP assets.
  - Mount a configurable `/mcp` transport (default path `/mcp`) on every Ts.ED adapter via `PlatformMcpModule` / `PlatformApplication`.
- Non-Goals:
  - Redesigning the Ts.ED CLI workflows or adding new CLI commands beyond consuming the shared helpers.
  - Implementing advanced MCP transports (websocket, SSE) beyond the existing stdio + streamable HTTP support.
  - Building full documentation for MCP clients—scope is limited to server-side support.

## Decisions

1. **Package layout & build**

   - Create `packages/platform/platform-mcp/src` with folders mirroring `.cli-mcp` (`fn`, `decorators`, `services`, `interfaces`).
   - Publish `@tsed/mcp` with the same toolchain (tsconfig refs, vitest) used by other platform packages so it integrates with workspace builds/tests.
   - `.cli-mcp` will import helpers from `@tsed/mcp` (workspace link) rather than owning duplicated copies.

2. **Shared MCP server factory**

   - Move the existing `McpServerFactory`, `mcpStreamableServer`, and `mcpStdioServer` into the new package.
   - Construct the `McpServer` via DI constants (name, version, registered tools/prompts/resources).
   - Expose a singleton token (`MCP_SERVER`) that can run either `stdio` or `streamable-http` transports.

3. **Platform HTTP integration**

   - Introduce `PlatformMcpModule` implementing `OnRoutesInit` (or `OnInit`) that injects `PlatformApplication` and `Configuration`.
   - Register a POST handler at `mcp.path` (default `/mcp`) that instantiates a `StreamableHTTPServerTransport` per request and forwards payloads to the shared `McpServer`.
   - Because the handler uses `PlatformApplication.use(path, handler)`, it works for Express, Fastify, and Koa adapters without adapter-specific code.
   - Provide a configuration object `McpSettings` allowing custom path, transport mode overrides, and optional auth hooks.

4. **Functional + decorator APIs**

   - Functional API: export `defineTool`, `defineResource`, `definePrompt` that accept JsonSchema/Zod definitions and return DI tokens to be registered (mirroring `.cli-mcp`).
   - Decorator API: add `@Tool`, `@Resource`, `@Prompt` decorators that store metadata on providers, then register them via a module hook (e.g., `$onInit`).
   - Both paths resolve to the same DI tokens so the `McpServer` sees a unified list of tools/resources/prompts at boot.

5. **Configuration & logging**
   - Extend `@Configuration` typings to include `mcp?: McpSettings`.
   - Log endpoint registration alongside other platform routes so developers can confirm `/mcp` is accessible.
   - Reuse existing Ts.ED logger + DI context behavior when MCP tool handlers execute (just as `.cli-mcp` does with `runInContext`).

## Risks / Trade-offs

- **Transport lifecycle**: `StreamableHTTPServerTransport` expects a new instance per request. We must ensure the handler creates/destroys transports promptly to avoid leaks; failure would tie up memory under load.
- **Shared DI context**: Tools run inside a DI context. Long-running or stateful handlers might block event loop; we should document expectations and consider timeouts later.
- **CLI coupling**: Moving helpers into `@tsed/mcp` means the CLI package becomes a consumer; build order must ensure there is no circular dependency.
- **Auth & rate limits**: The initial scope exposes `/mcp` without authentication. Future follow-ups may need middleware hooks for API keys or session validation.

## Migration Plan

1. Scaffold `@tsed/mcp` with baseline build/test configs.
2. Move helper implementations from `.cli-mcp` into the new package (preserving history via git mv when possible) and update `.cli-mcp` imports.
3. Implement `PlatformMcpModule`, configuration types, and HTTP handler that integrates with `@tsed/platform-http`.
4. Add decorator metadata + registrars, plus documentation and tests.
5. Validate by spinning up a sample Ts.ED app that registers a tool and successfully answers an MCP request via HTTP.

## Open Questions

- Should the default transport always expose HTTP, or should we allow disabling HTTP to run only stdio/worker transports?
- Do we need built-in authentication middleware for `/mcp` before shipping, or can that be deferred with guidance to wrap the handler?
- How should we package prompts/resources that rely on filesystem access—do we need additional configuration (e.g., workspace root) exposed via `McpSettings`?
