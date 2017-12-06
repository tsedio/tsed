# Scope

The scope of a [provider](docs/api/common/di/provider.md) defines the life cycle and visibility of that bean in the contexts in which it is used.

Ts.ED define two types of scope:

- singleton
- request

The scope annotation can be used on the following providers:

- [Service](docs/services/overview.md)
- [Controller](docs/controllers.md)
- [Middleware](docs/middlewares/overview.md)

## Singleton scope

Singleton scope is the default behavior of all providers. That means all providers are create on the server initialization.

```typescript
@Middleware()
@Scope(ProviderScope.SINGLETON)  // OPTIONAL, leaving this annotation a the same behavior
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

## Request scope

Request scope will create a new instance of the provider for each incoming request.

### Example

This example is available for Middleware and Controller.

```typescript
@Middleware()
@Scope("request")  // or ProviderScope.REQUEST
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

### With a Service

For the Service, it's almost the case of the previous example, but you need to keep in mind this point:

!> `@Scope` on service work only if the provider that uses it's annotated by `@Scope` decorator too.

```typescript
@Service()
@Scope(ProviderScope.REQUEST) 
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