---
prev: true
next: true
---

# Request data persistence

Express provides different ways to persist data on request as following:

- Directly on the request,
- On `response.locals`,
- On `request.session` and `request.cookies`

Ts.ED provides also a way to store and share data along all middlewares/endpoints during a request
with @@RequestContext@@.

Each approach is a valid way to persist data, but it's important to understand the difference between locals provided by express and context provided by Ts.ED.

## Locals

@@Locals@@ is a request property used by third-party like template engine to render a page by the server.
If you attach data on it, you'll expose this data to the template.

If you don't want that, don't use this attribute!

Here is an example:

<<< @/docs/docs/snippets/request-data-persistence/locals-example.ts

## Context 
<Badge text="v5.34.2+" />
 
@@Context@@ decorator will give you a way to store any data and retrieve to another middleware or endpoint without exposing it in the template.

Context decorator returns the @@RequestContext@@ created by Ts.ED when the request is handled by the server.

It contains some information as following:

- The request id,
- The request container used by the Ts.ED DI. It contains all services annotated with `@Scope(ProviderScope.REQUEST)`,
- The current @@EndpointMetadata@@ resolved by Ts.ED during the request,
- The data returned by the previous endpoint if you use multiple handlers on the same route. By default data is empty.

Here is an example:

<<< @/docs/docs/snippets/request-data-persistence/context-example.ts

::: tip
@@RequestLogger@@ is attached to the context `context.logger`. The RequestLogger stores all logs and Ts.ED prints (flushes) all logs after the response is sent by the server.
The approach optimizes performance by first sending in the response and then printing all logs.
:::





