---
sidebar: false
prev: true
next: true
---

# Request data persistence

Express provide different way to persist data on request as following:

- Directly on the request,
- On `response.locals`,
- On `request.session` and `request.cookies`

Ts.ED provide also a way to store and share data along all middlewares/endpoints during a request
with @@RequestContext@@.

Each approach are a valid way to persist data, but it's important understand the difference between locals provided by express and context provided by Ts.ED.

## Locals

Locals is a request property used by third-party like template engine to render a page by the server.
If you attach a data on it, you'll expose this data to the template.

If you don't want that don't use this attributes!

Here an example:

<<< @/docs/docs/snippets/request-data-persistence/locals-example.ts

## Context 
<Badge text="v5.34.2+" />
 
@@Context@@ decorator will give you a way to store any data and retrieve to another middleware or endpoint without exposing it in the template.

Context decorator return the @@RequestContext@@ created by Ts.ED when request is handled by the server.

It contains some information as following:

- The request id,
- The request container used by the Ts.ED DI. It contain all services annotated with `@Scope(ProviderScope.REQUEST)`,
- The current @@EndpointMetadata@@ resolved by Ts.ED during the request,
- The data return by the previous endpoint if you use multiple handler on the same route. By default data is empty.

Here an example:

<<< @/docs/docs/snippets/request-data-persistence/context-example.ts

::: tip
@@RequestLogger@@ is attached to the context `context.logger`. The RequestLogger store all log and Ts.ED print (flush) all log after the response is send by the server.
The approach optimize performance by sending in first the response and then print all logs.
:::





