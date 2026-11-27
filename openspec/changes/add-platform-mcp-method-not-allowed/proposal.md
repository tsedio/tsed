## Why

MCP clients probe the Streamable HTTP endpoint with `GET` (to open an event stream) and `DELETE` (to close a session). The Ts.ED MCP endpoint is stateless and only mounts `POST`, so these requests fall through to the application: they receive whatever its catch-all returns, for instance an HTML 404 page, instead of the `405 Method Not Allowed` the protocol expects from a server without event stream.

## What Changes

- Answer `GET` and `DELETE` on every mounted MCP path with `405`, an `Allow: POST` header and a JSON-RPC error body, in `PlatformMcpModule` and in the CLI Streamable HTTP server.

No breaking change: these methods were not served before.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `mcp-endpoint`: the endpoint explicitly rejects the transport methods it does not serve.

## Impact

- `packages/platform/platform-mcp`: `PlatformMcpModule` and `mcpStreamableServer`.
- `docs/docs/mcp.md` and the `tsed-mcp-server` agent skill.
