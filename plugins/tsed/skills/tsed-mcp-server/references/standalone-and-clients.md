# Standalone MCP servers and client registration

## Choose a transport

| Need                                                          | Use                                                                     |
| ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| The API is already deployed; agents reach it over the network | HTTP module: `import "@tsed/platform-mcp"` and the `mcp` configuration. |
| A local agent (Claude Code, Codex, an IDE) spawns the server  | `mcpServerConnect("stdio")`.                                            |
| A dedicated MCP process without the REST API                  | `mcpServerConnect("streamable-http")`.                                  |

Keep tools in files that import from `@tsed/platform-mcp/common` when the same definitions are used by both the HTTP application and a standalone entry point.

## `mcpServerConnect(mode)`

Exported by `@tsed/platform-mcp/cli`.

- Reads the `mcp` configuration from the loaded injector. An array throws `The MCP CLI supports a single MCP server configuration.`
- `"stdio"`: creates one server, stops the Ts.ED logger (`logger().stop()`), connects a stdio transport and returns the server.
- `"streamable-http"`: starts an Express application serving `POST /mcp` on `process.env.PORT` (default `3000`) with a new server per request. `mcp.path` and `transportOptions` are not used. `express` must be installed in the project.
- Call it only after the injector is loaded; providers resolved by the tools must exist.

## Minimal stdio script

```typescript
// src/mcp.ts
import {attachLogger, injector} from "@tsed/di";
import {$log} from "@tsed/logger";
import {mcpServerConnect} from "@tsed/platform-mcp/cli";
import {OrderTools} from "./mcp/OrderTools.js";
import {cancelOrderTool} from "./mcp/cancelOrderTool.js";

attachLogger($log);

injector().settings.set("mcp", {
  name: "orders",
  version: "1.0.0",
  tools: [OrderTools, cancelOrderTool]
});

await injector().load();
await mcpServerConnect("stdio");
```

- `attachLogger($log)` is required: the stdio helper calls `logger().stop()`, which only exists on a `@tsed/logger` instance.
- `injector().load()` builds every registered provider and runs `$onInit` hooks, so services with database connections connect here. Import only what the tools need.
- Other configuration your services read must be set the same way (`injector().settings.set(key, value)`) before `load()`; see the sibling skill `tsed-configuration`.
- Inside a project that already uses `@tsed/cli-core`, call `mcpServerConnect` from a command handler instead; the CLI bootstrap loads the injector. See the sibling skill `tsed-cli`.

## stdout discipline for stdio

The stdio transport frames JSON-RPC messages on stdout. Any other byte breaks the session.

- Do not call `console.log`, `console.info`, `process.stdout.write` or the `stdout` appender.
- Use `console.error` or `process.stderr.write` for diagnostics.
- The Ts.ED logger is stopped by the helper, so `MCP_*_ERROR` events are not printed in stdio mode. To keep logs, remove the stdout appender and restart the logger after connecting:

```typescript
import {$log} from "@tsed/logger";
import "@tsed/logger-std";

$log.appenders.clear();
$log.appenders.set("stderr", {type: "stderr"});

await mcpServerConnect("stdio");
$log.start();
```

- Check dependencies too: ORMs, dotenv banners and child processes with inherited stdio often print to stdout.
- Logging configuration belongs to the sibling skill `tsed-logger`.

## Streamable HTTP script

Replace the last line of the script above with `await mcpServerConnect("streamable-http");`. Put it behind authentication and network controls: every tool is callable by whoever reaches the port.

## Inspect manually

```bash
npx @modelcontextprotocol/inspector
```

Select `Streamable HTTP` with `http://localhost:8083/mcp` (the application's port and `mcp.path`), or `STDIO` with the command that starts the script.

Raw check of the HTTP endpoint:

```bash
curl -s http://localhost:8083/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json,text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

## Integration test over HTTP

```typescript
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import SuperTest from "supertest";
import {Server} from "../src/Server.js";

beforeEach(PlatformTest.bootstrap(Server, {adapter: PlatformExpress}));
afterEach(() => PlatformTest.reset());

it("calls get-order", async () => {
  const {body} = await SuperTest(PlatformTest.callback())
    .post("/mcp")
    .set({Accept: "application/json,text/event-stream", "Content-Type": "application/json"})
    .send({jsonrpc: "2.0", id: 1, method: "tools/call", params: {name: "get-order", arguments: {id: "42"}}})
    .expect(200);

  expect(body.result.structuredContent).toEqual({id: "42", status: "paid"});
});
```

Useful methods: `ping`, `tools/list`, `tools/call`, `resources/list`, `resources/read` (`params: {uri}`), `prompts/list`, `prompts/get` (`params: {name, arguments}`). Bootstrap options and mocking are covered by the sibling skill `tsed-testing`.

## Register in clients

### Claude Code

Project file `.mcp.json` at the repository root (shared with the team):

```json
{
  "mcpServers": {
    "orders-http": {
      "type": "http",
      "url": "http://localhost:8083/mcp"
    },
    "orders-stdio": {
      "command": "node",
      "args": ["dist/mcp.js"],
      "env": {"NODE_ENV": "production"}
    }
  }
}
```

Or from a terminal: `claude mcp add --transport http orders http://localhost:8083/mcp`.

### Codex

`~/.codex/config.toml`:

```toml
[mcp_servers.orders-stdio]
command = "node"
args = ["dist/mcp.js"]

[mcp_servers.orders-stdio.env]
NODE_ENV = "production"

[mcp_servers.orders-http]
url = "http://localhost:8083/mcp"
```

Rules for both:

- Register the compiled entry (`dist/mcp.js`) or a TypeScript runner the project already uses; do not rely on a watch-mode dev server that prints to stdout.
- Use absolute paths, or make sure the client starts the command from the project root.
- Pass secrets through `env` or the client's header options, never in the URL.
- Give each server a distinct key; with an `mcp` array, register one entry per path.
