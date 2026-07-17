## Why

`@tsed/platform-mcp` currently depends on the v1 monolithic MCP TypeScript SDK. The SDK v2 splits server runtime functionality and Node HTTP transports into dedicated packages, so the package must migrate before v1 support is retired.

## What Changes

- Replace `@modelcontextprotocol/sdk` with the v2 server and Node transport packages.
- Update MCP server, schema, callback-context, and Streamable HTTP transport imports.
- Preserve the existing stateless `POST /mcp` endpoint and tool, prompt, and resource registrations.
- Update unit and integration coverage to use the v2 transport.

## Capabilities

### Modified Capabilities

- `mcp-endpoint`: The endpoint uses the MCP SDK v2 server package and Node Streamable HTTP transport.

## Impact

- Affected package: `@tsed/platform-mcp`.
- Runtime dependency change: SDK v1 is removed; v2 server and Node packages are added.
- The public callback context type changes from the removed `RequestHandlerExtra` to v2 `ServerContext`.
