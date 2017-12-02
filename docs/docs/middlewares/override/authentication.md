# Authentication

The annotation [`@Authenticated()`](api/common/mvc/authenticated.md) use the [`AuthenticatedMiddleware`](api/common/mvc/authenticatedmiddleware.md) 
to check the authentication strategy. 

To customise this behavior, the right way is to override the default `AuthenticatedMiddleware` then implement directly 
your authentication strategy (with [passport.js for example](tutorials/passport.md)).

## Use case

```typescript
@ControllerProvider("/mypath")
class MyCtrl {
  @Get("/")
  @Authenticated({role: "admin"})
  public getResource(){}
}
```

## Example

```typescript
import {OverrideMiddleware, AuthenticatedMiddleware} from "ts-express-decorators";
import {Forbidden} from "ts-httpexceptions";

@OverrideMiddleware(AuthenticatedMiddleware)
export class MyAuthenticatedMiddleware implements IMiddleware {
    public use(@EndpointInfo() endpoint: EndpointMetadata,
               @Request() request: Express.Request,
               @Response() response: Express.Response,
               @Next() next: Express.NextFunction) { // next is optional
        
        // options given to the @Authenticated decorator
        const options = endpoint.get(AuthenticatedMiddleware) || {};
        // options => {role: 'admin'}
        
        if (!request.isAuthenticated()) { // passport.js
          throw new Forbidden("Forbidden")  
        }
        
        next();
    }
}
```

### Other examples

* [Send response](docs/middlewares/override/send-response.md)
* [Response view](docs/middlewares/override/response-view.md)
* [Global error handler](docs/middlewares/override/global-error-handler.md)

<div class="guide-links">
<a href="#/docs/converters">Converters</a>
<a href="#/docs/filters">Filters</a>
</div>