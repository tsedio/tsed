## ADDED Requirements

### Requirement: Caller subject interpolation

The gateway SHALL replace the placeholder `${OAUTH_SUB}` with the subject of the caller, read from the `sub` entry of the claims exposed in `AuthInfo.extra`, in the `headers` values of an `http` or `sse` upstream and in the `args` and `env` values of a `stdio` upstream. When the claims hold no string subject, the placeholder SHALL be replaced with an empty value. Using the placeholder on an entry without `auth` SHALL be reported as a configuration error at startup.

#### Scenario: Subject interpolated in the environment of a stdio upstream

- **WHEN** a stdio upstream declares `env: {USER_ID: "${OAUTH_SUB}"}` and a caller presents a valid token whose `sub` claim is `user-1`
- **THEN** the call is served by a process started with `USER_ID=user-1`

#### Scenario: One upstream connection per subject

- **WHEN** two callers with different `sub` claims reach an upstream whose definition references `${OAUTH_SUB}`
- **THEN** each caller is served by its own upstream connection

#### Scenario: Subject missing from the claims

- **WHEN** the upstream declares `env: {USER_ID: "${OAUTH_SUB}"}` and the verified identity exposes no `sub`
- **THEN** the process is started with an empty `USER_ID`

#### Scenario: Placeholder without auth

- **WHEN** the upstream uses `${OAUTH_SUB}` on an entry that has no `auth` block
- **THEN** the server fails to start with a configuration error naming the endpoint
