# Provider

Basically, Service and Factory are a specific configuration of a Provider.
It's possible to register a class as provider, factory or service manually with these functions:

- [registerProvider()](/api/di/registries/registerProvider.md)
- [registerService()](/api/di/registries/registerService.md)
- [registerFactory()](/api/di/registries/registerFactory.md)

## register a provider

This example show you how you can add a service already constructed like a npm module.

```typescript
// MyFooFactory.ts
import {registerProvider} from "@tsed/common";

class MyClass {
    
}
registerProvider({provide: MyClass, useClass: MyClass, type: "customTypeProvider"});
```

> Note: type field is optional

RegisterProvider can be used to change the configuration of a provider:

```typescript
// MyFooFactory.ts
import {registerProvider} from "@tsed/common";

class MyClass {
    
}

class MyFakeClass {
    
}
registerProvider({provide: MyClass, useClass: MyFakeClass});
```
