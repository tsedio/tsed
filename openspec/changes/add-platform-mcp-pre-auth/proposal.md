## Why

An MCP endpoint may need an authentication method that is not OAuth, typically an API key checked against an application service. Today this has to be a global middleware that recognizes its endpoint by testing the request path: its result never reaches the MCP handlers, it cannot be combined with the OAuth verification of the same endpoint, and it silently applies to every MCP endpoint mounted under the same prefix.

## What Changes

- Add `auth.preAuth` to the MCP configuration: a custom authentication check, declared per endpoint, that runs before the OAuth verification.
- Allow `auth` to declare `preAuth` alone, without `issuer` and `resource`, for endpoints that are not protected by OAuth.
- When both `preAuth` and an issuer are declared, accept either method on the endpoint: an identity returned by the check skips the OAuth verification, otherwise the request follows the OAuth flow.
- Expose the identity returned by the check to handlers and to the upstream placeholders, like an OAuth identity.

No breaking change: configurations without `preAuth` behave as before.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `mcp-endpoint-auth`: adds the custom pre-authentication check and makes the OAuth settings optional when only a custom check is declared.

## Impact

- `packages/platform/platform-mcp`: new `PlatformMcpPreAuth` contract and `auth.preAuth` option, `PlatformMcpAuthService.preAuth()`, dispatch and validation in `PlatformMcpModule`.
- `docs/docs/mcp.md` and the `tsed-mcp-server` agent skill.

## Non-goals

- Running the check in the CLI servers, which have no HTTP authentication.
- Chaining several custom checks; one check can delegate to others.
