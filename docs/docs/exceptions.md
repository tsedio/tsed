---
meta:
 - name: description
   content: Documentation over Http Exceptions provided by Ts.ED framework. Use class to throw a standard Http error.
 - name: keywords
   content: http exceptions ts.ed express typescript node.js javascript decorators jsonschema class models
---
# Http exceptions

Ts.ED http exceptions provide classes to throw standard HTTP exceptions. Theses exceptions can be used on Controller, Middleware or injectable Service.
Emitted exceptions will be handle by the @@GlobalErrorHandlerMiddleware@@ and formatted to an Express response with the right status code and headers.

Other thing. This module can be used with a pure Express application.

## Installation

```bash
npm install @tsed/exceptions
// or
yarn add @tsed/exceptions
```

## Usage

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
```typescript
import {BadRequest} from "@tsed/exceptions";

export class IDFormatException extends BadRequest {
  constructor() {
    super("ID format is not valid");
  }
}
```

## Built-in exceptions

### Redirections (3xx)

<ApiList query="module == '@tsed/exceptions' && symbolType === 'class' && path.indexOf('redirections') > -1" />

### Client errors (4xx)

<ApiList query="module == '@tsed/exceptions' && symbolType === 'class' && path.indexOf('clientErrors') > -1" />

### Server errors (5xx)

<ApiList query="module == '@tsed/exceptions' && symbolType === 'class' && path.indexOf('serverErrors') > -1" />

