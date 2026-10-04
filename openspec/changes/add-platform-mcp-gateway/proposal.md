## Why

Third-party MCP servers ship with heterogeneous transports and authentication: stdio-only servers, legacy SSE servers, Streamable HTTP servers protected by a static bearer token, or servers that implement their own OAuth. Directus is a concrete example: Directus 11 exposes an MCP endpoint that accepts a bearer JWT (which an application can map to its own OIDC identities), while Directus 12 implements its own OAuth and no longer delegates to a third-party authorization server.

Applications that already run their own OIDC provider need a single, uniform way to expose these servers to MCP clients: Streamable HTTP, protected by the application's authorization server, with consent handled there. Today `@tsed/platform-mcp` can only expose tools, resources and prompts declared locally, and it has no notion of OAuth on the MCP endpoint.

## What Changes

- Add a **gateway** capability to `@tsed/platform-mcp`: each `configuration.mcp` entry can declare an `upstream` (a third-party MCP server reached over Streamable HTTP, legacy SSE or stdio). The gateway connects to it with the MCP client, discovers its tools, resources and prompts, and re-exposes them on the Ts.ED Streamable HTTP endpoint, optionally namespaced, filtered, and mixed with locally declared tools.
- Add **OAuth protection per MCP endpoint**: each `configuration.mcp` entry can declare an `auth` block describing the authorization server (OIDC issuer) that protects it. The module then serves the RFC 9728 protected resource metadata for that endpoint, answers unauthenticated requests with a `401` + `WWW-Authenticate` challenge pointing to this metadata, verifies bearer tokens against the authorization server, offline (JWKS) or by introspection, or through a custom verifier, and forwards the resulting `AuthInfo` to MCP handlers. Client registration (including Client ID Metadata Documents) and consent stay on the authorization server.
- Add declarative forwarding of the caller's OIDC token to the upstream by interpolating `${OAUTH_TOKEN}` in its `headers` (HTTP/SSE) or its `args`/`env` (stdio).
- Expose the upstream from the CLI Streamable HTTP server (`mcpStreamableServer`) as well.
- Add `@modelcontextprotocol/client` and `oauth4webapi` as dependencies of `@tsed/platform-mcp`.
- Document the gateway and the OAuth configuration in `docs/docs/mcp.md`.

No breaking change: entries without `upstream` and without `auth` behave exactly as today.

## Capabilities

### New Capabilities

- `mcp-gateway`: declaring an upstream MCP server on a Ts.ED MCP endpoint and proxying its tools, resources and prompts.
- `mcp-endpoint-auth`: OAuth 2.1 resource-server behavior for Ts.ED MCP endpoints (protected resource metadata, bearer challenge, token verification, auth propagation).

### Modified Capabilities

<!-- none: the existing `mcp-endpoint` requirements are unchanged -->

## Impact

- `packages/platform/platform-mcp`: new settings (`upstream`, `auth`), new gateway and auth services, `PlatformMcpModule` registers extra routes and enforces auth before dispatch.
- New runtime dependencies: `@modelcontextprotocol/client` (>= 2.0.0) and `oauth4webapi` (>= 3.0.0), both loaded lazily.
- `docs/docs/mcp.md`: new "Gateway" and "OAuth" sections.
- Express, Fastify and Koa integration tests gain gateway and auth coverage.

## Non-goals

- Implementing an authorization server. The authorization server (for instance `@tsed/oidc-provider`) owns client registration, CIMD resolution, consent and token issuance.
- Acting as an interactive OAuth client toward an upstream on behalf of each end user (per-user upstream consent and token vault).
- Forwarding server-initiated requests from the upstream (sampling, elicitation, roots) and resource subscriptions.
- A transparent byte-level HTTP reverse proxy mode.
- Serving or proxying authorization server metadata on the MCP origin.
- Several upstreams behind a single endpoint.
- `upstream` support in the CLI stdio server (`mcpStdioServer`), and OAuth on the CLI HTTP server.
