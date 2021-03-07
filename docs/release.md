#### v6.30.0

- Add @@UseCache@@ decorator.
- Add @@PlatformCache@@ do manage cache.
- Add @@PlatformCacheInterceptor@@.

Ts.ED provide now, a unified cache manager solution based on the awesome [`cache-manager`](https://www.npmjs.com/package/cache-manager).

See our dedicated page on [Cache](/docs/cache.md).

---

#### v6.28.0

- Add middlewares options to the Server configuration. 

Provide a middleware list (Express.js, Ts.ED, Koa, etc...) which must be loaded on the `$beforeRoutesInit` hook or on the specified hook.
In addition, it's also possible to configure the `environment` for which the middleware should be loaded.

Here is an example to load middlewares with the previous version (this example will be always available!):

```typescript
import {Configuration, ProviderScope, ProviderType} from "@tsed/di";
import {Env} from "@tsed/core";

@Configuration({})
export class Server {
  $afterInit(){
    this.app.use(helmet({contentSecurityPolicy: false}))
  }
  $beforeRoutesInit() {
    if (this.env === Env.PROD) {
      this.app.use(EnsureHttpsMiddleware);
    }

    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }))
      .use(AuthTokenMiddleware);

    return null;
  }
}
```

After v6.28.0, you can use the middlewares options as alternative way to load middlewares:

```typescript
import {Configuration, ProviderScope, ProviderType} from "@tsed/di";

@Configuration({
  middlewares: [
    {hook: '$afterInit', use: helmet({contentSecurityPolicy: false})},
    {env: Env.PROD, use: EnsureHttpsMiddleware},
    cors(),
    cookieParser(),
    compress({}),
    methodOverride(),
    bodyParser.json(),
    bodyParser.urlencoded({
      extended: true
    }),
    AuthTokenMiddleware
  ]
})
export class Server {
}
```

::: warning Order priority
The middlewares added through `middlewares` options will always be registered after the middlewares registered through the hook methods!
:::

---

#### v6.26.0

- Add new packages `@tsed/async-hook-context`. See our [documentation over AsyncHookContext](/docs/request-context.md#async-hook-context).

---

#### v6.25.0

- **schema**: Add @@Nullable@@ decorator to declare nullable field.

---

#### v6.24.0

- **formio**: Add new `@tsed/formio` package (pre-release).

---

#### v6.23.0

- **common**: Add host and protocol getters on PlatformRequest ([f742bcb](https://github.com/TypedProject/tsed/commit/f742bcb9a0f2ef88736126065ed380e6121129e0))
- **di**: Add alterAsync method on LocalsContainer ([aeac3b5](https://github.com/TypedProject/tsed/commit/aeac3b53cae4ce39a2164a663a95c274449387d5))
- **swagger**: Add disableSpec option ([164a681](https://github.com/TypedProject/tsed/commit/164a681ac7409a42a0521c69aa7c43c144de6d0e))

---

#### v6.22.0

- Add new packages `@tsed/adapters-redis` ([dd023b1](https://github.com/TypedProject/tsed/commit/dd023b1b159d01e21b3eaec42d8d6e49f42f9280))
- Add readOnly option to FileSyncAdapter ([fbac8c3](https://github.com/TypedProject/tsed/commit/fbac8c360923c96704428bf43be90a400d0cddac))

---

#### v6.21.0

- Add `x-request-id` header to each response.
- Add documentation over Ts.Logger. See [Logger](/docs/logger.md) page.

---

#### v6.20.1

- Fix swagger spec generation when the status code is 204 ([#1175](https://github.com/TypedProject/tsed/issues/1175)).

---

#### v6.20.0

- Add `@tsed/stripe` package. See our [documentation](/tutorials/stripe.md).
- Add `@RawBodyParams` decorator.

---

#### v6.19.0

- Add `@tsed/oidc-provider` package. See our [documentation](/tutorials/oidc.md).
- Add `ctx.request.secure` property to check if the request is secure.

---

#### v6.18.0

- Catch passport errors and transform it to Exception.
- Remove `x-powered-by` header in production profile.
- Add `@tsed/adapters` package. This package will be used by `@tsed/oidc-provider`.

---

#### v6.17.0

- [Declare custom keys on JsonSchema](/docs/models.md#custom-keys).
- [Declare custom validator with Ajv](/docs/ajv.md#user-defined-keywords).

---

#### v6.16.0

Ts.ED uses Ajv 7. 

If you use: 
```typescript
import * as Ajv from "ajv"
```

You have to replace it with:

```typescript
import Ajv from "ajv"
```

---

#### v6.14.1

Fix typings issue with mongoose. 

Since mongoose v5.11.0, the module expose his own file definition and can broke your build! 
To solve it, install latest version of `mongoose` and `@tsed/mongoose` modules then remove the `@types/mongoose` dependencies.

---

#### v6.14.0

- [Manage Groups properties](/docs/models.md#groups).
- [Use functional programming to declare custom schema](/docs/models.md#using-functions).

Example:

```typescript
import {array, number, object, Returns, Schema, string} from "@tsed/schema";

const ProductSchema = object({
  id: string().required().description("Product ID"),
  title: string().required().minLength(3).example("CANON D300").description("Product title"),
  price: number().minimum(0).example(100).description("Product price"),
  description: string().description("Product description"),
  tags: array()
    .minItems(1)
    .items(string().minLength(2).maxLength(10).description("Product tag"))
    .description("Product tags")
})
  .label("ProductModel");
```

---

#### v6.11.0

- Add @@AnyOf@@, @@AllOf@@, @@OneOf@@ and @@For@@ decorators.

@@For@@ decorator allows conditional JsonSchema depending on the JsonSchema/Swagger version:

```typescript
@For(SpecTypes.JSON, oneOf(string(), array().items(string()).maxItems(2)))
@For(SpecTypes.OPENAPI, array().items(string()).maxItems(2))
@For(SpecTypes.SWAGGER, array().items(string()).maxItems(2))
```
