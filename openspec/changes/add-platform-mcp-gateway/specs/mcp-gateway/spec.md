## ADDED Requirements

### Requirement: Upstream MCP server declaration

`@tsed/platform-mcp` SHALL accept a single `upstream` object on each `configuration.mcp` entry, of type `http` (Streamable HTTP, with `url` and optional `headers`), `sse` (legacy SSE, with `url` and optional `headers`) or `stdio` (with `command` and optional `args`, `env` and `cwd`). Entries without `upstream` SHALL behave exactly as before this change. Exposing several upstream servers SHALL be done with several `configuration.mcp` entries.

#### Scenario: Endpoint with a Streamable HTTP upstream

- **WHEN** an application configures `mcp: {path: "/mcp/directus", upstream: {type: "http", url: "https://directus.example.com/mcp"}}`
- **THEN** `POST /mcp/directus` is mounted and serves the upstream's tools, resources and prompts over Streamable HTTP

#### Scenario: Endpoint with a stdio upstream

- **WHEN** an application configures `upstream: {type: "stdio", command: "npx", args: ["-y", "some-mcp-server"]}`
- **THEN** the gateway spawns the process, speaks MCP over its stdio, and serves its tools over the Streamable HTTP endpoint

#### Scenario: Endpoint without upstream is unchanged

- **WHEN** a `configuration.mcp` entry declares no `upstream`
- **THEN** no MCP client is created and the endpoint only serves locally declared tools, resources and prompts

### Requirement: Upstream catalog exposure

For each endpoint, the gateway SHALL list the tools, resources, resource templates and prompts of the upstream together with the locally declared ones in the corresponding MCP list responses, preserving upstream titles, descriptions, annotations, JSON Schemas and prompt arguments.

#### Scenario: Aggregated tool listing

- **WHEN** an endpoint declares a local tool `ping` and an upstream exposing `search`
- **THEN** `tools/list` returns `ping` and `search` with their respective input schemas

### Requirement: Request forwarding

The gateway SHALL forward `tools/call`, `resources/read` and `prompts/get` requests targeting an upstream entry to the upstream and return its result unchanged, including `isError` tool results. A failure of the upstream request SHALL be reported to the caller as an MCP error and SHALL NOT be reported as a success.

#### Scenario: Tool call forwarded

- **WHEN** a client calls an upstream tool with arguments `{"collection": "articles"}`
- **THEN** the gateway calls the same tool upstream with the same arguments and returns the upstream `content` and `structuredContent`

#### Scenario: Upstream tool error preserved

- **WHEN** the upstream answers a tool call with `isError: true`
- **THEN** the caller receives the same result with `isError: true`

#### Scenario: Caller cancels a forwarded call

- **WHEN** the caller aborts a request that is being forwarded
- **THEN** the gateway cancels the pending upstream request

### Requirement: Namespacing and filtering

The upstream SHALL accept an optional `prefix` applied to the names of its tools and prompts (no prefix by default), and optional `include` / `exclude` filters (exact names or regular expressions, evaluated on upstream names, or URIs for resources) for tools, resources and prompts. Forwarded calls SHALL use the original upstream name.

#### Scenario: No prefix by default

- **WHEN** the upstream declares no `prefix` and exposes a tool `read_items`
- **THEN** `tools/list` exposes `read_items`

#### Scenario: Prefixed tool

- **WHEN** the upstream is configured with `prefix: "directus_"` and exposes a tool `read_items`
- **THEN** `tools/list` exposes `directus_read_items` and calling it invokes `read_items` upstream

#### Scenario: Excluded tool

- **WHEN** the upstream is configured with `tools: {exclude: ["delete_item"]}`
- **THEN** `delete_item` is absent from `tools/list` and calling it returns a tool-not-found error

### Requirement: Collision handling

The gateway SHALL detect name collisions (tools, prompts) and URI collisions (resources) between the upstream and local declarations. Local declarations SHALL take precedence; the skipped upstream entry SHALL be logged as a warning.

#### Scenario: Upstream tool shadows a local tool

- **WHEN** a local tool and an upstream tool resolve to the same exposed name
- **THEN** the local tool is served, the upstream tool is not exposed, and a warning is logged

### Requirement: Caller identity interpolation

