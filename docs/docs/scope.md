# Scope

The [@Scope](docs/api/common/mvc/scope) change the behavior of a [Provider](docs/api/common/di/provider.md) like a Service, Controller or Middleware.

All providers are created one time when the server initialisation (Singleton pattern).

But [@Scope](docs/api/common/mvc/scope) decorator change that. It's mean, your Service, Controller or Middleware will be 
created each time according to the scope configuration. Actually, the only scope supported is `request`. 
So for each incoming request, a new instance of the provider will be created.

## Example

This example is available for Middleware and Controller.

```typescript
@Middleware()
@Scope("request") 
export class TokenMiddleware implements IMiddleware {
    // Inject service into middleware
    constructor(public userDetailsService: UserDetailsService) { }

    use(@Request() request: Express.Request,
        @EndpointInfo() endpoint: Endpoint,
        @Response() response: Express.Response,
        @Next() next: Express.NextFunction) {
        ...
        this.userDetailsService.profile = user;
        ...
    }
}
```
> In this case, the TokenMiddleware will created for each new request.

## With a Service

For the Service, it's almost the case of the previous example, but you need to keep in mind this point:

!> `@Scope` on service work only if the provider that uses it's annotated by `@Scope` decorator too.

```typescript
@Service()
@Scope("request") 
export class UserDetailsService {
   ...
}

@Middleware()
@Scope("request") // (1)
export class TokenMiddleware implements IMiddleware {
    // Inject service into middleware
    constructor(public userDetailsService: UserDetailsService) { }

    use(@Request() request: Express.Request,
        @EndpointInfo() endpoint: Endpoint,
        @Response() response: Express.Response,
        @Next() next: Express.NextFunction) {
        ...
        this.userDetailsService.profile = user;
        ...
    }
}
```
!> <sup>(1)</sup> Leaving out `@Scope("request")` on `TokenMiddleware` will give an [InjectionScopeError](api/common/di/injectionscopeerror.md).

<div class="guide-links">
<a href="#/docs/middlewares/overview">Middlewares</a>
<a href="#/docs/filters">Filters</a>
</div>