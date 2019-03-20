# Middlewares

`@Middleware()` is similar to the Express middleware with the difference that it's a class and you can use the IoC 
to inject other services on his constructor.

All middlewares decorated by `@Middleware` or `@MiddlewareError` have one method named `use()`. 
This method can use all parameters decorators as you could see with the [Controllers](/docs/controllers.md) and return promise.

## Configuration

To begin, you must adding the `middlewares` folder on `componentsScan` attribute in your server settings as follow :
 
```typescript
import {ServerLoader} from "@tsed/common";
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

 * [Global Middleware](/docs/middlewares/global-middleware.md), this middleware can be used on [ServerLoader](/api/common/server/components/ServerLoader.md),
 * [Global MiddlewareError](/docs/middlewares/global-error-middleware.md), this middleware error can be used on [ServerLoader](/api/common/server/components/ServerLoader.md),
 * [Endpoint Middleware](/docs/middlewares/endpoint-middleware.md), this middleware can be used on a controller method,
 * [Endpoint Middleware Error](/docs/middlewares/endpoint-error-middleware.md), this middleware can be used on a controller method.

## Specifics parameters decorators

In addition, you have this specifics parameters decorators for the middlewares:

Signature | Example | Description
--- | --- | --- | ---
`@Err()` | `useMethod(@Err() err: any) {}` | Inject the `Express.Err` service. (Decorator for middleware).
`@ResponseData()` | `useMethod(@ResponseData() data: any)` | Provide the data returned by the previous middlewares.
`@EndpointInfo()` | `useMethod(@EndpointInfo() endpoint: Endpoint)` | Provide the endpoint settings.

## Override existing middlewares

The decorator [@OverrideMiddleware](/api/common/mvc/decorators/class/OverrideMiddleware.md) gives you the ability to
override some internal Ts.ED middlewares like:

* [Send response](/docs/middlewares/override/send-response.md)
* [Authentication](/docs/middlewares/override/authentication.md)
* [Response view](/docs/middlewares/override/response-view.md)
* [Global error handler](/docs/middlewares/override/global-error-handler.md)

> All middlewares provided by Ts.ED can be overridden. You can find the complete list [here](/api.md).

### Usage

```typescript
import {OriginalMiddlware, OverrideMiddleware} from "@tsed/common";

@OverrideMiddleware(OriginalMiddlware)
export class CustomMiddleware extends OriginalMiddlware {
    public use() {
        
    }
}
```

::: tip
By default, the server import automatically you middlewares matching with this rules `${rootDir}/middlewares/**/*.ts` (See [componentScan configuration](/configuration.md)).

```
.
├── src
│   ├── controllers
│   ├── services
│   ├── middlewares
│   └── Server.ts
└── package.json
```

If not, just import your middleware in your server or edit the [componentScan configuration](/configuration.md).

```typescript
import {ServerLoader, ServerSettings} from "@tsed/common";
import "./src/other/directory/CustomMiddleware";

@ServerSettings({
    ...
})
export class Server extends ServerLoader {
 
}
```
:::
