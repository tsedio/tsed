# mcp-endpoint-auth Specification

## Purpose

Defines how a Ts.ED MCP endpoint protected by `auth` behaves as an OAuth resource server: the bearer challenge it sends, and the information it gives MCP clients to obtain a token from the authorization server.

## Requirements

### Requirement: Scope hint in the bearer challenge

The `WWW-Authenticate` challenge of a protected MCP endpoint SHALL carry a `scope` parameter listing `auth.requiredScopes` when it is set, and `auth.scopesSupported` otherwise. When neither is configured, the challenge SHALL NOT carry a `scope` parameter. Scopes taken from `auth.scopesSupported` SHALL NOT be enforced on access tokens.

#### Scenario: Supported scopes without required scope

- **WHEN** an entry declares `auth.scopesSupported = ["openid", "profile", "email"]` without `requiredScopes` and a request has no bearer token
- **THEN** the response is `401` with `WWW-Authenticate: Bearer ..., scope="openid profile email", resource_metadata="..."`

#### Scenario: Supported scopes are not enforced

- **WHEN** the same entry receives a valid token that carries none of the supported scopes
- **THEN** the request is dispatched

#### Scenario: Required scopes take precedence

- **WHEN** an entry declares both `requiredScopes = ["mcp:read"]` and `scopesSupported = ["mcp:read", "mcp:write"]`
- **THEN** the challenge carries `scope="mcp:read"`
