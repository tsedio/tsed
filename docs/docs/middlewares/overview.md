# Middlewares

`@Middleware()` is similar to the Express middleware with the difference that it's a class and you can use the IoC 
to inject other services on his constructor.

All middlewares decorated by `@Middleware` or `@MiddlewareError` have one method named `use()`. 
This method can use all parameters decorators as you could see with the [Controllers](docs/controllers.md) and return promise. 

## Installation

To begin, you must adding the `middlewares` folder on `componentsScan` attribute in your server settings as follow :
 
```typescript
import {ServerLoader} from "ts-express-decorators";
import Path = require("path");
const rootDir = Path.resolve(__dirname);

@ServerSettings({
   rootDir,
   mount: {
      '/rest': `${rootDir}/controllers/**/**.js`
   },
   componentsScan: [
       `${rootDir}/services/**/**.js`,
       `${rootDir}/middlewares/**/**.js`
   ]
})
export class Server extends ServerLoader {

}
```
Then, create a new file in your middlewares folder. Create a new Class definition then add the `@Middleware()` 
or `@MiddlewareError()` annotations on your class.

You have different use cases to declare and use a middleware. Theses use cases are following:

 * [Global Middleware](docs/middlewares/global-middleware.md), this middleware can be used on [ServerLoader](api/common/server/serverloader.md),
 * [Global MiddlewareError](docs/middlewares/global-error-middleware.md), this middleware error can be used on [ServerLoader](api/common/server/serverloader.md),
 * [Endpoint Middleware](docs/middlewares/endpoint-middleware.md), this middleware can be used on a controller method,
 * [Endpoint Middleware Error](docs/middlewares/endpoint-error-middleware.md), this middleware can be used on a controller method.

## Specifics parameters decorators

In addition, you have this specifics parameters decorators for the middlewares:

Signature | Example | Description
--- | --- | --- | ---
`@Err()` | `useMethod(@Err() err: any) {}` | Inject the `Express.Err` service. (Decorator for middleware).
`@ResponseData()` | `useMethod(@ResponseData() data: any)` | Provide the data returned by the previous middlewares.
`@EndpointInfo()` | `useMethod(@EndpointInfo() endpoint: Endpoint)` | Provide the endpoint settings.

***

<div class="guide-links">
<a href="#/docs/converters">Converters</a>
<a href="#/docs/middlewares/call-sequence">Call sequences</a>
</div>