## ADDED Requirements

### Requirement: Per-endpoint OAuth configuration

Each `configuration.mcp` entry SHALL accept an optional `auth` block declaring the authorization server that protects the endpoint: `issuer` (required), the verification settings (`mode`, `clientId`, `clientSecret`, `audience`, `jwksUri`, `introspectionEndpoint`, `cacheTtl`, `allowInsecureRequests`, `verifier`), and optional `resource`, `scopesSupported`, `requiredScopes`, `resourceName` and `resourceDocumentation`. Entries without `auth` SHALL remain unauthenticated by the package, as before this change. Entries of the same application MAY declare different `auth` blocks.

#### Scenario: Endpoint without auth is unchanged

- **WHEN** a `configuration.mcp` entry declares no `auth`
- **THEN** no well-known route is registered for it and requests are dispatched without any token check

#### Scenario: Two endpoints with different authorization servers

- **WHEN** `/mcp/a` declares `auth.issuer = "https://auth-a.example.com"` and `/mcp/b` declares `auth.issuer = "https://auth-b.example.com"`
- **THEN** each endpoint advertises and enforces its own authorization server

### Requirement: Protected resource metadata

For each entry with `auth`, the module SHALL serve OAuth 2.0 Protected Resource Metadata (RFC 9728) with `GET /.well-known/oauth-protected-resource{path}`, containing `resource`, `authorization_servers` (the configured issuer), and `scopes_supported`, `resource_name` and `resource_documentation` when configured. `resource` SHALL default to the endpoint URL derived from the incoming request when not configured. The route SHALL be listed in the platform route logs.

#### Scenario: Metadata for a custom path

- **WHEN** an entry declares `path: "/mcp/directus"` and `auth: {issuer: "https://auth.example.com", scopesSupported: ["mcp:read"]}`
- **THEN** `GET /.well-known/oauth-protected-resource/mcp/directus` returns `200` with a JSON body whose `authorization_servers` is `["https://auth.example.com"]`, whose `scopes_supported` is `["mcp:read"]`, and whose `resource` is the endpoint URL

#### Scenario: Explicit resource identifier

- **WHEN** an entry declares `auth.resource = "https://api.example.com/mcp/directus"`
- **THEN** the metadata `resource` is exactly that value, whatever the request host

### Requirement: Bearer challenge

For each entry with `auth`, a request to the MCP endpoint without a valid bearer access token SHALL NOT be dispatched to the MCP server. The module SHALL answer `401` with a `WWW-Authenticate: Bearer` header carrying a `resource_metadata` parameter that points to the endpoint's protected resource metadata URL. A valid token lacking one of `requiredScopes` SHALL be answered with `403` and an `insufficient_scope` challenge listing the required scopes.

#### Scenario: Missing token

- **WHEN** a client sends `POST /mcp/directus` without an `Authorization` header to a protected endpoint
- **THEN** the response is `401` with `WWW-Authenticate: Bearer resource_metadata="<origin>/.well-known/oauth-protected-resource/mcp/directus"` and no tool, resource or prompt handler runs

#### Scenario: Invalid token

- **WHEN** the verification rejects the presented token
- **THEN** the response is `401` with an `invalid_token` challenge carrying the `resource_metadata` parameter

#### Scenario: Insufficient scope

- **WHEN** the endpoint declares `requiredScopes: ["mcp:write"]` and the verified token only has `mcp:read`
- **THEN** the response is `403` with `WWW-Authenticate: Bearer error="insufficient_scope", scope="mcp:write"`

### Requirement: Offline token verification

In `offline` mode, the module SHALL validate the access token as an RFC 9068 JWT access token: signature against the JWKS of the configured issuer, `iss` equal to the issuer, `aud` containing the expected audience (the endpoint `resource` unless `auth.audience` is set) and expiration. The JWKS URL SHALL be discovered from the issuer metadata unless `auth.jwksUri` is set. `offline` SHALL be the default mode when no `clientId` is configured.

#### Scenario: Valid JWT

- **WHEN** a client presents a JWT signed by the issuer for the endpoint resource
- **THEN** the request is dispatched with an `AuthInfo` carrying the token, its client id, its scopes, its expiration and its claims

#### Scenario: Wrong audience

- **WHEN** a client presents a JWT issued for another resource
- **THEN** the response is `401` with an `invalid_token` challenge

#### Scenario: Unknown signing key

