## Context

`PlatformMcpModule` mounts one `POST` route per `configuration.mcp` entry. Each request builds a fresh `McpServer` from the resolved local tools, resources and prompts, connects a stateless `NodeStreamableHTTPServerTransport` (`sessionIdGenerator: undefined`, JSON responses by default) and closes it when the response ends. There is no authentication in the package: applications protect the path with their own middlewares.

MCP SDK v2 already provides the pieces needed on both sides:

- `@modelcontextprotocol/server` exports resource-server helpers: `verifyBearerToken`, `bearerAuthChallengeResponse`, `buildOAuthProtectedResourceMetadata`, `getOAuthProtectedResourceMetadataUrl`, and the `OAuthTokenVerifier` contract.
- `NodeStreamableHTTPServerTransport.handleRequest(req, res, body)` reads `req.auth` and passes it to handlers as `authInfo`.
- `@modelcontextprotocol/client` (not yet a dependency) provides `Client` and the Streamable HTTP, SSE and stdio client transports.

## Goals / Non-Goals

**Goals:**

- Expose one or several third-party MCP servers through a Ts.ED MCP endpoint, as Streamable HTTP, whatever the upstream transport is.
- Protect each MCP endpoint with the application's authorization server, with everything an MCP client needs to discover it published per endpoint.
- Keep existing endpoints (no `upstream`, no `auth`) byte-for-byte compatible.

**Non-Goals:** see `proposal.md`.

## Configuration shape

```ts
@Configuration({
  mcp: [
    {
      path: "/mcp/directus",
      auth: {
        issuer: "https://auth.example.com", // authorization server (OIDC)
        resource: "https://api.example.com/mcp/directus", // optional, derived from the request by default
        scopesSupported: ["mcp:read", "mcp:write"],
        requiredScopes: ["mcp:read"],
        resourceName: "Directus MCP",
        clientId: "mcp-gateway", // with clientSecret: introspection; without: offline JWKS verification
        clientSecret: process.env.MCP_GATEWAY_SECRET
      },
      upstream: {
        type: "http",
        url: "https://directus.example.com/mcp",
        headers: {Authorization: "Bearer ${OAUTH_TOKEN}"}, // interpolated per caller
        prefix: "directus_", // optional, no prefix by default
        tools: {exclude: ["delete_item"]} // optional
      },
      tools: [LocalTool] // local declarations still work on the same endpoint
    },
    {
      path: "/mcp/files",
      upstream: {type: "stdio", command: "npx", args: ["-y", "some-mcp-server", "--token", "${OAUTH_TOKEN}"]}
    }
  ]
})
```

## Decisions

### D1 — MCP-aware gateway, not an HTTP reverse proxy

The gateway terminates MCP on both sides: an MCP `Client` toward each upstream, the existing `McpServer` toward callers. This is what makes stdio and SSE upstreams reachable over Streamable HTTP, and it allows prefixing, filtering, and mixing with local tools. A raw HTTP proxy cannot do any of that and was rejected.

### D2 — Upstream entries are registered on the per-request `McpServer`

For each request, after local registrations, the gateway registers every tool, resource, resource template and prompt of the upstream catalog on the `McpServer`, with a handler that forwards to the upstream client (`callTool`, `readResource`, `getPrompt`). Upstream JSON Schemas are passed through `fromJsonSchema()`, like local Ts.ED schemas.

Alternative considered: overriding the low-level `tools/list` / `tools/call` request handlers to merge and route manually. Rejected because it duplicates what `McpServer` already does (listing, validation, error shaping) and diverges from the local path.

Consequence: `createMcpServer` stays synchronous and unchanged; a new async step (`attachUpstream(server, settings, authInfo)`) runs between creation and `server.connect()`.

### D3 — One upstream per endpoint, naming and collisions

Each `configuration.mcp` entry accepts a single `upstream`. Aggregating several third-party servers behind one endpoint is not supported: each upstream gets its own entry, path and `auth`. This keeps the configuration flat and removes cross-upstream collision rules.

- Tools and prompts are exposed as `${prefix}${name}`; `prefix` is optional and empty by default.
- Resources keep their upstream URI (rewriting URIs would break links embedded in upstream content).
- A collision with a local declaration is logged and the upstream entry is skipped; the local declaration wins.

