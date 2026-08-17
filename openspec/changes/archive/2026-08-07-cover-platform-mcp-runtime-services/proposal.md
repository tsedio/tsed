## Why

The runtime services introduced by the MCP split are not all covered by unit tests. Coverage is needed for server registration and CLI transport selection so regressions are caught without running a real MCP endpoint.

## What Changes

- Add unit tests for the common MCP server factory.
- Add unit tests for CLI server connection mode selection.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `mcp-endpoint`: MCP server registration and CLI connection selection are verified by unit tests.

## Impact

- Affected code: runtime service spec files under `packages/platform/platform-mcp/src/common` and `src/cli`.
- No production API or dependency changes.
