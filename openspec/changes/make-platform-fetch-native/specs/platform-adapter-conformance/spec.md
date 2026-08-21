## ADDED Requirements

### Requirement: First-party host bridges run a shared conformance suite

Each first-party host bridge SHALL run the platform adapter conformance suite against the same representative Ts.ED application.

#### Scenario: Verify common HTTP behavior across bridges

- **WHEN** the conformance suite runs for a first-party bridge
- **THEN** it SHALL verify route matching, parameter/query binding, status, headers, cookies, short-circuit middleware, exception conversion, response filtering, and lifecycle cleanup

### Requirement: Streaming behavior is verified at the bridge boundary

The conformance suite SHALL test response streaming and cancellation semantics for every bridge that advertises stream support.

#### Scenario: Verify a streaming endpoint

- **WHEN** a bridge advertises stream support and the representative application returns a streaming response
- **THEN** the suite SHALL verify that the client receives the stream and that the request scope is finalized after completion or cancellation

### Requirement: Integration extension support is documented and tested

Each first-party bridge SHALL document its native-object and lifecycle extension behavior and SHALL test the integration hooks required by supported external middleware and Ts.ED integration packages without claiming to implement their behavior.

#### Scenario: Verify a bridge integration boundary

- **WHEN** the conformance suite runs a first-party Node bridge
- **THEN** it SHALL verify native request/response access, host-provided accessors, and post-server lifecycle hooks while keeping middleware, multipart, and Socket.IO behavior outside the Fetch core

### Requirement: Node dependencies are classified and documented

The v9 change SHALL inventory every production import of `node:http` or `node:https` in the Ts.ED packages affected by the HTTP refactor. Each affected package SHALL be classified as runtime-agnostic migration work, a Node host bridge, or a Node-specific integration, and Node-specific integrations SHALL be documented in `docs/introduction/capabilities.md`.

#### Scenario: Publish the v9 capabilities matrix

- **WHEN** v9 alpha documentation is prepared
- **THEN** `docs/introduction/capabilities.md` SHALL identify the Node.js-specific integrations retained after the refactor and SHALL not present them as portable Fetch-runtime features