### D4 — Upstream connection lifecycle

A `McpGatewayService` (singleton) owns upstream clients, pooled per upstream by a hash of its interpolated values (`headers`, or `args` + `env`):

- An upstream without placeholder always resolves to the same values: one client, connected lazily on first use, kept alive, closed in `$onDestroy`.
- An upstream with placeholders gets one connection per caller identity — one **process** per identity for `stdio` — bounded by `pool: {max, idleTimeout}` with least-recently-used eviction.

A connection serving a request is never evicted (the pool may temporarily exceed `max`), so long-running tool calls are not cut by idle or LRU eviction. Each connection caches its catalog, with schemas compiled once per catalog rather than per request, and refreshes it on `list_changed` notifications and after a reconnect. A failing upstream does not take the endpoint down: its entries are absent from listings, the failure is logged, and connection is retried on a later request with backoff.

### D5 — OAuth is opt-in per endpoint and resource-server only

When an entry has `auth`, the module:

1. Registers `GET /.well-known/oauth-protected-resource{path}` (RFC 9728 path-suffixed form) returning metadata built with the SDK `buildOAuthProtectedResourceMetadata` (which also validates the issuer URL: HTTPS outside localhost, checked at startup): `resource`, `authorization_servers: [issuer]`, `scopes_supported`, `resource_name`, `resource_documentation`.
2. Before dispatch, calls `verifyBearerToken(req.headers.authorization, {verifier, requiredScopes, resourceMetadataUrl})`. On failure it answers with the status and `WWW-Authenticate: Bearer resource_metadata="..."` header produced by `bearerAuthChallengeResponse` (`401` for missing/invalid token, `403` for insufficient scope).
3. On success, sets `req.auth = authInfo` so the transport exposes it to local handlers, and uses it to interpolate the upstream placeholders.

The gateway never issues tokens, never registers clients and never renders consent. MCP clients follow the metadata to the configured authorization server, where registration (DCR or Client ID Metadata Documents) and consent happen. CIMD support is therefore a property of the authorization server (`client_id_metadata_document_supported` in its metadata); the gateway only has to point at it.

`resource` defaults to `${protocol}://${host}${path}` computed from the request; it must be set explicitly when the app runs behind a proxy that rewrites the host or path.

### D6 — Token verification: offline or introspection, built in

The endpoint verifies tokens against the configured `issuer`, in one of two modes:

- **`offline`**: the JWT access token (RFC 9068, `typ: at+jwt`) is validated locally with the issuer JWKS, together with issuer, audience and expiration. No call to the authorization server per request; revocation only applies at expiration.
- **`introspection`**: the authorization server is asked for each token (RFC 7662) with the endpoint's `clientId` / `clientSecret` (HTTP Basic). Works with opaque tokens and honors revocation; results are cached for `cacheTtl` seconds (default 60), never past the token expiration.

Discovery, JWT validation and introspection are delegated to `oauth4webapi` (the low-level OAuth client by the author of `oidc-provider`) rather than hand-written; only the result cache and the mapping to `AuthInfo` are ours. A non-HTTPS issuer is refused unless `allowInsecureRequests` is set (local development).

`mode` defaults to `introspection` when `clientId` is set, `offline` otherwise. `jwks_uri` and `introspection_endpoint` are discovered once per endpoint from `<issuer>/.well-known/openid-configuration`, then RFC 8414, and can be overridden with `jwksUri` / `introspectionEndpoint`.

The expected audience is the endpoint `resource` (override with `audience`). One of them must be configured for the built-in modes — startup error otherwise — because a `resource` derived from the request would let the caller choose the expected audience through the `Host` header. The audience is checked in both modes: a token whose `aud` (JWT claim or introspection response) is missing or does not contain it is rejected. `audience: false` disables the check in introspection mode only, for authorization servers that report no audience; it logs a warning at startup. It is refused in offline mode: a locally validated JWT must always be bound to the resource.

Failures of the authorization server (metadata, JWKS or introspection unreachable) are answered `500 server_error`, never as an invalid token, so clients do not start a new authorization flow because of an outage.

