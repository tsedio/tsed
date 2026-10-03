---
name: tsed-mcp-server
description: Expose Model Context Protocol (MCP) tools, resources and prompts from a Ts.ED v8 application with @tsed/platform-mcp, over the application's HTTP endpoint or as a standalone stdio / Streamable HTTP server. Use when adding @tsed/platform-mcp, the `mcp` configuration, @Tool, @Resource, @Prompt, defineTool, defineResource, definePrompt or mcpServerConnect, when a tool is missing from tools/list, when a client receives E_MCP_TOOL_ERROR or another E_MCP_* payload, or when registering the server in Claude Code (.mcp.json) or Codex (config.toml). Not for the Ts.ED CLI's own MCP server (see tsed-cli).
---

# Ts.ED MCP Server

`@tsed/platform-mcp` turns Ts.ED providers into MCP tools, resources and prompts. Handlers run inside the Ts.ED injector, so they reuse the application's services.

Read [the API reference](references/api.md) for option tables, resources, prompts and error payloads, and [the standalone and clients reference](references/standalone-and-clients.md) for stdio servers and client registration. This skill is about the MCP server your application exposes; the MCP server shipped by the Ts.ED CLI belongs to the sibling skill `tsed-cli`.

## 1. Install and mount the endpoint

Run `npm install @tsed/platform-mcp`, then import it in `Server.ts`:

```typescript
import "@tsed/platform-express";
import "@tsed/platform-mcp";
import {Configuration} from "@tsed/di";
import {OrderTools} from "./mcp/OrderTools.js";
import {docsResource} from "./mcp/docsResource.js";

@Configuration({
  mcp: {
    path: "/mcp",
    name: "orders",
    version: "1.0.0",
    tools: [OrderTools],
    resources: [docsResource]
  }
})
export class Server {}
```

1. The side-effect import registers the module; without it no route is mounted.
2. The module mounts `POST <path>` (default `/mcp`). The transport is stateless: a new MCP server is created per request.
3. `name` and `version` fall back to the root `name` / `version` configuration, then to `tsed-mcp` / `0.0.0`.
4. Set `enabled: false` to skip an endpoint; use an array (`mcp: [{name, path, tools}, ...]`) to expose several independent servers.

## 2. Register every provider explicitly

A decorator or a `define*` call alone exposes nothing. List each decorated class and each `define*` token in the `tools`, `resources` or `prompts` array of every server that should expose it. A class contributes all of its decorated methods of that kind.

## 3. Write a tool with decorators

```typescript
import {Injectable, inject} from "@tsed/di";
import {Tool} from "@tsed/platform-mcp";
import {Description, Property, Required, Returns} from "@tsed/schema";
import {OrdersService} from "../services/OrdersService.js";

class GetOrderInput {
  @Required()
  @Description("Order identifier")
  id: string;
}

class OrderResult {
  @Property()
  status: string;
}

@Injectable()
export class OrderTools {
  protected orders = inject(OrdersService);

  @Tool("get-order")
  @Description("Returns one order by id")
  @Returns(200, OrderResult)
  async getOrder(input: GetOrderInput) {
    return this.orders.get(input.id);
  }
}
```

1. The input schema comes from the **class** type of the first parameter. Interfaces and inline object types produce no schema.
2. The output schema comes from `@Returns(200, Model)`. Omit it and no `outputSchema` is advertised.
3. The description comes from `@Description`; the name from `@Tool(name)` or the method name. Pass `title`, `annotations` or explicit schemas as `@Tool(name, {...})`.
4. Return a plain object or model: Ts.ED serializes it into both `content` (JSON text) and `structuredContent`. Return a full MCP result (`{content: [...]}`) only for custom content.
5. Write model and parameter descriptions for an LLM reader: they are the tool's only documentation. Model decorators are covered by the sibling skill `tsed-models`.

## 4. Write a tool with the functional API

```typescript
import {inject} from "@tsed/di";
import {defineTool} from "@tsed/platform-mcp";
import {s} from "@tsed/schema";
import {OrdersService} from "../services/OrdersService.js";

export const cancelOrderTool = defineTool({
  name: "cancel-order",
  description: "Cancels an order that is not shipped yet",
  inputSchema: s.object({id: s.string().required().description("Order identifier")}),
  outputSchema: s.object({status: s.string().required()}),
  async handler({id}) {
    return {status: await inject(OrdersService).cancel(id)};
  }
});
```