The gateway SHALL replace the placeholders `${OAUTH_TOKEN}`, `${OAUTH_CLIENT_ID}` and `${OAUTH_SCOPES}` with the verified identity of the caller in the `headers` values of an `http` or `sse` upstream, and in the `args` and `env` values of a `stdio` upstream. Without a placeholder, the gateway SHALL NOT send the caller's token to the upstream. Using a placeholder on an entry without `auth` SHALL be reported as a configuration error at startup.

#### Scenario: Token interpolated in a header

- **WHEN** the upstream declares `headers: {Authorization: "Bearer ${OAUTH_TOKEN}"}` and a caller presents the valid bearer token `abc`
- **THEN** requests to the upstream carry `Authorization: Bearer abc`

#### Scenario: Token interpolated on a custom header

- **WHEN** the upstream declares `headers: {"X-OIDC-Token": "${OAUTH_TOKEN}"}` and a caller presents the valid bearer token `abc`
- **THEN** requests to the upstream carry `X-OIDC-Token: abc` and no `Authorization` header

#### Scenario: Token interpolated in stdio arguments

- **WHEN** a stdio upstream declares `args: ["server.js", "--token", "${OAUTH_TOKEN}"]` and a caller presents the valid bearer token `abc`
- **THEN** the call is served by a process started with the arguments `server.js --token abc`

#### Scenario: No implicit token passthrough

- **WHEN** a protected endpoint receives a valid bearer token and the upstream declares no placeholder
- **THEN** the request sent to the upstream carries no `Authorization` header

#### Scenario: Placeholder without auth

- **WHEN** the upstream uses `${OAUTH_TOKEN}` on an entry that has no `auth` block
- **THEN** the application fails to start with an error naming the endpoint

### Requirement: Upstream connection lifecycle

The gateway SHALL connect to the upstream lazily and reuse connections across requests: one connection (one process for `stdio`) per distinct set of interpolated values, in a pool bounded by `pool.max` and `pool.idleTimeout`. It SHALL refresh the cached catalog when the upstream notifies a list change, and close every connection and child process when the application is destroyed.

#### Scenario: Busy connection kept

- **WHEN** a connection is serving a request when the pool evicts idle or least recently used connections
- **THEN** that connection is not closed and the request completes

#### Scenario: Connection reused

- **WHEN** two successive requests target an upstream without placeholder
- **THEN** a single upstream connection and a single `initialize` handshake are performed

#### Scenario: One connection per identity

- **WHEN** two callers with different tokens reach an upstream whose headers reference `${OAUTH_TOKEN}`
- **THEN** each caller is served through its own upstream connection

#### Scenario: Catalog refreshed

- **WHEN** the upstream emits `notifications/tools/list_changed`
- **THEN** the next `tools/list` on the gateway reflects the new upstream tool list

#### Scenario: Shutdown

- **WHEN** the Ts.ED application is destroyed
- **THEN** all upstream clients are closed and stdio child processes are terminated

### Requirement: Upstream failure isolation

An upstream that cannot be reached SHALL NOT prevent the endpoint from serving local declarations. Its entries SHALL be omitted from list responses, the failure SHALL be logged, and the gateway SHALL retry the connection on a later request.

#### Scenario: Upstream down

- **WHEN** an endpoint declares local tools and an upstream that refuses connections
- **THEN** `tools/list` returns the local tools and an error mentioning the upstream is logged

### Requirement: CLI Streamable HTTP server

The CLI Streamable HTTP server (`mcpServerConnect("streamable-http")`) SHALL expose the configured `upstream` like the platform endpoint. The CLI stdio server SHALL ignore `upstream` and log a warning. Because the CLI endpoint is not protected by OAuth, an `upstream` using `${OAUTH_*}` placeholders SHALL make the CLI Streamable HTTP server fail to start.

#### Scenario: Upstream exposed by the CLI over HTTP

- **WHEN** the CLI starts in `streamable-http` mode with an `upstream` configured
- **THEN** `POST /mcp` serves the upstream's tools together with the local ones

#### Scenario: Upstream ignored in stdio mode

- **WHEN** the CLI starts in `stdio` mode with an `upstream` configured
- **THEN** only local declarations are served and a warning is logged

#### Scenario: Placeholders rejected by the CLI

- **WHEN** the CLI starts in `streamable-http` mode with an `upstream` using `${OAUTH_TOKEN}`
- **THEN** startup fails with an error
