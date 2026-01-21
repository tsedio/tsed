# mcp-endpoint Specification

## Purpose

TBD - created by archiving change add-mcp-package. Update Purpose after archive.

## Requirements

### Requirement: @tsed/mcp package scaffold

Ts.ED SHALL publish a new workspace package `@tsed/mcp` under `packages/platform/platform-mcp` that bundles MCP helpers, depends on `@tsed/platform-http`, and exposes ESM/CJS/type entrypoints plus README/tests consistent with other platform packages. The package SHALL also surface the MCP helper implementations that currently live in `.cli-mcp` so both CLI and HTTP apps consume the same source of truth, and it MUST build its transports and definitions on top of `@modelcontextprotocol/sdk`.

#### Scenario: Package builds inside the workspace

- **WHEN** the monorepo build/test pipeline runs after adding `@tsed/mcp` to the workspace
- **THEN** the package compiles, emits types, and can be imported (e.g., `import {PlatformMcpModule} from "@tsed/mcp"`) without unresolved dependencies.

### Requirement: Platform MCP endpoint

`@tsed/mcp` SHALL provide a `PlatformMcpModule` (or equivalent) that injects `@tsed/platform-http` to register a configurable POST endpoint (default `/mcp`). The module SHALL instantiate a singleton `McpServer`, wire `StreamableHTTPServerTransport` per request, and allow Ts.ED apps on Express, Fastify, or Koa to mount the endpoint by declaring `imports: [PlatformMcpModule]` and optional `mcp` configuration (path, mode).

#### Scenario: Custom path served on Express

- **WHEN** a Ts.ED Express application imports `PlatformMcpModule` and sets `configuration.mcp.path = "/ai/mcp"`
- **THEN** issuing a `POST /ai/mcp` request delivers the payload to the shared `McpServer` via `StreamableHTTPServerTransport`, and the request is logged alongside other platform routes.

### Requirement: Functional MCP APIs

The package SHALL export functional helpers (`defineTool`, `definePrompt`, `defineResource`) that accept JsonSchema/Zod definitions, register DI tokens, and reuse the `.cli-mcp` DI-context execution model (per-call `DIContext`, structured error handling). Tools/resources/prompts registered through these helpers MUST automatically attach to the singleton `McpServer` without manual wiring.

#### Scenario: Register tool via helper

- **WHEN** a developer calls `defineTool({ name: "hello", handler })` and adds the returned provider token to a module's `providers`
- **THEN** the `McpServer` reports a `hello` tool in its metadata and the handler executes inside a Ts.ED DI context when the MCP client invokes it.

### Requirement: Decorator-based MCP registration

`@tsed/mcp` SHALL expose decorators (e.g., `@Tool`, `@Prompt`, `@Resource`) that make it possible to annotate services/controllers instead of using the functional API. Decorator metadata MUST be collected during module initialization and translated into the same provider registrations used by the functional helpers so both approaches behave identically.

#### Scenario: Annotated service registers a prompt

- **WHEN** a service method is decorated with `@Prompt({name: "ask-tsed"})` and the containing provider is loaded by Ts.ED
- **THEN** the MCP module registers the prompt with the singleton server, and MCP clients can call `ask-tsed` without additional manual wiring.
