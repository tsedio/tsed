# Provider

Basically, Service and Factory are a specific configuration of a Provider.
It's possible to register a class as provider, factory or service manually with these functions:

- [registerProvider()](/api/common/di/providerregistry.md)
- [registerService()](/api/common/di/providerregistry.md)
- [registerFactory()](/api/common/di/providerregistry.md)

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
