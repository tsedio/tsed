---
meta:
 - name: description
   content: Documentation over Http Exceptions provided by Ts.ED framework. Use class to throw a standard Http error.
 - name: keywords
   content: http exceptions ts.ed express typescript node.js javascript decorators jsonschema class models
---
# Exceptions

Ts.ED http exceptions provide classes to throw standard HTTP exceptions. These exceptions can be used on Controller, Middleware or injectable Service.
Emitted exceptions will be handle by the @@GlobalErrorHandlerMiddleware@@ and formatted to an Express response with the right status code and headers.

An other thing. This module can be used with a pure Express application.

## Installation

```bash
npm install @tsed/exceptions
// or
yarn add @tsed/exceptions
```

## Throwing standard exceptions

Here is two example to throw exceptions based on this package in Ts.ED context or Express.js context:

<Tabs class="-code">
  <Tab label="Ts.ED">
  
<<< @/docs/docs/snippets/exceptions/usage-controller.ts

  </Tab>
  <Tab label="Express.js">
  
<<< @/docs/docs/snippets/exceptions/usage-express-route.ts

  </Tab>
</Tabs> 

## Custom exception

It's possible to create your own exception by creating a class which inherit from @@Exception@@ or one of the built-in exception like @@BadRequest@@.

Example:

<<< @/docs/docs/snippets/exceptions/custom-exception.ts

Since IDFormatException extends the @@BadRequest@, it will work seamlessly with the built-in exception handler, and therefore we can use it inside a controller method.

<<< @/docs/docs/snippets/exceptions/custom-exception-usage.ts

## Built-in exceptions

Ts.ED provides a set of standard exceptions that inherit from the base @@Exception@@. 
These are exposed from the @tsed/exceptions package, and represent many of the most common HTTP exceptions:

### Redirections (3xx)

<ApiList query="module == '@tsed/exceptions' && symbolType === 'class' && path.indexOf('redirections') > -1" />

### Client errors (4xx)

<ApiList query="module == '@tsed/exceptions' && symbolType === 'class' && path.indexOf('clientErrors') > -1" />

### Server errors (5xx)

<ApiList query="module == '@tsed/exceptions' && symbolType === 'class' && path.indexOf('serverErrors') > -1" />

## Handle all errors

All errors are intercepted by the @@GlobalErrorHandlerMiddleware@@.

By default, all HTTP Exceptions are automatically sent to the client, and technical errors are
sent as Internal Server Error.

The default format is an HTML content, but it couldn't be useful for your consumers. 
You can register your own exception handler and change the response sent to your consumers.

<<< @/docs/docs/snippets/exceptions/custom-global-error-handler.ts

Then you just have adding this middleware in your `Server.ts` as following:

<<< @/docs/docs/snippets/exceptions/custom-global-error-handler-usage.ts

### Advanced example

Here is another example of GlobalErrorHandlerMiddleware implementation. This example show you, how
you can handler any kind of error and transform the error to a proper JSON response.

<<< @/docs/docs/snippets/exceptions/advanced-custom-global-error-handler.ts

Here is the original @@GlobalErrorHandlerMiddleware@@:

<<< @/packages/common/src/platform-express/middlewares/GlobalErrorHandlerMiddleware.ts
