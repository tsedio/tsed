# Middlewares

`@Middleware()` is similar to the Express middleware with the difference that it is a class and you can use the IoC to inject other services on his constructor.

All middlewares decorated by `@Middleware` or `@MiddlewareError` have one method named `use()`. This method can use all parameters decorators as you could see with the [Controllers](docs/controllers.md) and return promise. In addition, you have this specifics parameters decorators for middlewares.

## Installation

In first place, you must adding the `middlewares` folder on `componentsScan` attribute in your server settings as follow :
 
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
In second place, create a new file in your middlewares folder. Create a new Class definition and add the `@Middleware()` or `@MiddlewareError()` annotations on your class.

You have different use case to declare and use a middlewares. Theses uses are following:

 * [Global Middleware](docs/global-middleware.md), this middleware can be used on [ServerLoader](api/common/server/serverloader.md),
 * [Global MiddlewareError](docs/global-error-middleware.md), this middleware error can be used on [ServerLoader](api/common/server/serverloader.md),
 * [Endpoint Middleware](docs/endpoint-middleware.md), this middleware can be used on a controller method,
 * [Endpoint Middleware Error](docs/endpoint-error-middleware.md), this middleware can be used on a controller method.

## Specifics parameters decorators

Signature | Example | Description
--- | --- | --- | ---
`@Err()` | `useMethod(@Err() err: any) {}` | Inject the `Express.Err` service. (Decorator for middleware).
`@ResponseData()` | `useMethod(@ResponseData() data: any)` | Provide the data returned by the previous middlewares.
`@EndpointInfo()` | `useMethod(@EndpointInfo() endpoint: Endpoint)` | Provide the endpoint settings.