- `defineTool` returns a DI token; add it to `mcp.tools`. Call `inject()` inside the handler, not at module top level.
- Resources (`@Resource` / `defineResource`) and prompts (`@Prompt` / `definePrompt`) follow the same two styles; see the reference.

## 5. Handle errors

- Handlers never throw to the transport. A thrown error is logged (`MCP_TOOL_ERROR`, `MCP_RESOURCE_ERROR`, `MCP_PROMPT_ERROR`) and converted to a payload.
- A tool error returns `isError: true` with `structuredContent: {status_code, code, message, tool}`.
- `code` is `E_MCP_<KIND>_<ERROR_NAME>` when the error has both `name` and `status` (any `@tsed/exceptions` class, e.g. `NotFound` gives `E_MCP_TOOL_NOT_FOUND`); otherwise `E_MCP_<KIND>_ERROR`.
- Throw `@tsed/exceptions` errors (sibling skill `tsed-exceptions`) with messages safe to show to a model; the message is returned verbatim. Arguments that violate the input schema are rejected by the MCP SDK before the handler runs.

## 6. Run a standalone server

Use `mcpServerConnect("stdio" | "streamable-http")` from `@tsed/platform-mcp/cli` once the injector is loaded. It reads a single `mcp` configuration object (an array throws). Full scripts are in [the reference](references/standalone-and-clients.md).

- With `stdio`, stdout belongs to the protocol. Never call `console.log`; send diagnostics to stderr. The helper stops the Ts.ED logger before connecting.
- `streamable-http` serves `POST /mcp` on `PORT` (default `3000`), ignores `mcp.path`, and needs `express` installed.

## 7. Test

Unit-test a tool through its token, inside `PlatformTest.create()` / `PlatformTest.reset()` (from `@tsed/platform-http/testing`):

```typescript
const tool = inject<any>(cancelOrderTool);
const result = await tool.handler({id: "42"}, {} as any);

expect(result.structuredContent).toEqual({status: "cancelled"});
```

A failing handler resolves with `result.isError === true`; it does not reject. For an end-to-end check, bootstrap with `PlatformTest.bootstrap(Server)` and `POST /mcp` a JSON-RPC body with SuperTest (full example in the reference). Mocking services follows the sibling skill `tsed-testing`.

## 8. Register the server in a client

Add the HTTP endpoint (`{"type": "http", "url": "http://localhost:8083/mcp"}`) or the stdio command to `.mcp.json` under `mcpServers` for Claude Code, or to a `[mcp_servers.<name>]` table in Codex `config.toml`. Exact snippets are in [the reference](references/standalone-and-clients.md#register-in-clients).

## Do not

- Do not expect `@Tool`, `@Resource` or `@Prompt` to auto-register; list the class in the `mcp` configuration.
- Do not reuse a tool, resource or prompt name: the DI token is derived from the name (`MCP:TOOL:<name>`), so two definitions collide.
- Do not write to stdout in a stdio server, including from child processes and third-party loggers.
- Do not leave the HTTP endpoint unauthenticated: tools run with the application's privileges. Guard the path with a middleware (sibling skill `tsed-middlewares`).
- Do not import from `@tsed/common` or from `@modelcontextprotocol/sdk`; the package uses `@modelcontextprotocol/server` and `@modelcontextprotocol/node`.

## Pitfalls

- Tool missing from `tools/list`: the class or token is not in `mcp.tools` of that server, `@tsed/platform-mcp` is not imported, or the class lacks `@Injectable()`.
- Empty input schema: the parameter type is an interface, or its properties have no `@tsed/schema` decorator.
- A class-based `@Prompt` gets no arguments schema from its parameter; pass `argsSchema` in the decorator options.
- Only `POST <path>` is mounted and the transport is stateless with JSON responses. Clients that require sessions or a `GET` event stream are not served by the HTTP module.
- In a standalone script, `mcpServerConnect("stdio")` fails with `logger(...).stop is not a function` unless a `@tsed/logger` instance is attached to the injector (`attachLogger($log)`).

## Checklist

- `@tsed/platform-mcp` is imported and every tool, resource and prompt is listed in `mcp`.
- Each tool has a name, an LLM-readable description, a class or `s.object` input schema, and an output schema.
- Handlers resolve services with `inject()` and throw `@tsed/exceptions` errors.
- A test calls each tool handler, including one failing path.
- The endpoint is protected, or bound to a trusted network.
- stdio entry points print nothing on stdout; the client configuration was tried with `npx @modelcontextprotocol/inspector`.

Further reading: https://tsed.dev/docs/mcp.md.
