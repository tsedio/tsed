---
meta:
  - name: description
    content: Documentation over Http Exceptions provided by Ts.ED framework. Use class to throw a standard Http error.
  - name: keywords
    content: http exceptions ts.ed express typescript node.js javascript decorators jsonschema class models
---

# Exceptions

Ts.ED http exceptions provide classes to throw standard HTTP exceptions. These exceptions can be used on Controller, Middleware or injectable Service.
Emitted exceptions will be handled by the @@PlatformExceptions@@ and formatted to a response with the right status code and headers.

::: tip
This module can be used in standalone with a pure Express/Node.js application.
:::

## Installation

::: code-group

```bash [npm]
npm install --save @tsed/exceptions
```

```bash [yarn]
yarn add @tsed/exceptions
```

```bash [pnpm]
pnpm add @tsed/exceptions
```

```sh [bun]
bun add @tsed/exceptions
```

:::

## Throwing standard exceptions

Here is two examples to throw exceptions based on this package in Ts.ED context or Express.js context:

::: code-group

<<< @/docs/snippets/exceptions/usage-controller.ts [Ts.ED]
<<< @/docs/snippets/exceptions/usage-express-route.ts [Express.js]

:::

## Custom exception

It's possible to create your own exception by creating a class which inherit from @@Exception@@ or one of the built-in exception like @@BadRequest@@.

Example:

<<< @/docs/snippets/exceptions/custom-exception.ts

Since IDFormatException extends the @@BadRequest@@, it will work seamlessly with the built-in exception handler, and therefore we can use it inside a controller method.

<<< @/docs/snippets/exceptions/custom-exception-usage.ts

## Built-in exceptions

Ts.ED provides a set of standard exceptions that inherit from the base @@Exception@@.
These are exposed from the @tsed/exceptions package, and represent many of the most common HTTP exceptions:

### Redirections (3xx)

<ApiList query="module == '@tsed/exceptions' && symbolType === 'class' && path.indexOf('redirections') > -1" />

### Client errors (4xx)

<ApiList query="module == '@tsed/exceptions' && symbolType === 'class' && path.indexOf('clientErrors') > -1" />

### Server errors (5xx)

<ApiList query="module == '@tsed/exceptions' && symbolType === 'class' && path.indexOf('serverErrors') > -1" />

## Exception filter

All errors are intercepted by the @@PlatformExceptionMiddleware@@.

By default, all HTTP Exceptions are automatically sent to the client, and technical errors are
sent as Internal Server Error.

The [Platform API](/docs/platform-api.md) provides @@Catch@@ decorator to catch error.
It lets you control the exact flow of control and the content of the response sent back to the client.

Let's create an exception filter that is responsible for catching exceptions which are an instance of the @@Exception@@ class,
and implementing custom response logic for them.

To do this, we'll need to access the underlying platform Request and Response objects by using the @@Context@@ decorator.
We'll access the Request object, so we can pull out the original url and include that in the logging information.
We'll use the Response object to take direct control of the response that is sent, using the `response.body()` method.

<<< @/docs/snippets/exceptions/http-exception-filter.ts

::: tip Note
All exception filters should implement the generic `ExceptionFilterMethods<T>` interface. This requires you to provide the `catch(exception: T, ctx: Context)` method with its indicated signature. `T` indicates the type of the exception.
:::

The `@Catch(Exception)` decorator binds the required metadata to the exception filter, telling Ts.ED that this particular filter is looking for exceptions of type @@Exception@@ and nothing else.
The @@Catch@@ decorator may take a single parameter, or a comma-separated list. This lets you set up the filter for several types of exceptions at once.

If you want to catch all errors, just use the @@Catch@@ decorator with the `Error` class:

<<< @/docs/snippets/exceptions/error-filter.ts

## 404 ResourceNotFound

Ts.ED throw a @@ResourceNotFound@@ error when nothing routes are resolved by the router.
By using Exception filter, it is now possible to manage this error and customize the
response sent to your consumer.

Create a new ResourceNotFoundFilter in the filters directories and copy/paste this example:

<<< @/docs/snippets/exceptions/resource-not-found-filter.ts

::: warning
`response.render()` requires to configure the template engine before. See our page over [Templating engine](/docs/templating#installation) installation for more details.
:::

Then import the custom filter in your server:

```typescript
import {Inject, Configuration} from "@tsed/di";
import "./filters/ResourceNotFoundFilter"; // Importing filter with ES6 import is enough

@Configuration({
  // ...
})
export class Server {}
```
