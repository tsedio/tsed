---
head:
  - - meta
    - name: description
      content: Documentation over the server configuration. Ts.ED is built on top of Express/Koa and use TypeScript language.
  - - meta
    - name: keywords
      content: configuration ts.ed express typescript node.js javascript decorators mvc class models
---

# Configuration

The configuration is done via decorators or/and during the bootstrap of your application.

You can configure your server with the `@Configuration` decorator or by using the new `configuration()` function, depending on your needs or preference.

Here are all examples to configure your application:

::: code-group

<<< @/docs/configuration/snippets/server.ts [Decorators]

```typescript [Functional API]
import {configuration, injectable} from "@tsed/di";

configuration({
  mount: {
    "/rest": [
      `./controllers/current/**/*.ts`, // deprecated
      MyController // support manual import
    ],
    "/rest/v0": [
      // versioning
      `./controllers/v0/users/*.js`, // deprecated
      `!./controllers/v0/groups/old/*.ts` // Exclusion
    ]
  }
});
```

<<< @/docs/configuration/snippets/bootstrap.ts [Bootstrap]

:::

::: tip Note
Configuration set during the `.bootstrap()` method will be the default configuration for the application.
Configuration set in the `@Configuration` decorator will be merged with the default configuration.
:::

::: tip Note 2
Ts.ED supports [ts-node](https://github.com/TypeStrong/ts-node). Ts extension will be replaced by a Js extension if
ts-node isn't the runtime.
:::

## Configuration Sources

Since Ts.ED v8.9.0, you can use `@tsed/config` to load configuration from different sources (files, environment variables, redis, etc.).

See the [Configuration Sources](/docs/configuration/configuration-sources.md) page for more information.

::: warning Legacy
For Ts.ED under v8.9.0, read the following [Load configuration from file](/docs/configuration.html#load-configuration-from-file) page.
:::

## Server options

See all available options in the [ServerOptions](/docs/configuration/server-options.md) page.

## Specific Platform options

See specific platform options for:

- [Express.js](/docs/configuration/express.md)
- [Koa.js](/docs/configuration/koa.md)
- [Fastify.js](/docs/configuration/fastify.md)

## Get configuration

The configuration can be reused throughout your application in different ways.

- With dependency injection in [Controller](/docs/controllers), [Middleware](/docs/middlewares)
  , [Pipe](/docs/pipes) or any [Injectable](/docs/providers) services.
- With the decorators @@Constant@@ and @@Value@@.

### From service

::: code-group

```typescript [Decorators]
import {Configuration, Injectable} from "@tsed/di";

@Injectable()
export class MyService {
  constructor(@Configuration() configuration: Configuration) {}
}
```

```typescript [Functional API]
import {configuration, injectable} from "@tsed/di";

export class MyService {
  constructor() {
    const settings = configuration();
  }
}

injectable(MyService);
```

:::

### From decorators

Decorators @@Constant@@ and @@Value@@ can be used in all classes including:

- [Provider & Service](/docs/providers),
- [Interceptor](/docs/interceptors),
- [Controller](/docs/controllers),
- [Middleware](/docs/middlewares).

@@Constant@@ and @@Value@@ accepts an expression as parameters to inspect the configuration object and return the value.

::: code-group

```ts [Decorators]
import {Env} from "@tsed/core";
import {Constant, Value, Injectable} from "@tsed/di";

@Injectable()
export class MyService {
  @Constant("env")
  env: Env;

  @Value("swagger.path")
  swaggerPath: string;

  $onInit() {
    console.log(this.env);
  }
}
```

```ts [Functional API]
import {constant, refValue, injectable} from "@tsed/di";
import {Env} from "@tsed/core";

export class MyClass {
  env = constant<Env>("env");
  swaggerPath = refValue<string>("swagger.path");

  $onInit() {
    console.log(this.env);
  }
}

injectable(MyClass);
```

:::

::: warning
@@Constant@@ returns an Object.freeze() value.
:::
