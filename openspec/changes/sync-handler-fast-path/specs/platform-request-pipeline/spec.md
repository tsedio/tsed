# Spec Delta

## Purpose

Defines how a Ts.ED platform adapter (Express, Koa, Fastify, serverless) runs the handlers of a route, when that run may complete in the same tick, and the ordering and error guarantees every platform keeps.

## ADDED Requirements

### Requirement: Synchronous routes complete without waiting for a microtask

When every handler of a route returns a plain value, a `Buffer`, a stream or a response object, the platform SHALL run the handlers and send the response in the same tick as the call of the route handler. It SHALL NOT wait for a microtask between handlers. This applies to the endpoint, its middlewares, the response filter and the response handler, on Express, Fastify and serverless.

#### Scenario: Sync endpoint on Fastify sends the reply in the route handler

- **GIVEN** a Fastify app with `@Get("/hello") get() { return "hello world" }` and no async middleware or `$onRequest` listener
- **WHEN** a client sends `GET /hello`
- **THEN** the response is `200` with body `hello world`
- **AND** the reply is sent before the route handler returns to Fastify, without going through Fastify's promise path

#### Scenario: Sync endpoint on Express calls next in the same tick

- **GIVEN** an Express app with a synchronous middleware and a synchronous endpoint on the same route
- **WHEN** a client sends a request to that route
- **THEN** each Ts.ED handler calls Express `next()` before returning
- **AND** the response is `200` with the endpoint's value

#### Scenario: Sync serverless handler returns the response

- **GIVEN** a serverless function whose endpoint returns a plain object
- **WHEN** the function is invoked with an HTTP event
- **THEN** the function resolves with the serialized body, status and headers, as before this change

### Requirement: Koa routes keep Koa's promise contract

On Koa, each Ts.ED handler SHALL still return the promise of Koa's `next()`. When the handler is synchronous, the adapter SHALL NOT add a wrapping promise of its own.

#### Scenario: Sync endpoint on Koa

- **GIVEN** a Koa app with a synchronous endpoint
- **WHEN** a client sends a request to it
- **THEN** the response is `200` with the endpoint's value
- **AND** downstream Koa middlewares still run after `await next()` returns

### Requirement: Asynchronous handlers keep their behaviour

When a handler returns a promise or an observable, or calls `next`, the platform SHALL wait for it before running the next handler, exactly as before. A route SHALL switch from the synchronous path to the asynchronous path at the first handler that needs it, and SHALL NOT run a later handler before that handler settles.

#### Scenario: Async endpoint after a sync middleware

- **GIVEN** a route with a synchronous `@UseBefore` middleware and an `async` endpoint that resolves after 5 ms
- **WHEN** a client sends a request to it, on each platform
- **THEN** the middleware runs first and the endpoint runs second
- **AND** the response contains the endpoint's resolved value

#### Scenario: Middleware calling next

- **GIVEN** a middleware that takes `@Next()` and calls it asynchronously
- **WHEN** a client sends a request to the route
- **THEN** the endpoint runs only after `next()` is called

#### Scenario: Instance built by an async factory

- **GIVEN** a controller provided by an async factory
- **WHEN** a client sends a request to one of its endpoints
- **THEN** the endpoint runs once the instance resolves, and the response is correct

### Requirement: Handler effects keep their order

On every platform and on both paths, the platform SHALL apply the effects of a handler in the same order as before this change:

1. the returned status and headers;
2. `$ctx.data`;
3. the endpoint response headers and redirection;
4. the response filters;
5. the response body;
6. the `$onResponse` listeners, once the response ends.

#### Scenario: Status, headers and response filter on a sync endpoint

- **GIVEN** a sync endpoint with `@Returns(201)`, `@Header("x-test", "1")` and a registered `@ResponseFilter("application/json")` that wraps the body
- **WHEN** a client sends a request to it, on each platform
- **THEN** the response is `201`, has header `x-test: 1`, and its body is the wrapped value

#### Scenario: Redirect from a sync endpoint

- **GIVEN** a sync endpoint with `@Redirect(302, "/other")`
- **WHEN** a client sends a request to it
- **THEN** the response is `302` with `location: /other`

### Requirement: Errors reach the exception filters on both paths

An error thrown synchronously by a handler, a pipe or a response filter SHALL reach the exception filters, and produce the same response as an error from an async handler. The handlers after the failing one SHALL NOT run, except error middlewares.

#### Scenario: Sync endpoint throws

- **GIVEN** a sync endpoint that throws `new BadRequest("nope")`
- **WHEN** a client sends a request to it, on each platform
- **THEN** the response is `400` with the usual Ts.ED error body
- **AND** a registered `@Catch(BadRequest)` filter is called once

#### Scenario: Sync response filter throws

- **GIVEN** a response filter that throws for the endpoint's content type
- **WHEN** a client sends a request to the endpoint
- **THEN** the exception filters produce the error response, and no partial body is sent

### Requirement: Existing extension points keep working

`PlatformResponseFilter.transform()` SHALL keep returning a promise, and `AnyToPromise.call()` SHALL keep returning a promise. A `PlatformHandler` or `PlatformResponseFilter` subclass that overrides a pipeline method and returns a promise SHALL be awaited at that step.

#### Scenario: Caller of transform

- **WHEN** code calls `responseFilter.transform(data, $ctx).then(...)`, as `@tsed/sse` does
- **THEN** it receives the transformed data, as before

#### Scenario: Subclass returning a promise

- **GIVEN** a custom `PlatformHandler` whose `flush()` override awaits a promise before calling `super.flush()`
- **WHEN** a client sends a request
- **THEN** the response is sent after that promise resolves, and only once

### Requirement: Request pipeline overhead is measured

The change SHALL be validated with the HTTP benchmark workflow on Express, Koa and Fastify:

- `GET /hello` and `GET /users/:id` SHALL show a lower CPU per request than the base branch;
- `POST /orders` and `GET /orders?size=500` SHALL show no significant regression.

#### Scenario: Benchmark run on the change

- **WHEN** the benchmark workflow compares the base branch with this change
- **THEN** `GET /hello` on Fastify has a lower CPU per request than the base
- **AND** no route on any platform shows a significant regression
