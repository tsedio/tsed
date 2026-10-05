## ADDED Requirements

### Requirement: Custom pre-authentication check

Each `configuration.mcp` entry SHALL accept `auth.preAuth`: a function receiving the platform context, or a DI token resolving to a provider implementing `preAuth($ctx)`, resolved through the Ts.ED injector. The check SHALL run before the OAuth verification. When it returns an `AuthInfo`, the request SHALL be dispatched as authenticated and the OAuth verification SHALL be skipped. When it throws, the request SHALL NOT be dispatched and the error SHALL be rendered by the platform exception handling.

#### Scenario: Valid API key

- **WHEN** the check returns an `AuthInfo` for the presented API key
- **THEN** the request is dispatched and local handlers read that identity from the server context

#### Scenario: Wrong API key

- **WHEN** the check throws an `Unauthorized` exception
- **THEN** the response is `401` with the exception payload and no tool, resource or prompt handler runs

#### Scenario: Check resolved from DI

- **WHEN** `auth.preAuth` is an injectable class
- **THEN** the module resolves it through the injector and calls its `preAuth` method with the platform context

### Requirement: Custom check without OAuth

`auth` SHALL be valid with `preAuth` alone, without `issuer` and `resource`. Such an entry SHALL NOT serve protected resource metadata nor send a `WWW-Authenticate` challenge. When the check returns `undefined`, the request SHALL be answered `401` and SHALL NOT be dispatched. An `auth` object declaring neither an issuer nor `preAuth` SHALL make the application fail to start.

#### Scenario: No credential on an endpoint without OAuth

- **WHEN** the check returns `undefined` on an entry declaring `auth: {preAuth}` only
- **THEN** the response is `401` without `WWW-Authenticate` header

#### Scenario: No OAuth metadata

- **WHEN** an entry declares `auth: {preAuth}` only
- **THEN** `GET /.well-known/oauth-protected-resource{path}` is not mounted

#### Scenario: Empty auth

- **WHEN** an entry declares `auth: {}`
- **THEN** the application fails to start with an error naming the endpoint

### Requirement: Custom check combined with OAuth

When an entry declares both `auth.preAuth` and an issuer, the endpoint SHALL accept either method: a request for which the check returns `undefined` SHALL follow the OAuth verification, including its `401` challenge.

#### Scenario: API key without bearer token

- **WHEN** a request carries a valid API key and no `Authorization` header
- **THEN** the request is dispatched with the identity returned by the check

#### Scenario: Bearer token without API key

- **WHEN** the check returns `undefined` and the request carries a valid bearer token
- **THEN** the request is dispatched with the OAuth identity

#### Scenario: No credential

- **WHEN** the check returns `undefined` and the request carries no bearer token
- **THEN** the response is `401` with the `WWW-Authenticate` challenge pointing to the protected resource metadata

### Requirement: Identity from the custom check feeds the upstream

The identity returned by `auth.preAuth` SHALL interpolate the `${OAUTH_*}` placeholders of the upstream like an OAuth identity, and upstream placeholders SHALL be accepted on an entry declaring `auth` with `preAuth` only.

#### Scenario: API key forwarded to the upstream

- **WHEN** an entry declares `auth: {preAuth}` and an upstream header `X-Key: ${OAUTH_TOKEN}`, and the check returns an identity whose token is `abc`
- **THEN** requests to the upstream carry `X-Key: abc`
