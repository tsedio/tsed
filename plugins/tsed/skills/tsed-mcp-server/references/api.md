# @tsed/platform-mcp API reference

Live documentation: https://tsed.dev/docs/mcp.md. Where that page and this file disagree (SDK package names, error payloads), this file follows the package source.

## Entry points

| Import                      | Contents                                                                                    | Use from                         |
| --------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------- |
| `@tsed/platform-mcp`        | Decorators, `define*` helpers and `PlatformMcpModule` (mounts the HTTP endpoint).           | The HTTP application.            |
| `@tsed/platform-mcp/http`   | Same as the root entry.                                                                     | -                                |
| `@tsed/platform-mcp/cli`    | Decorators, `define*` helpers, `mcpServerConnect`, `mcpStdioServer`, `mcpStreamableServer`. | Standalone scripts and CLIs.     |
| `@tsed/platform-mcp/common` | Decorators and `define*` helpers only.                                                      | Tool files shared by both modes. |

The package depends on `@modelcontextprotocol/server` and `@modelcontextprotocol/node` (MCP SDK v2). Import SDK types such as `CallToolResult`, `ServerContext` or `ResourceTemplate` from `@modelcontextprotocol/server`.

## `mcp` configuration (`PlatformMcpSettings`)

| Key                                           | Default                                                     | Effect                                                                  |
| --------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- |
| `path`                                        | `"/mcp"`                                                    | Route of the `POST` endpoint (HTTP module only).                        |
| `enabled`                                     | `true`                                                      | `false` leaves the endpoint unmounted.                                  |
| `name`                                        | root `name` configuration, then `tsed-mcp`                  | Server name advertised to clients.                                      |
| `version`                                     | root `version` configuration, then `0.0.0`                  | Server version advertised to clients.                                   |
| `title`, `description`, `websiteUrl`, `icons` | -                                                           | Optional server metadata.                                               |
| `tools`, `resources`, `prompts`               | `[]`                                                        | Decorated classes and `define*` tokens exposed by this server.          |
| `serverOptions`                               | -                                                           | Passed to the SDK `McpServer` constructor (capabilities, instructions). |
| `transportOptions`                            | `{sessionIdGenerator: undefined, enableJsonResponse: true}` | Merged into the Streamable HTTP transport options (HTTP module only).   |

`mcp` accepts one object or an array of objects. Each array entry is an independent server with its own path and provider lists. The standalone `mcpServerConnect` accepts one object only.

## Tools

### `@Tool(name?, options?)`

Method decorator on an `@Injectable()` class.

| Source                                                  | Becomes                                                 |
| ------------------------------------------------------- | ------------------------------------------------------- |
| `name` argument, else method name                       | Tool name.                                              |
| `@Description()` on the method                          | Tool description (unless `options.description` is set). |
| Class type of the first parameter                       | `inputSchema` (unless `options.inputSchema` is set).    |
| `@Returns(200, Model)`                                  | `outputSchema` (unless `options.outputSchema` is set).  |
| `options.title`, `options.annotations`, `options._meta` | Passed through to the MCP tool definition.              |

The handler receives `(input, ctx)`: `input` is deserialized into an instance of the parameter class (property aliases declared with `@Name` are honoured); `ctx` is the SDK `ServerContext`.

### `defineTool(options)`

| Option                                         | Type                                                                | Notes                                             |
| ---------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------- |
| `name`                                         | `string`                                                            | Required and unique.                              |
| `title`, `description`, `annotations`, `_meta` | -                                                                   | MCP tool metadata.                                |
| `inputSchema`                                  | `s.object({...})`, `() => JsonSchema`, or a raw JSON schema         | Optional. Use the lazy form for circular imports. |
| `outputSchema`                                 | `s.object({...})`, `s.generic(Model).of(Other)`, or raw JSON schema | Optional.                                         |
| `handler`                                      | `(args, ctx) => result`                                             | Runs in the current DI context.                   |

Returns a DI token (`TokenProvider`).

### Result mapping

- An object that has `content` or `structuredContent` is returned unchanged.
- Any other object is serialized with `@tsed/json-mapper` (aliases on, group `tools`) and returned as `{content: [{type: "text", text: <JSON>}], structuredContent: <object>}`.
- A non-object value (string, number) is returned as JSON text content only.
- Schemas are compiled with the groups `[<tool name>, "tools"]`, so `@Groups("tools")` or `@Groups("!tools")` on model properties control what an MCP client sees.

