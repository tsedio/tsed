## Why

The CLI MCP factory still loads provider tokens from legacy root-level settings and differs from the HTTP factory that now owns the current registration behavior. Aligning the lookup makes common MCP definitions reusable by the CLI without importing `@tsed/platform-http`.

## What Changes

- Load CLI tools, prompts, and resources from the `mcp` settings object.
- Merge explicitly configured tokens with providers registered by MCP type.
- Preserve usable fallback names for token-backed resources and prompts.
- Keep CLI stdio and Streamable HTTP connection behavior unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `mcp-endpoint`: CLI MCP server registration uses the same provider-loading configuration contract as the HTTP server.

## Impact

- Affected code: `packages/platform/platform-mcp/src/cli/services/McpServerFactory.ts` and its tests.
- No new dependencies or public transport API changes.
