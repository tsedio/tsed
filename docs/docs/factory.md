# Factory

Factory is similar to Service except that the factory uses an already instantiated object and you have to use
the `@Inject()` decorator to inject the factory to other `Service` or `Controller`.

## Declare a factory from an instance

This example shows you how you can add an already constructed service like a npm module.

```typescript
// MyFooFactory.ts
import {registerProvider} from "@tsed/common";

export interface MyFooFactory {
  getFoo(): string;
}

export const MyFooFactory = Symbol("MyFooFactory");

registerProvider(MyFooFactory, {
  getFoo: () => "test"
});
```

Then inject your factory in another service (or controller):

```typescript
import {Inject, Injectable} from "@tsed/di";
import {MyFooFactory} from "./FooFactory.ts";

@Injectable()
export default class OtherService {
  constructor(@Inject(MyFooFactory) myFooFactory: MyFooFactory) {
    console.log(myFooFactory.getFoo()); /// "test"
  }
}
```

::: tip
Note TypeScript transforms and stores `MyFooFactory` as `Function` type in the metadata. So to inject a factory,
you must use the @@Inject@@ decorator.
:::

## Built-in Factory

Some factories are built-in Ts.ED. These factories are :

- HttpServer. This is an instance
  of [Http.Server](https://nodejs.org/dist/latest/docs/api/http.html#http_class_http_server) from `http` module.
- HttpsServer. This is an instance
  of [Https.Server](https://nodejs.org/dist/latest/docs/api/https.html#https_class_https_server) from `https` module.

## Inject Http.Server or Https.Server

```typescript
import {Injectable} from "@tsed/di";
import Http from "http";
import Https from "https";

@Injectable()
export default class OtherService {
  @Inject(Http.Server)
  httpServer: Http.Server | null;

  @Inject(Https.Server)
  httpsServer: Https.Server | null;

  $onInit() {
    if (this.httpServer) {
      console.log("HTTP");
    }
    if (this.httpsServer) {
      console.log("HTTPS");
    }
  }
}
```