- **WHEN** a client presents a JWT signed with a key absent from the issuer JWKS
- **THEN** the response is `401` with an `invalid_token` challenge

### Requirement: Explicit expected audience

When no custom `verifier` is configured, the entry SHALL declare `auth.resource` or `auth.audience`; the application SHALL fail to start otherwise. `auth.audience = false` SHALL disable the audience check in introspection mode only; in offline mode it SHALL make the application fail to start. The expected audience of access tokens SHALL never be derived from the incoming request. `auth.issuer` and `auth.resource` SHALL be absolute URLs.

#### Scenario: Audience disabled in offline mode

- **WHEN** an entry in offline mode declares `auth.audience = false`
- **THEN** the application fails to start with an error naming the endpoint

#### Scenario: Missing resource

- **WHEN** an entry declares `auth: {issuer}` without `resource`, `audience` or `verifier`
- **THEN** the application fails to start with an error naming the endpoint

### Requirement: Token introspection

In `introspection` mode, the module SHALL verify each access token by calling the issuer introspection endpoint (RFC 7662), authenticated with `auth.clientId` and `auth.clientSecret`, and SHALL reject tokens reported inactive, issued by another issuer, or whose reported `aud` is missing or does not contain the expected audience. The endpoint URL SHALL be discovered from the issuer metadata unless `auth.introspectionEndpoint` is set. Results SHALL be cached for `auth.cacheTtl` seconds (default 60) and never past the token expiration. `introspection` SHALL be the default mode when `clientId` is configured; selecting it without `clientId` and `clientSecret` SHALL be reported as a configuration error at startup.

#### Scenario: Active opaque token

- **WHEN** a client presents an opaque token that the authorization server reports active
- **THEN** the request is dispatched with an `AuthInfo` built from the introspection response

#### Scenario: Inactive token

- **WHEN** the authorization server reports the token inactive
- **THEN** the response is `401` with an `invalid_token` challenge

#### Scenario: Token without audience

- **WHEN** the authorization server reports the token active without `aud`
- **THEN** the response is `401` with an `invalid_token` challenge

#### Scenario: Audience check disabled

- **WHEN** an entry in introspection mode declares `auth.audience = false` and the authorization server reports the token active without `aud`
- **THEN** the request is dispatched, and a warning naming the endpoint was logged at startup

#### Scenario: Cached result

- **WHEN** the same token is presented twice within `cacheTtl`
- **THEN** the introspection endpoint is called once

#### Scenario: Missing client credentials

- **WHEN** an entry declares `auth.mode = "introspection"` without `clientId` and `clientSecret`
- **THEN** the application fails to start with an error naming the endpoint

### Requirement: Authorization server outage

When the issuer metadata, the JWKS or the introspection endpoint cannot be reached, the module SHALL answer `500` with a `server_error` and SHALL NOT answer with an `invalid_token` challenge.

#### Scenario: Introspection endpoint down

- **WHEN** the introspection endpoint answers with an error
- **THEN** the response is `500 server_error` and the request is not dispatched

### Requirement: Custom token verification

`auth.verifier` SHALL replace the built-in modes when set. It SHALL accept either an object implementing `verifyAccessToken(token): Promise<AuthInfo>` or a DI token resolving to such a provider, resolved through the Ts.ED injector so that verifiers can inject application services.

#### Scenario: Verifier resolved from DI

- **WHEN** `auth.verifier` is an injectable class that depends on another service
- **THEN** the module resolves it through the injector and calls `verifyAccessToken` with the presented bearer token

### Requirement: Auth propagation

After a successful verification, the module SHALL expose the resulting `AuthInfo` to local MCP handlers through the SDK server context, and use it to interpolate the upstream placeholders of the same endpoint.

#### Scenario: Local tool reads the caller identity

- **WHEN** an authenticated client calls a local tool on a protected endpoint
- **THEN** the tool handler's server context exposes the `AuthInfo` returned by the verifier

### Requirement: Authorization server delegation

The module SHALL NOT issue tokens, register OAuth clients or render consent. Client registration (including Client ID Metadata Documents), authorization and consent SHALL be performed by the authorization server referenced in the protected resource metadata.

#### Scenario: Client discovers the authorization server

- **WHEN** an MCP client receives the `401` challenge and fetches the protected resource metadata
- **THEN** it finds the configured issuer in `authorization_servers` and performs registration, authorization and consent against that server only
