# Spec Delta

## Purpose

Defines how Ts.ED resolves the parameters of an endpoint before calling it, on every platform: the order of the pipes, when resolution completes in the same tick, how asynchronous pipes are awaited, and how errors are reported.

## ADDED Requirements

### Requirement: Parameters with synchronous pipes resolve in the same tick

When every pipe of every parameter of an endpoint returns a plain value, and the controller instance is available without a promise, Ts.ED SHALL resolve the arguments and call the endpoint in the same tick. It SHALL NOT wait for a microtask between pipes or between parameters.

#### Scenario: Path and query parameters on a synchronous endpoint

- **GIVEN** a Fastify app with `@Get("/users/:id") get(@PathParams("id") id: string, @QueryParams("full") full: boolean)` that returns a plain object
- **WHEN** a client sends `GET /users/1?full=true`
- **THEN** the endpoint receives `"1"` and `true`
- **AND** the reply is sent before the route handler returns to Fastify, as for a route without parameters

#### Scenario: Body validated by AJV with a synchronous schema

- **GIVEN** an Express app with `@Post("/users") create(@BodyParams() user: User)` where `User` has `@Required()` and `@MinLength()` properties
- **WHEN** a client posts a valid user
- **THEN** the endpoint receives a `User` instance
- **AND** the endpoint is called without waiting for a microtask after the body is read

### Requirement: Asynchronous pipes are awaited in order

When a pipe returns a promise, Ts.ED SHALL wait for it before calling the next pipe of that parameter, and SHALL call the endpoint only after every parameter is resolved. Pipes SHALL keep running in priority order, and each pipe SHALL receive the resolved value of the previous one.

#### Scenario: Custom async pipe followed by a sync pipe

- **GIVEN** a parameter with a custom pipe that resolves after 5 ms to `"a"`, followed by a pipe that appends `"b"`
- **WHEN** a client calls the endpoint
- **THEN** the second pipe receives `"a"`, not a promise
- **AND** the endpoint receives `"ab"`

#### Scenario: One async parameter among synchronous ones

- **GIVEN** an endpoint with three parameters where only the second uses an async pipe
- **WHEN** a client calls the endpoint
- **THEN** the endpoint receives the three values in declaration order
- **AND** the endpoint is called once, after the async pipe resolves

### Requirement: Pipe errors are reported the same way, thrown or rejected

An error from a pipe, whether thrown synchronously or returned as a rejected promise, SHALL be wrapped in `ParamValidationError` with the parameter's metadata. The response status and body SHALL be the same as before this change.

#### Scenario: Required parameter missing

- **GIVEN** an endpoint with `@Required() @QueryParams("q") q: string`
- **WHEN** a client calls it without `q`
- **THEN** the response is `400` with the same error body as before this change

#### Scenario: Synchronous AJV failure

- **GIVEN** an endpoint with a body model whose `name` has `@MinLength(3)`
- **WHEN** a client posts `{"name": "a"}`
- **THEN** the response is `400` with the same `AJV_VALIDATION_ERROR` body as before this change

#### Scenario: Rejection from a custom async pipe

- **GIVEN** a custom pipe that returns `Promise.reject(new BadRequest("nope"))`
- **WHEN** a client calls the endpoint
- **THEN** the error is wrapped in `ParamValidationError` and the response is `400`, as before this change

### Requirement: The parameter value is read the same way

Ts.ED SHALL read the raw value of a parameter from the request with the same rules as before: the same expression and data path, header names lowercased, and an empty query or path value turned into `undefined` for a non-string type.

#### Scenario: Header parameter with an upper-case name

- **GIVEN** an endpoint with `@HeaderParams("X-Request-Id") id: string`
- **WHEN** a client sends the header `x-request-id: 42`
- **THEN** the endpoint receives `"42"`

#### Scenario: Empty numeric query value

- **GIVEN** an endpoint with `@QueryParams("page") page: number`
- **WHEN** a client calls it with `?page=`
- **THEN** the endpoint receives `undefined`
