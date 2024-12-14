---
head:
  - - meta
    - name: description
      content: What's new in v8? The latest releases for Ts.ED focus on improved dependency injection that let you access the injector instance everywhere in your code. Notable features in recent pre-releases include support for Apollo 4, the removal of CommonJS support in favor of ECMAScript Modules, enhanced request logging, and additional optimizations to reduce code size.
  - - meta
    - name: keywords
      content: news features v8 ts.ed framework express typescript node.js javascript decorators mvc class models providers pipes middlewares testing developer
---

# What's new in v8 ?

The latest releases for Ts.ED focus on improved dependency injection that let you access the
[injector instance everywhere](#injector-instance-everywhere) in your code. Notable features in recent pre-releases
include support for [Apollo 4](/tutorials/graphql.html#apollo), the removal of CommonJS support in favor of
[ECMAScript Modules](/introduction/migrate-from-v7#switch-your-code-base-on-esm), enhanced [request logging](/introduction/migrate-from-v7#request-logger-doesn-t-work), and additional [optimizations](/introduction/migrate-from-v7#optimization)
to reduce code size.

We have also rethought the hooks feature to make it more useful and easier to use.
Now, you can use the [`@tsed/hooks`](/docs/hooks) package to subscribe to hooks outside the DI context.

Additionally, some deprecated methods and packages were removed or updated to be aligned with new DI functions (aka [Functional API](/docs/providers.md)).
For further details, you can view the full release notes here.

See the [migration guide](/introduction/migrate-from-v7) to upgrade your application to v8.

## Injector instance everywhere

In v7, the injector service in only available in a DI context execution (in a controller, service, middleware, etc.).
If you need to access to the injector instance everywhere, you have to get the injector and store it into a global
variable during the bootstrap like this:

```ts
async function bootstrap() {
  try {
    const platform = await PlatformExpress.bootstrap(Server);
    // Store the injector instance
    global.injector = platform.injector;

    await platform.listen();

    process.on("SIGINT", () => {
      platform.stop();
    });
  } catch (error) {
    $log.error({event: "SERVER_BOOTSTRAP_ERROR", message: error.message, stack: error.stack});
  }
}

bootstrap();
```

But, this example isn't recommended because it's a global variable and the injector isn't available while the server
isn't bootstrapped. They may lead to unexpected behavior.

Ts.ED v8 solves this problem by creating the injector on the fly when you need it in your code. V8 provides new
utilities to get the injector instance:

```ts
import {injector, inject} from "@tsed/di";
import {MyService} from "./services/MyService.js";

const myService = injector().get(MyService);
// short version
const myService = inject(MyService);
```

With v7, you write your service using decorators like this:

```ts
import {Injectable, Configuration, Constant, Inject} from "@tsed/di";

@Injectable()
// @Scope(ProviderScope.SINGLETON) // or Scope.REQUEST or Scope.INSTANcE
export class MyService {
  @Configuration()
  private settings: PlatformConfiguration;

  @Constant("myConstant", "default")
  private myConstant: string;

  @Inject()
  private repository: MyReposity;

  constructor() {
    console.log(this.settings); // undefined available in v7 but defined in v8
    console.log(this.myConstant); // undefined available in v7 but defined in v8
    console.log(this.repository); // undefined available in v7 but defined in v8
  }

  $onInit() {
    console.log(this.settings); // defined
    console.log(this.myConstant); // defined
    console.log(this.repository); // defined
  }
}
```

This code will work in v8 without any changes. But now, you can also write your code like this:

```ts
import {injectable, inject, configuration, constant} from "@tsed/di";
import {MyRepository} from "./inject-model.js";
import {injector} from "./injector.js";

export class MyService {
  private settings = configuration();
  private myConstant = constant("myConstant", "default");
  private repository = inject(MyRepository);

  constructor() {
    console.log(this.settings);
    console.log(this.myConstant);
    console.log(this.repository);
  }
}

injectable(MyService); // .scope(Scope.SINGLETON) by default
```

::: tip
Note in this case, that the types of each property (settings, myConstant, repository) are automatically inferred from
the utility function used to declare them.
:::

For more details on the new v8 DI api see the [Provider page](/docs/providers).

## A new way to declare factory

In v8, we introduce a new way to declare factory using the functional API. This new API is more flexible and allows
you to declare providers in a more concise way. Also, the typing is improved!

Here is an example of how to declare a provider using the new API:

```ts
import {constant, injectable} from "@tsed/di";
import {DatabaseConnection, Options} from "connection-lib";

export const CONNECTION = injectable<DatabaseConnection>(Symbol.for("CONNECTION"))
  .factory(() => {
    const options = constant<Options>("myOptions");

    return new DatabaseConnection(options);
  })
  .hooks({
    $onDestroy(connection) {
      return connection.close();
    }
  })
  .token(); // return the created token
```

Here is an example of how to declare a provider using the old API:

```ts
import {Configuration, registerProvider} from "@tsed/di";
import {DatabaseConnection} from "connection-lib";

export const CONNECTION = Symbol.for("CONNECTION");

registerProvider<DatabaseConnection>({
  provide: CONNECTION,
  deps: [Configuration],
  useFactory(configuration: Configuration) {
    const options = configuration.get<any>("myOptions");

    return new DatabaseConnection(options);
  },
  hooks: {
    $onDestroy(connection) {
      return connection.close();
    }
  }
});
```

## Hooks everywhere

Hooks are a way to subscribe to events in your application. In v8, we introduce a new way to declare hooks using the
`@tsed/hooks` package. This new API is more flexible and allows you to declare hooks anywhere in your application.

Here is an example of how to declare a hook using the new API:

```ts
import {$on} from "@tsed/hooks";

$on("$beforeInit", () => {
  // do something
});
```

You can also now subscribe to three new hooks: `$beforeInvoke`, `$afterInvoke`, and `$beforeInvoke:${type}`.

For example, `$beforeInvoke` and `$afterInvoke` allow you to perform some actions before and after the invocation of the injectable class/factory/async factory.

These hooks can be listened for all tokens or for a specific token:

```typescript
import type {TokenProvider, ResolvedInvokeOptions} from "@tsed/di";
import {$on} from "@tsed/hooks";

// triggered for all tokens
$on("$beforeInvoke", (token: TokenProvider, resolvedOpts: ResolvedInvokeOptions) => {
  // do something
});

// triggered for a specific token

@Injectable()
class MyService {}

$on("$beforeInvoke", MyService, (token: TokenProvider, resolvedOpts: ResolvedInvokeOptions) => {
  // do something
  console.log(token === MyService); // true
});
```

See more about hooks [here](/docs/hooks).

## Optimization

V8 comes with numerous optimizations to reduce the code size.
But to not break your code, we have to keep some features through the `@tsed/common` package.

V8 adds a new package `@tsed/platform-http` that contains all the features related to the HTTP platform but without extra Ts.ED dependencies.

Here is list of optimization of `@tsed/platform-http`:

- PlatformTest can be imported from `@tsed/platform-http/testing` instead of `@tsed/common`.
  - It means that you have to replace `import {PlatformTest} from "@tsed/common"` by `import {PlatformTest} from "@tsed/platform-http/testing"`.
  - PlatformTest isn't embedded in the production runtime anymore.
- doesn't re-export all classes/decorators from
  - `@tsed/schema`
  - `@tsed/di`
  - `@tsed/platform-exceptions`,
  - `@tsed/platform-middlewares`,
  - `@tsed/platform-params`,
  - `@tsed/platform-response-filter`,
  - `@tsed/platform-router`
  - `@tsed/logger`
- doesn't import `@tsed/logger-file`

Using `@tsed/platform-http` you'll be able to reduce the size of your application, control the embed Ts.ED dependencies and improve the startup time.

See more about the [migration guide](/introduction/migrate-from-v7#optimization) to upgrade your application to v8.