## Resources

```typescript
import {Injectable} from "@tsed/di";
import {Resource} from "@tsed/platform-mcp";

@Injectable()
export class DocsResources {
  @Resource("app://docs/readme", {name: "readme", title: "Readme", mimeType: "text/markdown"})
  readme() {
    return {contents: [{uri: "app://docs/readme", mimeType: "text/markdown", text: "# Orders API"}]};
  }
}
```

```typescript
import {defineResource} from "@tsed/platform-mcp";

export const statusResource = defineResource({
  name: "status",
  uri: "app://status",
  description: "Current service status",
  handler() {
    return {state: "ok"}; // plain object: served as application/json text
  }
});
```

- `@Resource(uriOrTemplate, options?)`: a string registers a fixed URI; a `ResourceTemplate` instance (from `@modelcontextprotocol/server`) registers a URI template. `options` are the SDK resource metadata (`name`, `title`, `description`, `mimeType`, ...). The name defaults to the method name.
- `defineResource({name, uri | template, handler, ...metadata})`.
- The handler receives the SDK read callback arguments (the requested `URL` first; template variables second for templates).
- A result with `contents` is returned unchanged; another object is serialized (group `resources`) into one `application/json` content.

## Prompts

```typescript
import {Injectable} from "@tsed/di";
import {Prompt} from "@tsed/platform-mcp";
import {s} from "@tsed/schema";

@Injectable()
export class SupportPrompts {
  @Prompt({
    name: "triage-order",
    title: "Triage an order issue",
    description: "Builds the triage instructions for one order",
    argsSchema: s.object({orderId: s.string().required()})
  })
  triage({orderId}: {orderId: string}) {
    return {messages: [{role: "user" as const, content: {type: "text" as const, text: `Triage order ${orderId}`}}]};
  }
}
```

- `@Prompt(options?)`: `name` (default: method name), `title`, `description`, `argsSchema`. The arguments schema is not inferred from the parameter type.
- `definePrompt({name, title?, description?, argsSchema?, handler})`; the handler receives `(args, ctx)`, or `(ctx)` when there is no `argsSchema`.
- Return a `GetPromptResult` (`{messages: [...]}`).

## Error payloads

Errors thrown by a handler are caught. `KIND` is `TOOL`, `RESOURCE` or `PROMPT`.

`code` = `E_MCP_<KIND>_<CONSTANT_CASE(error.name)>` when the error has both `name` and `status`; else `E_MCP_<KIND>_ERROR`.

Tool (logged on the application logger as `MCP_TOOL_ERROR`):

```json
{
  "isError": true,
  "content": [{"type": "text", "text": "{ ...same object as structuredContent, as JSON... }"}],
  "structuredContent": {"status_code": 404, "code": "E_MCP_TOOL_NOT_FOUND", "message": "Order not found", "tool": "get-order"}
}
```

Resource (logged on the request logger as `MCP_RESOURCE_ERROR`):

```json
{
  "contents": [
    {"uri": "app://status", "mimeType": "text/plain", "text": "Order not found"},
    {"uri": "app://status", "mimeType": "application/json", "text": "{ status_code, code, error_name, message, request_id, resource }"}
  ]
}
```

Prompt (logged on the request logger as `MCP_PROMPT_ERROR`):

```json
{
  "description": "<error message>",
  "messages": [],
  "_meta": {
    "status_code": 400,
    "code": "E_MCP_PROMPT_BAD_REQUEST",
    "message": "<error message>",
    "request_id": "...",
    "prompt": "triage-order"
  }
}
```

Consequences:

- The error `message` reaches the client and the model. Do not put secrets or stack traces in it.
- `status_code` is absent when the error has no `status`.
- Input that does not match `inputSchema` never reaches the handler; the SDK answers with an `Input validation error` tool result.

## Handler context

- Handlers run inside a Ts.ED `DIContext`: `inject()`, `context()` and request-scoped logging (`context().logger`) work. See the sibling skills `tsed-di` and `tsed-logger`.
- The current definition and arguments are stored on the context: `context().get("mcp")` and `context().get("mcp_args")`.
- Over HTTP the context is the request's `PlatformContext`, so `context().request.headers` is available for authorization decisions.
