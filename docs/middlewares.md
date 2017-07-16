# Middlewares

`@Middleware()` is similar to the Express middleware with the difference that it is a class and you can use the IoC to inject other services on his constructor.

All middlewares decorated by `@Middleware` or `@MiddlewareError` have one method named `use()`. This method can use all parameters decorators as you could see with the [Controllers](https://github.com/Romakita/ts-express-decorators/wiki/Controllers) and return promise. (See all [parameters decorators](https://github.com/Romakita/ts-express-decorators/wiki/API-references#parameter-decorators)).In addition, you have this specifics parameters decorators for middlewares.

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

 * Global Middleware, this middleware can be used on [ServerLoader](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader),
 * Global MiddlewareError, this middleware error can be used on [ServerLoader](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader),
 * Endpoint Middleware, this middleware can be used on a controller method,
 * Endpoint Middleware Error, this middleware can be used on a controller method.

## Specifics parameters decorators

Signature | Example | Description | Express analogue
--- | --- | --- | ---
`@Err()` | `useMethod(@Err() err: any) {}` | Inject the `Express.Err` service. (Decorator for middleware).| `function(err, request, response, next) {}`
`@ResponseData()` | `useMethod(@ResponseData() data: any)` | Provide the data returned by the previous middlewares.
`@EndpointInfo()` | `useMethod(@EndpointInfo() endpoint: Endpoint)` | Provide the endpoint settings.

## Declaring a global middleware 

Global middlewares and Endpoint middlewares are almost similar but Global middleware cannot use the `@EndpointInfo` decorator.
Global middlewares let you to manage request and response on [`ServerLoader`](https://github.com/Romakita/ts-express-decorators/wiki/Class:-ServerLoader).

Create your middleware:
```typescript
import {IMiddleware, Middleware, Request, ServerSettingsService} from "ts-express-decorators";
import {NotAcceptable} from "ts-httpexceptions";

@Middleware()
export default class GlobalAcceptMimesMiddleware implements IMiddleware {
   
   constructor(private serverSettingsService: ServerSettingsService) {

   }

   use(@Request() request) {

        this.serverSettingsService.acceptMimes
            .forEach((mime) => {
                if (!request.accepts(mime)) {
                    throw new NotAcceptable(mime);
                }
            });
   }
}
```

Then, add your middleware in `ServerLoader`:

```typescript
@ServerSettings({
   rootDir,
   mount: {
      '/rest': `${rootDir}/controllers/**/**.js`
   },
   componentsScan: [
       `${rootDir}/services/**/**.js`,
       `${rootDir}/middlewares/**/**.js`
   ],
   acceptMimes: ['application/json']  // add your custom configuration here
})
export class Server extends ServerLoader {
   $onMountingMiddlewares() {
       this.use(GlobalAcceptMimeMiddleware);
   }
}       
```
## Declaring a global error middleware

`@MiddlewareError()` let you to handle all error when you add your middleware in you [ServerLoader]().
It's new way (and recommanded) to handle errors.

Create your middleware error:
```typescript
import {IMiddleware, MiddlewareError, Request, Response, Next, Err} from "ts-express-decorators";
import {Exception} from "ts-httpexceptions";
import {$log} from "ts-log-debug";

@MiddlewareError()
export default class GlobalErrorHandlerMiddleware implements IMiddlewareError {

    use(
        @Err() error: any,
        @Request() request: Express.Request,
        @Response() response: Express.Response,
        @Next() next: Express.NextFunction
    ): any {

        if (response.headersSent) {
            return next(error);
        }

        const toHTML = (message = "") => message.replace(/\n/gi, "<br />");

        if (error instanceof Exception) {
            $log.error("" + error);
            response.status(error.status).send(toHTML(error.message));
            return next();
        }

        if (typeof error === "string") {
            response.status(404).send(toHTML(error));
            return next();
        }

        $log.error("" + error);
        response.status(error.status || 500).send("Internal Error");

        return next();
    }
}
```

Then, add your middleware in `ServerLoader`:

```typescript
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
   $afterRoutesInit() {
       this.use(GlobalErrorHandlerMiddleware);
   }
}       
```

## Declaring a middleware for an endpoint
### Simple use case

Middleware for an endpoint let you to manage request and response directly on a method controller. In most case you will create a middleware to do something on request or response like that:

```typescript
import {IMiddleware, Middleware, Response, ServerSettingsService} from "ts-express-decorators";
import {NotAcceptable} from "ts-httpexceptions";

@Middleware()
export default class AcceptMimesMiddleware implements IMiddleware {
   
   constructor(private serverSettingsService: ServerSettingsService) {

   }

   use(@Request() request) {

        this.serverSettingsService.acceptMimes
            .forEach((mime) => {
                if (!request.accepts(mime)) {
                    throw new NotAcceptable(mime);
                }
            });
   }
}
```
> This middleware is the same as the GlobalAcceptMimesMiddleware.

Then, add your middleware on your endpoint controller's:

```typescript
import {Controller, Get} from "ts-express-decorators";

@Controller('/test')
class MyCtrl {
   @Get('/')
   @UseBefore(AcceptMimesMiddleware)
   getContent() {}
}     
```

### Create your own decorator

The previous example work fine in most case, but it doesn't allow us to configure specific parameters for an endpoint. To do that, we need to use the Endpoint API, `@EndpointInfo()` and create our custom decorator.

#### 1) Create your decorator

To do that we'll proposed a new decorator that take the configuration and wrap the `@UseBefore` decorator as following:

```typescript
// decorators/accept-mimes.ts
import {Endpoint, UseBefore} from "ts-express-decorators";
import AcceptMimesMiddleware from "../middlewares/accept-mimes";

export function AcceptMimes(...args: string[]) {
    return (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
        // Store parameters with Endpoint API metadata.
        Endpoint.setMetadata(AcceptMimesMiddleware, mimes, target, targetKey);

        // Wrap the UseBefore decorator to push the middleware before the endpoint execution.
        return UseBefore(AcceptMimeMiddleware)(target, targetKey, descriptor);
    };
}
```

#### 2) Create your middleware

```typescript
// middlewares/accept-mimes.ts
import {IMiddleware, Middleware, EndpointInfo, Endpoint, Request} from "ts-express-decorators";
import {NotAcceptable} from "ts-httpexceptions";

@Middleware()
export default class AcceptMimesMiddleware implements IMiddleware {
   use(@Request() request, @EndpointInfo() endpoint: Endpoint) {
       
        // get the parameters stored for the current endpoint.
        const mimes = endpoint.getMetadata(AcceptMimeMiddleware) || [];

        mimes.forEach((mime) => {
            if (!request.accepts(mime)) {
                throw new NotAcceptable(mime);
            }
        });
   }
}
```

#### 3) Use the decorator on you method Controller

```typescript
import {Controller, Get} from "ts-express-decorators";
import {AcceptMimes} from "../decorators/accept-mimes";

@Controller('/test')
class MyCtrl {
   @Get('/')
   @AcceptMimes('application/json')
   getContent() {}
}     
```
> Now our middleware is configurable via decorator !

With this method you can create your own decorators. **You can propose your own decorators and middlewares via Pull Request or via an new issue.**

### How to format the Response with middleware

In next part, we see how we can create a decorator and middleware to check the mime of the request. In this part, we'll see how we can use a decorator and middleware to change the response format. To do that, we take as example the `ResponseViewMiddleware` implemented in TsExpressDecorators.

Here the code of the middleware:
```typescript
// middlewares/response-view.ts

import {IMiddleware, Middleware, ResponseData, Response, EndpointInfo, Endpoint} from "ts-express-decorators";
import {InternalServerError} from "ts-httpexceptions";

@Middleware()
export default class ResponseViewMiddleware implements IMiddleware {

    public use(
        @ResponseData() data: any, // handle the response data sent by the previous middleware
        @EndpointInfo() endpoint: Endpoint,    
        @Response() response: Express.Response
    ) {
        // prevent error when response is already sent
        if (response.headersSent) {
           return;
        }

        return new Promise((resolve, reject) => {

            const {viewPath, viewOptions} = endpoint.getMetadata(ResponseViewMiddleware);

            if (viewPath !== undefined) {

                if (viewOptions !== undefined ) {
                    data = Object.assign({}, data, viewOptions);
                }

                response.render(viewPath, data, (err, html) => {

                    if (err) {
                        reject(new InternalServerError("Error on your template =>" + err));

                    } else {
                        resolve(html);
                    }

                });
            } else {
                resolve();
            }
        });

    }
}
```
And his decorator:
```typescript
// middlewares/response-view.ts
import {Endpoint, UseAfter} from "ts-express-decorators";
import ResponseViewMiddleware from "../middlewares/response-view";

export function ResponseView(viewPath: string, viewOptions?: Object): Function {

    return (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
        // store parameters
        Endpoint.setMetadata(ResponseViewMiddleware, {viewPath, viewOptions}, target, targetKey);

        // Wrap the UserAfter decorator to push the middleware after the endpoint execution
        return UseAfter(ResponseViewMiddleware)(target, targetKey, descriptor);
    };
}
```

Finally, we can use this decorator on a controller:

```typescript
import {Controller, Get} from "ts-express-decorators";
import {ResponseView} from "../decorators/response-view";

@Controller('/test')
class MyCtrl {
   @Get('/')
   @ResponseView('path/to/page.html')
   getContentHTML() {
      return {data: ... } // will stored to the responseData. Use @ResponseData to retrieve the stored data.
   }
}  
```
## Declaring an error middleware for an endpoint

`@MiddlewareError()` let you to handle all error when you add your middleware on an Endpoint.

Create your middleware error:
```typescript
import {IMiddleware, MiddlewareError, Request, Response, Next, Err} from "ts-express-decorators";
import {NotFound} from "ts-httpexceptions";
import {$log} from "ts-log-debug";

@MiddlewareError()
export default class ErrorMiddleware implements IMiddlewareError {

    use(
        @Err() error: any,
        @Request() request: Express.Request,
        @Response() response: Express.Response,
        @Next() next: Express.NextFunction
    ): any {

        if (response.headersSent) {
            return next(error);
        }
        const toHTML = (message = "") => message.replace(/\n/gi, "<br />");

        if (error instanceof Exception) {
            $log.error("" + error);
            response.status(error.status).send(toHTML(error.message));
            return next();
        }

        if (typeof error === "string") {
            response.status(404).send(toHTML(error));
            return next();
        }

        $log.error("" + error);
        response.status(error.status || 500).send("Internal Error");

        return next();
          
    }
}
```

Then, add your middleware on your endpoint controller's:

```typescript
import {Controller, Get} from "ts-express-decorators";
import {NotFound} from "ts-httpexceptions";

@Controller('/test')
class MyCtrl {
   @Get('/')
   @UseAfter(ErrorMiddleware)
   getContent() {
      throw NotFound('Content not found');
   }
}     
```

