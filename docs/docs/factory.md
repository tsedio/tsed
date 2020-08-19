# Factory

Factory is similar to Service except that the factory uses an already instantiated object and you have to use
the `@Inject()` decorator to inject the factory to other `Service` or `Controller`.

## Declare a factory from an instance

This example shows you how you can add an already constructed service like a npm module.

```typescript
// MyFooFactory.ts
import {registerFactory} from "@tsed/common";

export interface IMyFooFactory {
   getFoo(): string;
}

export type MyFooFactory = IMyFooFactory;
export const MyFooFactory = Symbol("MyFooFactory");

registerFactory(MyFooFactory, {
     getFoo:  () => "test"
});
```
Then inject your factory in another service (or controller):
```typescript
import {Inject, Injectable} from "@tsed/di";
import {MyFooFactory} from "./FooFactory.ts";

@Injectable()
export default class OtherService {
     constructor(@Inject(MyFooFactory) myFooFactory: MyFooFactory){
           console.log(myFooFactory.getFoo()); /// "test"
     }
}
```
::: tip Note
TypeScript transforms and stores `MyFooFactory` as `Function` type in the metadata. So to inject a factory, you must use the @@Inject@@ decorator.
:::

## Built-in Factory

Some factories are built-in Ts.ED. These factories are :

- HttpServer. This is an instance of [Http.Server](https://nodejs.org/dist/latest/docs/api/http.html#http_class_http_server) from `http` module.
- HttpsServer. This is an instance of [Https.Server](https://nodejs.org/dist/latest/docs/api/https.html#https_class_https_server) from `https` module.

## Inject HttpServer or HttpsServer

```typescript
import {HttpServer, Service, Inject} from "@tsed/common";

@Service()
export default class OtherService {
  constructor(@Inject(HttpServer) httpServer: HttpServer){
    
  }
}
```