`auth.verifier` remains available to replace the built-in modes: an `OAuthTokenVerifier` instance or a DI token resolving to one. The SDK rejects tokens without `expiresAt`; any non-OAuth error thrown by a custom verifier is answered as `401 invalid_token` without leaking its message.

### D7 — Caller identity forwarded by interpolation

Forwarding is declarative and uses placeholders in the upstream definition: `${OAUTH_TOKEN}`, `${OAUTH_CLIENT_ID}`, `${OAUTH_SCOPES}`. They are replaced per request with the verified `AuthInfo`:

- in `headers` values for `http` and `sse` upstreams (`headers: {Authorization: "Bearer ${OAUTH_TOKEN}"}`, or any other header);
- in `args` and `env` values for `stdio` upstreams. `env` is included because most `npx` servers read credentials from the environment, and arguments are visible in the process list.

Unknown placeholders are left untouched. A placeholder on an entry without `auth` is a startup error. The token is never forwarded implicitly: the MCP authorization spec discourages token passthrough because the token's audience is the gateway, so forwarding is always an explicit choice in the configuration.

Alternatives considered: a `forwardToken` option and function/DI header resolvers. Rejected in favor of a single interpolation mechanism that works identically for HTTP headers and stdio arguments.

### D8 — Protocol features forwarded

Forwarded: `tools/list`, `tools/call`, `resources/list`, `resources/templates/list`, `resources/read`, `prompts/list`, `prompts/get`, cancellation (abort signal), and progress notifications when the endpoint is configured with `transportOptions.enableJsonResponse: false`.

Not forwarded in this change: sampling, elicitation, roots, resource subscriptions, completions, logging level.

### D9 — Packaging

Gateway code lives under `src/common/gateway/` so it is usable by both the HTTP module and the CLI servers; the auth code is HTTP-only and lives under `src/http/`. `@modelcontextprotocol/client` is added to `dependencies` and imported lazily (dynamic `import()`), so applications that do not declare `upstream` never load it. The stdio client transport is only imported for `type: "stdio"`.

## Risks / Trade-offs

- **Per-request registration cost** with large upstream catalogs → the catalog is cached per connection; registration is in-memory only. Measure in integration tests; fall back to low-level handlers (D2 alternative) if it shows up.
- **Per-identity pool growth** → bounded by `pool.max` with idle eviction. For `stdio` upstreams with placeholders this is one process per token, and idle eviction only runs when the upstream is used.
- **stdio upstreams without placeholder are shared by all callers** → no per-user isolation; `auth.requiredScopes` is the only gate.
- **Tokens in process arguments** are visible to other users of the host → documented, `env` recommended.
- **Token passthrough misuse** → never implicit; requires an explicit placeholder.
- **Derived `resource` behind proxies** → wrong metadata URL breaks client discovery; documented, explicit `resource` recommended in production.
- **Upstream schema quirks** (invalid JSON Schema) → the entry cannot be registered; it is skipped with a warning instead of failing the request.

## Known limitations

- A call to an upstream tool while the upstream is down answers "tool not found" rather than "upstream unavailable"; the error is logged on every request during the backoff.
- Idle eviction only runs when the upstream is used; there is no background timer.
- No integration test on Koa, nor against a real OIDC provider or a real MCP client; CLI upstream support is covered by unit tests only.

## Resolved questions

- **Upstream identity (Directus 12)**: handled by `${OAUTH_TOKEN}` interpolation; no OAuth-client role or token vault in the gateway.
- **Several upstreams per endpoint**: not needed; one `upstream` per entry.
- **Authorization server metadata on the MCP origin**: not served. The MCP URL always differs from the authorization server; clients must follow the protected resource metadata.
- **CLI servers**: `mcpStreamableServer` exposes the upstream; `mcpStdioServer` ignores it with a warning. The CLI HTTP endpoint has no OAuth, so `${OAUTH_*}` placeholders are rejected there.
- **stdio upstreams**: required (MCP servers installed through `npx`), covered by `upstream.type: "stdio"`, with interpolation on `args` and `env`.
- **Token verification**: built in, offline (JWKS) or by introspection; a custom verifier stays possible.
