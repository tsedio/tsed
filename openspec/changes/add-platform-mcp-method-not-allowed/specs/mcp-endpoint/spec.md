## ADDED Requirements

### Requirement: Unsupported transport methods

For every mounted MCP path, the HTTP module and the CLI Streamable HTTP server SHALL answer `GET` and `DELETE` requests with `405 Method Not Allowed`, an `Allow: POST` header and a JSON-RPC error body, without running authentication nor any MCP handler. These routes SHALL NOT be listed in the platform route logs.

#### Scenario: Client probes the event stream

- **WHEN** an MCP client sends `GET /mcp` with `Accept: text/event-stream`
- **THEN** the response is `405` with `Allow: POST` and the body `{"jsonrpc": "2.0", "error": {"code": -32000, "message": "Method not allowed."}, "id": null}`

#### Scenario: Client closes a session

- **WHEN** an MCP client sends `DELETE /mcp`
- **THEN** the response is `405` with `Allow: POST`

#### Scenario: Protected endpoint

- **WHEN** a `GET` request reaches an MCP path protected by `auth`
- **THEN** the response is `405`, not a `401` challenge
