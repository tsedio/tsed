## Why

The MCP authorization spec asks servers to include a `scope` parameter in the `WWW-Authenticate` challenge, and clients to use it in priority when they build their authorization request. The Ts.ED MCP endpoint only sends `scope` when `auth.requiredScopes` is set. An endpoint that advertises `scopesSupported` without enforcing any scope therefore sends a challenge without `scope`, and clients that do not fall back to the protected resource metadata request no scope at all.

## What Changes

- The `401`/`403` challenge of a protected MCP endpoint carries `scope`: `auth.requiredScopes` when set, otherwise `auth.scopesSupported`.
- Token verification is unchanged: only `requiredScopes` is enforced.

No breaking change: compliant clients already request `scopes_supported` when the challenge has no `scope`.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `mcp-endpoint-auth`: the bearer challenge advertises the scopes to request.

## Impact

- `packages/platform/platform-mcp`: `PlatformMcpAuthService.verifyMcpRequest`.
- `docs/docs/mcp.md` and the `tsed-mcp-server` agent skill.
