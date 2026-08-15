## ADDED Requirements

### Requirement: Elysia platform bootstrap

The system SHALL provide an `@tsed/platform-elysia` package exposing `PlatformElysia` so a Ts.ED root module can bootstrap against an Elysia application.

#### Scenario: Bootstrap an Elysia-backed application

- **WHEN** an application configures `PlatformElysia` with a Ts.ED root module
- **THEN** Ts.ED SHALL register its routes on an Elysia application and make it available as the platform application.

### Requirement: Fetch-native request and response boundary

The adapter SHALL map Elysia request, route parameters, query values, headers, cookies, status, and returned bodies through Ts.ED platform abstractions without assuming a mutable Node response object.

#### Scenario: Controller returns a JSON body

- **WHEN** a mapped Ts.ED controller returns a JSON-compatible body and status
- **THEN** the Elysia handler SHALL return a response with the selected status, headers, and serialized body.

### Requirement: Explicit capability support

The adapter SHALL retain an executable platform capability matrix and documentation that state every unsupported shared platform capability.

#### Scenario: Unsupported feature is evaluated

- **WHEN** a shared SDK suite cannot run on Elysia
- **THEN** the suite SHALL be retained as an explicitly named skip and the corresponding capability documentation SHALL describe the limitation.
