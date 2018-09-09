# Scope <Badge text="beta" type="warn"/> <Badge text="Contributors are welcome" />

The scope of a [provider](/docs/provider.md) defines the life cycle and visibility of that bean in the contexts in which it's used.

Ts.ED define two types of scope:

- `singleton`,
- `request`

The scope annotation can be used on the following providers:

- [Service](/docs/services.md)
- [Controller](/docs/controllers.md)
- [Middleware](/docs/middlewares.md)

## Singleton scope

Singleton scope is the default behavior of all providers. That means all providers are create on the server initialization.

```typescript
import {Controller, Scope, ProviderScope} from "@tsed/common";

@Controller("/")
@Scope(ProviderScope.SINGLETON)  // OPTIONAL, leaving this annotation a the same behavior
export class MyController {
    private rand = Math.random() * 100;

    @Get("/random")
    async getValue() {
        return this.rand;
    }
}
```

::: tip Note
In this example all request on `/random` endpoint return the same random value.
:::

## Request scope

Request scope will create a new instance of provider for each request. A new container will be created
and attached to the request. It'll contains all provider annotated by `@Scope("request")`.

### Example

This example is available for Middleware and Controller.

```typescript
import {Controller, Scope, ProviderScope} from "@tsed/common";

@Controller("/")
@Scope(ProviderScope.REQUEST)
export class MyController {
    private rand = Math.random() * 100;

    @Get("/random")
    async getValue() {
        return this.rand;
    }
}
```

Each request on `/random` will return a different random value.

### Chain with Service

It also possible to use `@Scope("request")` on service if your service is injected on a controller
which is annotated by `@Scope("request")` too.

Here a working example:
```typescript
import {Controller, Scope, ProviderScope} from "@tsed/common";

@Service()
@Scope(ProviderScope.REQUEST)
export class MyService {
  public rand = Math.random() * 100;
}

@Controller("/")
@Scope(ProviderScope.REQUEST)
export class MyController {

    contructor(private myService: MyService)

    @Get("/random")
    async getValue() {
        return this.myService.rand;
    }
}
```


And here a unworking example:
```typescript
import {Controller, Scope, ProviderScope} from "@tsed/common";

@Service()
@Scope(ProviderScope.REQUEST)
export class MyService {
  public rand = Math.random() * 100;
}

@Controller("/")
@Scope(ProviderScope.SINGLETON) // SINGLETON avoid all Scope("request") annotation
export class MyController {

    contructor(private myService: MyService)

    @Get("/random")
    async getValue() {
        return this.myService.rand;
    }
}
```

::: warning
The `SINGLETON` annotation avoid the `@Scope("request")` annotation put on MyService.
:::

### Unsupported usecase

The `@Scope("request")` annotation has no effect on:

- Middlewares used on endpoint.
- Global middlewares.
