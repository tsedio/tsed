# passport-route-protection Specification

## Purpose

TBD - created by archiving change fix-passport-authorize-protocol-session. Update Purpose after archive.

## Requirements

### Requirement: Session satisfies only compatible protocols

An authenticated session SHALL satisfy a route guarded by `@Authorize()` or `@Authenticate()` only when the route accepts any protocol (`"*"`), declares the reserved `"session"` protocol, or declares the protocol that established the session. Otherwise the declared strategies MUST run.

#### Scenario: Session from another protocol

- **WHEN** a user logged in with the `login` protocol calls a route declared with `@Authorize("basic")` without Basic credentials
- **THEN** the `basic` strategy runs and the request is rejected with `401`.

#### Scenario: Session from the declared protocol

- **WHEN** a user logged in with the `login` protocol calls a route declared with `@Authorize("login")`
- **THEN** the request is accepted without running the strategy.

#### Scenario: Any protocol

- **WHEN** an authenticated user calls a route declared with `@Authorize()`
- **THEN** the request is accepted.

### Requirement: Login protocol recorded in the session

After a successful `@Authenticate()` that establishes a login session, `ProtocolsService` SHALL record the protocol that verified the user in `req.session.passport.protocol`. It MUST NOT record it for `Passport.authorize()` or when `session: false` is given.

#### Scenario: Stateless authentication

- **WHEN** a route uses `@Authenticate("basic", {session: false})`
- **THEN** the recorded protocol of an existing session is left unchanged.

#### Scenario: Login ending with a redirect

- **WHEN** a route uses `@Authenticate("login", {successRedirect: "/home"})` and the credentials are valid
- **THEN** `login` is recorded while Passport.js serializes the user, before the redirect ends the request.

### Requirement: Reserved session protocol

The `"session"` protocol name SHALL be satisfied by an authenticated session and MUST NOT be forwarded to Passport.js. When no other protocol is declared, a request without session MUST be rejected with `401`.

#### Scenario: Session or token

- **WHEN** a route declared with `@Authorize(["session", "jwt"])` receives a request without session and with a valid token
- **THEN** the `jwt` strategy runs and the request is accepted.

### Requirement: Login-only protocols

A protocol declared with `loginOnly: true` SHALL NOT run its strategy on a route guarded by `@Authorize()`. It MUST still run on `@Authenticate()` routes.

#### Scenario: Credentials posted to a business route

- **WHEN** a request without session posts valid credentials to a route declared with `@Authorize("login")` and `login` is login-only
- **THEN** the request is rejected with `401` and the handler does not run.
