[Home](https://github.com/Romakita/ts-express-decorators/wiki) > [API References](https://github.com/Romakita/ts-express-decorators/wiki/API-references) > InjectorService

> This service is available since v1.3.x

This service contain all services collected by `@Service` or services declared manually with `InjectorService.factory()` or `InjectorService.service()`.

Example:
```typescript
import {InjectorService} from "ts-express-decorators";

// Import the services (all services are decorated with @Service()";
import MyService1 from "./services/service1";
import MyService2 from "./services/service2";
import MyService3 from "./services/service3";

// When all services is imported you can load InjectorService.
InjectorService.load();

const myService1 = InjectorService.get<MyService1>(MyServcice1);

```
> Note: `ServerLoader` make this automatically when you use `ServerLoader.mount()` method (or settings attributes) and load services and controllers during the starting server.

## Methods

#### `InjectorService.invoke<T>(target [, locals [, designParamTypes]]): T`

Invoke the class and inject all services that required by the class constructor.

**Parameters**

Param | Type | Details
---|---|---
target | `string|number` | The injectable class to invoke. Class parameters are injected according constructor signature.
locals | `Map<Function, any>` | Optional object. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.
designParamTypes | `any[]` | Optional object. List of injectable types.

**Return**

The class constructed.

**Example**
```typescript
import {InjectorService} from "ts-express-decorators";
import MyService from "./services";

class OtherService {
   constructor(injectorService: InjectorService) {
      const myService = injectorService.invoke<MyService>(MyService); 
   } 
}
```

***

#### `InjectorService.invokeMethod(method, options): any`

Invoke a class method and inject service.

**Parameters**

Param | Type | Details
---|---|---
method | `*` | The injectable method to invoke. Method parameters are injected according method signature.
options | `IInjectableMethod | any[]` | Object to configure the invocation. 

IInjectableMethod options:

 * **target**: Optional. The class instance.
 * **methodName**: `string` Optional. The method name.
 * **designParamTypes**: `any[]` Optional. List of injectable types.
 * **locals**: `Map<Function, any>` Optional. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted. 

**Return**

The returned result by the method.

**Example**
```typescript
import {InjectorService} from "ts-express-decorators";

class MyService {
   constructor(injectorService: InjectorService) {

      injectorService.invokeMethod(this.method, {
          this,
          methodName: 'method'
      });
   } 
   
   method(otherService: OtherService) {}
}
```
***

#### `InjectorService.get<T>(target): T`

Get a service already constructed.

**Parameters**

Param | Type | Details
---|---|---
target | `*` | The service class.

**Return**

The class already constructed

**Example**
```typescript
import {InjectorService} from "ts-express-decorators";
import MyService from "./services";

class OtherService {
   constructor(injectorService: InjectorService) {

      const myService = injectorService.get<MyService>(MyService);

   }
}
```

***

#### `InjectorService.has(target): boolean`

Check if the service exists in `InjectorService`.

**Parameters**

Param | Type | Details
---|---|---
target | `*` | The service class.

**Example**
```typescript
import {InjectorService} from "ts-express-decorators";
import MyService from "./services";

class OtherService {
   constructor(injectorService: InjectorService) {

      const exists = injectorService.has(MyService); // true or false

   }
}
```

## Statics Methods

#### `InjectorService.invoke<T>(target [, locals [, designParamTypes]]): T`

Invoke the class and inject all services that required by the class constructor.

**Parameters**

Param | Type | Details
---|---|---
target | `string|number` | The injectable class to invoke. Class parameters are injected according constructor signature.
locals | `Map<Function, any>` | Optional object. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.
designParamTypes | `any[]` | Optional object. List of injectable types.

**Return**

The class constructed.

**Example**
```typescript
import {InjectorService} from "ts-express-decorators";
import MyService from "./services";

const myService = InjectorService.invoke<MyService>(MyService); 
```

***

#### `InjectorService.invokeMethod(method, options): any`

Invoke a class method and inject service.

**Parameters**

Param | Type | Details
---|---|---
method | `*` | The injectable method to invoke. Method parameters are injected according method signature.
options | `IInjectableMethod | any[]` | Object to configure the invocation. 

IInjectableMethod options:

 * **target**: Optional. The class instance.
 * **methodName**: `string` Optional. The method name.
 * **designParamTypes**: `any[]` Optional. List of injectable types.
 * **locals**: `Map<Function, any>` Optional. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted. 

**Return**

The returned result by the method.

**Example**
```typescript
import {InjectorService} from "ts-express-decorators";

class MyService {
   constructor(injectorService: InjectorService) {

   } 
   
   method(otherService: OtherService) {}
}

const myService = InjectorService.invoke<MyService>(MyService);

injectorService.invokeMethod(myService.method, {
   myService,
   methodName: 'method'
});
```

***

#### `InjectorService.get<T>(target): T`

Get a service already constructed.

**Parameters**

Param | Type | Details
---|---|---
target | `*` | The service class.

**Return**

The class already constructed

**Example**
```typescript
import {InjectorService} from "ts-express-decorators";
import MyService from "./services";

const myService = InjectorService.get<MyService>(MyService);
```

***

#### `InjectorService.has(target): boolean`

Check if the service exists in `InjectorService`.

**Parameters**

Param | Type | Details
---|---|---
target | `*` | The service class.

**Example**
```typescript
import {InjectorService} from "ts-express-decorators";
import MyService from "./services";

const exists = InjectorService.has(MyService); // true or false
```

***

#### `InjectorService.factory(target, instance): InjectorService`

Add a new factory in `InjectorService` registry.

**Parameters**

Param | Type | Details
---|---|---
target | `symbol|Function` | The symbol or class associated to the instance.
instance | `any` | The instance already constructed, associated to the target.

**Example with symbol definition**

```typescript
import {InjectorService} from "ts-express-decorators";

export interface IMyFooFactory {
   getFoo(): string;
}

export type MyFooFactory = IMyFooFactory;
export const MyFooFactory = Symbol("MyFooFactory");

InjectorService.factory(MyFooFactory, {
     getFoo:  () => "test"
});

@Service()
export class OtherService {
     constructor(@Inject(MyFooFactory) myFooFactory: MyFooFactory){
           console.log(myFooFactory.getFoo()); /// "test"
     }
}
```
> Note: When you use the factory method with Symbol definition, you must use the `@Inject()` decorator to retrieve your factory in another Service. Advice: By convention all factory class name will be prefixed by `Factory`.

**Example with class**
```typescript
import {InjectorService} from "ts-express-decorators";

export default class MyFooService {
    constructor(){}
    getFoo() {
        return "test";
    }
}

InjectorService.factory(MyFooService, new MyFooService());

@Service()
export class OtherService {
     constructor(myFooService: MyFooService){
           console.log(myFooFactory.getFoo()); /// "test"
     }
}
```

***

#### `InjectorService.service(target): InjectorService`

Add a new service in the registry. This service will be constructed when `InjectorService` will loaded.

**Parameters**

Param | Type | Details
---|---|---
target | `symbol|Function` | The class to add in registry.

**Example**

```typescript
import {InjectorService} from "ts-express-decorators";

export default class MyFooService {
    constructor(){}
    getFoo() {
        return "test";
    }
}

InjectorService.service(MyFooService);

InjectorService.load();

const myFooService = InjectorService.get<MyFooService>(MyFooService);
myFooService.getFoo(); // test
```

