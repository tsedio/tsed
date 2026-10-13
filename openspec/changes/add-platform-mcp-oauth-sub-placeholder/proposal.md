## Why

A gateway can forward the token, the client id and the scopes of the caller to its upstream, but not the identity of the end user. A `stdio` upstream that keeps a state per user (a profile, a catalog, a cache) has no way to tell two users apart: `${OAUTH_CLIENT_ID}` identifies the MCP client application, and parsing `${OAUTH_TOKEN}` only works with JWT access tokens.

## What Changes

- New `${OAUTH_SUB}` placeholder, replaced with the `sub` claim of the caller in the `headers` of an `http` or `sse` upstream and in the `args` and `env` of a `stdio` upstream.
- The value is read from `AuthInfo.extra.sub`, which the built-in verifier already fills with the token claims in both `offline` and `introspection` modes. A `preAuth` check or a custom `verifier` provides it the same way.
- A missing or non-string subject is replaced with an empty value, like the other placeholders.

No breaking change: `${OAUTH_SUB}` was left untouched in upstream definitions until now.

## Capabilities

### New Capabilities

<!-- none -->

### Modified Capabilities

- `mcp-gateway`: the caller subject can be interpolated in the upstream definition.

## Impact

- `packages/platform/platform-mcp`: `resolveUpstream`, and the connection pool keys that derive from the interpolated values (one upstream connection per subject when the placeholder is used).
- `docs/docs/mcp.md` and the `tsed-mcp-server` agent skill.
