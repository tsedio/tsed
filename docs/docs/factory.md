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
