# Global middleware 

Global middlewares and Endpoint middlewares are almost similar but Global middleware cannot use the @@EndpointInfo@@.
Global middlewares lets you manage request and response on @@ServerLoader@@.

## Usage

Create your middleware:

<<< @/docs/docs/snippets/middlewares/global-middleware.ts

Then, add your middleware in @@ServerLoader@@:

<<< @/docs/docs/snippets/middlewares/global-middleware-configuration.ts

## Handle error

Express allows you to handle any error when your middleware have 4 parameters like this:

```javascript
function (error, req, res, next){}
```
Ts.ED has the same mechanism with @@Err@@ decorator. The following example is the GlobalErrorHandlerMiddleware
used by Ts.ED to handle all errors throw by your application.


<<< @/docs/docs/snippets/middlewares/global-middleware-error.ts

