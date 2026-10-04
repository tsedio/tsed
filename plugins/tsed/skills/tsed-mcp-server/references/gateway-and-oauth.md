# Gateway and OAuth reference

Both features are configured per `mcp` entry and only apply to the HTTP module (plus `upstream` in the CLI `streamable-http` mode). Available from v8.42.0.

## Gateway (`upstream`)

One `upstream` per `mcp` entry. Ts.ED connects to it as an MCP client and serves its tools, resources and prompts on the entry's endpoint, next to the local ones. Declare several entries to expose several upstreams.

```typescript
@Configuration({
  mcp: [
    {
      path: "/mcp/directus",
      upstream: {type: "http", url: "https://directus.example.com/mcp", headers: {Authorization: `Bearer ${process.env.DIRECTUS_TOKEN}`}}
    },
    {
      path: "/mcp/files",
      upstream: {type: "stdio", command: "npx", args: ["-y", "@modelcontextprotocol/server-filesystem", "/data"]}
    }
  ]
})
export class Server {}
```

| Key                             | Applies to    | Effect                                                                                       |
| ------------------------------- | ------------- | -------------------------------------------------------------------------------------------- |
| `type`                          | all           | `"http"` (Streamable HTTP), `"sse"` (legacy SSE) or `"stdio"` (local process).               |
| `url`, `headers`, `requestInit` | `http`, `sse` | Target, headers and extra `fetch` options.                                                   |
| `command`, `args`, `env`, `cwd` | `stdio`       | Command line. `env` is merged over a safe subset of the parent environment.                  |
| `prefix`                        | all           | Optional prefix of exposed tool and prompt names. None by default.                           |
| `tools`, `prompts`, `resources` | all           | `{include?, exclude?}` filters (strings or RegExp) on upstream names, or URIs for resources. |
| `pool`                          | all           | `{max, idleTimeout}` of the connection pool. Defaults: `100`, `300000` ms.                   |

Rules:

- A local declaration wins over an upstream entry with the same exposed name; the upstream entry is skipped with a warning.
- An unreachable upstream never breaks the endpoint: its entries are omitted, the error is logged, the connection is retried with a backoff.
- Sampling, elicitation, roots and resource subscriptions are not forwarded.
- CLI: the upstream is exposed by `mcpServerConnect("streamable-http")` only, ignored in `stdio` mode, and `${OAUTH_*}` placeholders are rejected there.

## OAuth (`auth`)

`auth` is independent of `upstream`: it protects any HTTP MCP endpoint, with local tools, an upstream, or both. It works with any OAuth 2.1 / OIDC compliant authorization server. The endpoint is an OAuth resource server only. Client registration (including Client ID Metadata Documents), authorization and consent happen on the authorization server.

```typescript
auth: {
  issuer: "https://auth.example.com",
  resource: "https://api.example.com/mcp/directus",
  requiredScopes: ["mcp:read"],
  // offline by default; adding client credentials switches to introspection
  clientId: "mcp-gateway",
  clientSecret: process.env.MCP_GATEWAY_SECRET
}
```

| Key                                     | Effect                                                                                                                                       |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `issuer`                                | Authorization server URL (HTTPS). Required.                                                                                                  |
| `resource`                              | Canonical public URL of the endpoint, advertised in the metadata and the challenge, and used as expected audience. Required.                 |
| `mode`                                  | `"offline"` (RFC 9068 JWT validated with the issuer JWKS) or `"introspection"` (RFC 7662). Defaults to introspection when `clientId` is set. |
| `clientId`, `clientSecret`              | Credentials used to call the introspection endpoint.                                                                                         |
| `audience`                              | Expected audience, defaults to `resource`. `false` disables the check, in introspection mode only.                                           |
| `requiredScopes`, `scopesSupported`     | Scopes enforced on tokens, and scopes advertised in the metadata.                                                                            |
| `resourceName`, `resourceDocumentation` | Advertised in the metadata.                                                                                                                  |
| `jwksUri`, `introspectionEndpoint`      | Override the endpoints discovered from the issuer metadata.                                                                                  |
| `cacheTtl`                              | Seconds an introspection result is reused. Default `60`, `0` disables.                                                                       |
| `allowInsecureRequests`                 | Accept a non-HTTPS issuer. Local development only.                                                                                           |
| `verifier`                              | Object or injectable class with `verifyAccessToken(token): Promise<AuthInfo>`, replacing the built-in modes.                                 |

Behavior:

- `GET /.well-known/oauth-protected-resource<path>` serves the RFC 9728 metadata.
- Missing or invalid token: `401` with `WWW-Authenticate: Bearer resource_metadata="..."`. Missing scope: `403 insufficient_scope`. Authorization server unreachable: `500 server_error`.
- Handlers read the caller from the SDK context: `ctx.http?.authInfo` (`token`, `clientId`, `scopes`, `expiresAt`, `extra` = token claims).

Startup errors:

| Message contains                                                 | Cause                                                            |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| `auth.resource is required`                                      | `auth` without `resource`. It is never derived from the request. |
| `introspection mode requires auth.clientId`                      | `mode: "introspection"` without client credentials.              |
| `auth.audience cannot be disabled in offline mode`               | `audience: false` without introspection.                         |
| `uses ${OAUTH_*} placeholders but the endpoint declares no auth` | Placeholder in `upstream` on an entry without `auth`.            |

## Forward the caller identity

Placeholders are replaced with the verified identity, in `headers` (`http`, `sse`) or in `args` and `env` (`stdio`). They are plain strings, not template literals.

| Placeholder          | Value                        |
| -------------------- | ---------------------------- |
| `${OAUTH_TOKEN}`     | Verified access token.       |
| `${OAUTH_CLIENT_ID}` | Client id of the token.      |
| `${OAUTH_SCOPES}`    | Scopes separated by a space. |

```typescript
upstream: {type: "http", url: "https://directus.example.com/mcp", headers: {Authorization: "Bearer ${OAUTH_TOKEN}"}}
upstream: {type: "stdio", command: "npx", args: ["-y", "some-mcp-server"], env: {API_TOKEN: "${OAUTH_TOKEN}"}}
```

Without a placeholder the caller's token is never sent to the upstream. With placeholders, one connection is kept per identity: one process per token for `stdio`. Prefer `env` over `args` for secrets.
