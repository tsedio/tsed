# Middlewares

`@Middleware()` is similar to the Express middleware with the difference that it is a class and you can use the IoC to inject other services on his constructor.

All middlewares decorated by `@Middleware` or `@MiddlewareError` have one method named `use()`. This method can use all parameters decorators as you could see with the [Controllers](docs/controllers.md) and return promise. (See all [parameters decorators](https://github.com/Romakita/ts-express-decorators/wiki/API-references#parameter-decorators)).In addition, you have this specifics parameters decorators for middlewares.

## Installation

In first place, you must adding the `middlewares` folder on `componentsScan` attribute in your server settings as follow :
 
```typescript
import * as Express from "express";
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

 * Global Middleware, this middleware can be used on [ServerLoader](docs/server-loader.md),
 * Global MiddlewareError, this middleware error can be used on [ServerLoader](docs/server-loader.md),
 * Endpoint Middleware, this middleware can be used on a controller method,
 * Endpoint Middleware Error, this middleware can be used on a controller method.

## Specifics parameters decorators

Signature | Example | Description
--- | --- | --- | ---
`@Err()` | `useMethod(@Err() err: any) {}` | Inject the `Express.Err` service. (Decorator for middleware).
`@ResponseData()` | `useMethod(@ResponseData() data: any)` | Provide the data returned by the previous middlewares.
`@EndpointInfo()` | `useMethod(@EndpointInfo() endpoint: Endpoint)` | Provide the endpoint settings.
