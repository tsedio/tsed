# Endpoint middleware
### Simple use case

Middleware for an endpoint lets you manage request and response directly on a method controller. In most case you will
create a middleware to do something on request or response like that:

```typescript
import {IMiddleware, Middleware, Request, ServerSettingsService} from "ts-express-decorators";
import {NotAcceptable} from "ts-httpexceptions";

@Middleware()
export class AcceptMimesMiddleware implements IMiddleware {
   
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
@UseBefore(AcceptMimesMiddleware) // global to the controller
class MyCtrl {
   @Get('/')
   @UseBefore(AcceptMimesMiddleware) // only to this endpoint
   getContent() {}
}     
```

> See [middleware call sequence](docs/middlewares/call-sequence.md) for more information.

### Create your own decorator

The previous example work fine in most case, but it doesn't allow us to configure specific parameters for an endpoint. To do that, we need to use the Endpoint API, `@EndpointInfo()` and create our custom decorator.

#### 1) Create your decorator

To do that we'll proposed a new decorator that take the configuration and wrap the `@UseBefore` decorator as following:

```typescript
// decorators/accept-mimes.ts
import {Store, UseBefore} from "ts-express-decorators";
import AcceptMimesMiddleware from "../middlewares/accept-mimes";

export function AcceptMimes(...mimes: string[]) {
    return <T> (target: any, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        Store
            .from(target, targetKey, descriptor)
            .set(AcceptMimesMiddleware, mimes);

        return UseBefore(AcceptMimesMiddleware)(target, targetKey, descriptor);
    };
}

// OR Shorter

export function AcceptMimes(...mimes: string[]) {
    return Store.decorate((store) => {
        store.set(AcceptMimesMiddleware, mimes);
        return UseBefore(AcceptMimesMiddleware)
    });
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
       
        // get the parameters stored for the current endpoint or on the controller.
        const mimes = endpoint.get(AcceptMimesMiddleware) || [];

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

In next part, we see how we can create a decorator and middleware to check the mime of the request. In this part, we'll see how we can use a decorator and middleware to change the response format. To do that, we take as example the `ResponseViewMiddleware` implemented in Ts.ED.

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
        return new Promise((resolve, reject) => {

            const {viewPath, viewOptions} = endpoint.get(ResponseViewMiddleware);

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
import {Endpoint, Store, UseAfter} from "ts-express-decorators";
import ResponseViewMiddleware from "../middlewares/response-view";

export function ResponseView(viewPath: string, viewOptions?: Object): Function {

    return (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> => {
        
        Store
           .from(target, targetKey, descriptor)
           .set(ResponseViewMiddleware, {viewPath, viewOptions});

        // Wrap the UserAfter decorator to push the middleware after the endpoint execution
        return UseAfter(ResponseViewMiddleware)(target, targetKey, descriptor);
    };
    
    // or shorter
    return Store.decorate((store) => {
        store.set(ResponseViewMiddleware, {viewPath, viewOptions});
        // Wrap the UserAfter decorator to push the middleware after the endpoint execution
        return UseAfter(ResponseViewMiddleware)
    });
}
```
> Note: Store is recommended if your decorator can be used in different context.

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


<div class="guide-links">
<a href="#/docs/middlewares/global-error-middleware">Global error middleware</a>
<a href="#/docs/middlewares/endpoint-error-middleware">Endpoint error middleware</a>
</div>



