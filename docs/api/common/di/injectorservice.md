
<header class="symbol-info-header"><h1 id="injectorservice">InjectorService</h1><label class="symbol-info-type-label service">Service</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { InjectorService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/di/services/InjectorService.ts#L0-L0">/common/di/services/InjectorService.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> InjectorService <span class="token keyword">extends</span> <a href="#api/core/proxyregistry"><span class="token">ProxyRegistry</span></a><<a href="#api/common/di/provider"><span class="token">Provider</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> <a href="#api/common/di/iprovider"><span class="token">IProvider</span></a><<span class="token keyword">any</span>>> <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    invoke<T><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> locals?<span class="token punctuation">:</span> Map<Function<span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">,</span> designParamTypes?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    <span class="token function">invokeMethod</span><span class="token punctuation">(</span>handler<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> options<span class="token punctuation">:</span> <a href="#api/common/di/iinjectablemethod"><span class="token">IInjectableMethod</span></a><<span class="token keyword">any</span>> | <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> get<span class="token punctuation">:</span> <T><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> => T<span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">invokeMethod</span><span class="token punctuation">(</span>handler<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> options<span class="token punctuation">:</span> <a href="#api/common/di/iinjectablemethod"><span class="token">IInjectableMethod</span></a><<span class="token keyword">any</span>> | <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token function">load</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise<<span class="token keyword">any</span>><span class="token punctuation">;</span>
    <span class="token keyword">static</span> invoke<T><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> locals?<span class="token punctuation">:</span> Map<<span class="token keyword">string</span> | Function<span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">,</span> designParamTypes?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> requiredScope?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    <span class="token keyword">static</span> construct<T><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">emit</span><span class="token punctuation">(</span>eventName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> ...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise<<span class="token keyword">any</span>><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">buildRegistry</span><span class="token punctuation">(</span>registry<span class="token punctuation">:</span> <a href="#api/core/registry"><span class="token">Registry</span></a><<a href="#api/common/di/provider"><span class="token">Provider</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">,</span> callback?<span class="token punctuation">:</span> <span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <a href="#api/common/di/provider"><span class="token">Provider</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span> => <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/core/registry"><span class="token">Registry</span></a><<a href="#api/common/di/provider"><span class="token">Provider</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">set</span><span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <a href="#api/common/di/iprovider"><span class="token">IProvider</span></a><<span class="token keyword">any</span>> | <span class="token keyword">any</span><span class="token punctuation">,</span> instance?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof InjectorService<span class="token punctuation">;</span>
    get<T><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><T> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    <span class="token keyword">static</span> has<span class="token punctuation">:</span> <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> => <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">load</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise<<span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span>><span class="token punctuation">;</span>
    <span class="token function">emit</span><span class="token punctuation">(</span>eventName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> ...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise<<span class="token keyword">any</span>><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">service</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">factory</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> instance<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

This service contain all services collected by `@Service` or services declared manually with `InjectorService.factory()` or `InjectorService.service()`.

### Example:

```typescript
import {InjectorService} from "@tsed/common";

// Import the services (all services are decorated with @Service()";
import MyService1 from "./services/service1";
import MyService2 from "./services/service2";
import MyService3 from "./services/service3";

// When all services is imported you can load InjectorService.
InjectorService.load();

const myService1 = InjectorService.get<MyService1>(MyServcice1);
```

> Note: `ServerLoader` make this automatically when you use `ServerLoader.mount()` method (or settings attributes) and load services and controllers during the starting server.

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">invoke<T><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> locals?<span class="token punctuation">:</span> Map<Function<span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">,</span> designParamTypes?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T</code></pre>
</div>


Param | Type | Description
---|---|---
 target|<code>any</code>|The injectable class to invoke. Class parameters are injected according constructor signature.
 locals|<code>Map<Function</code>|Optional. object. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.
 designParamTypes|<code>any[]</code>|Optional. object. List of injectable types.





Invoke the class and inject all services that required by the class constructor.

#### Example

```typescript
import {InjectorService} from "@tsed/common";
import MyService from "./services";

class OtherService {
    constructor(injectorService: InjectorService) {
         const myService = injectorService.invoke<MyService>(MyService);
     }
 }
```




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">invokeMethod</span><span class="token punctuation">(</span>handler<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> options<span class="token punctuation">:</span> <a href="#api/common/di/iinjectablemethod"><span class="token">IInjectableMethod</span></a><<span class="token keyword">any</span>> | <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>


Param | Type | Description
---|---|---
 handler|<code>any</code>|The injectable method to invoke. Method parameters are injected according method signature.
 options|<code><a href="#api/common/di/iinjectablemethod"><span class="token">IInjectableMethod</span></a><any> &#124; any[]</code>|Object to configure the invocation.





Invoke a class method and inject service.

#### IInjectableMethod options

* **target**: Optional. The class instance.
* **methodName**: `string` Optional. The method name.
* **designParamTypes**: `any[]` Optional. List of injectable types.
* **locals**: `Map<Function, any>` Optional. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.

#### Example

```typescript
import {InjectorService} from "@tsed/common";

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




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> get<span class="token punctuation">:</span> <T><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> => T</code></pre>
</div>


Get a service or factory already constructed from his symbol or class.

#### Example

```typescript
import {InjectorService} from "@tsed/common";
import MyService from "./services";

class OtherService {
     constructor(injectorService: InjectorService) {
         const myService = injectorService.get<MyService>(MyService);
     }
}
```




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">invokeMethod</span><span class="token punctuation">(</span>handler<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> options<span class="token punctuation">:</span> <a href="#api/common/di/iinjectablemethod"><span class="token">IInjectableMethod</span></a><<span class="token keyword">any</span>> | <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>


Param | Type | Description
---|---|---
 handler|<code>any</code>|The injectable method to invoke. Method parameters are injected according method signature.
 options|<code><a href="#api/common/di/iinjectablemethod"><span class="token">IInjectableMethod</span></a><any> &#124; any[]</code>|Object to configure the invocation.





Invoke a class method and inject service.

#### IInjectableMethod options

* **target**: Optional. The class instance.
* **methodName**: `string` Optional. The method name.
* **designParamTypes**: `any[]` Optional. List of injectable types.
* **locals**: `Map<Function, any>` Optional. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.

#### Example

```typescript
import {InjectorService} from "@tsed/common";

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




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">load</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise<<span class="token keyword">any</span>></code></pre>
</div>


Initialize injectorService and load all services/factories.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> invoke<T><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> locals?<span class="token punctuation">:</span> Map<<span class="token keyword">string</span> | Function<span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">,</span> designParamTypes?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> requiredScope?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T</code></pre>
</div>


Param | Type | Description
---|---|---
 target|<code>any</code>|The injectable class to invoke. Class parameters are injected according constructor signature.
 locals|<code>Map<string &#124; Function</code>|Optional. object. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.
 designParamTypes|<code>any[]</code>|Optional. object. List of injectable types.





Invoke the class and inject all services that required by the class constructor.

#### Example

```typescript
import {InjectorService} from "@tsed/common";
import MyService from "./services";

class OtherService {
    constructor(injectorService: InjectorService) {
         const myService = injectorService.invoke<MyService>(MyService);
     }
 }
```




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> construct<T><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> T</code></pre>
</div>


Param | Type | Description
---|---|---
 target|<code><a href="#api/core/type"><span class="token">Type</span></a><any> &#124; symbol</code>|The service to be built.





Construct the service with his dependencies.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">emit</span><span class="token punctuation">(</span>eventName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> ...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise<<span class="token keyword">any</span>></code></pre>
</div>


Param | Type | Description
---|---|---
 eventName|<code>string</code>|The event name to emit at all services.
 args|<code>any[]</code>|List of the parameters to give to each services.





Emit an event to all service. See service [lifecycle hooks](docs/services/lifecycle-hooks.md).



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">buildRegistry</span><span class="token punctuation">(</span>registry<span class="token punctuation">:</span> <a href="#api/core/registry"><span class="token">Registry</span></a><<a href="#api/common/di/provider"><span class="token">Provider</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">,</span> callback?<span class="token punctuation">:</span> <span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <a href="#api/common/di/provider"><span class="token">Provider</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span> => <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/core/registry"><span class="token">Registry</span></a><<a href="#api/common/di/provider"><span class="token">Provider</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> <span class="token keyword">any</span>></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang deprecated "><span class="token keyword">static</span> <span class="token function">set</span><span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <a href="#api/common/di/iprovider"><span class="token">IProvider</span></a><<span class="token keyword">any</span>> | <span class="token keyword">any</span><span class="token punctuation">,</span> instance?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof <a href="#api/common/di/injectorservice"><span class="token">InjectorService</span></a></code></pre>
</div>


Param | Type | Description
---|---|---
 provider|<code><a href="#api/common/di/iprovider"><span class="token">IProvider</span></a><any> &#124; any</code>|provide token.
 instance|<code>any</code>|Optional. Instance





Set a new provider from providerSetting.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">get<T><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><T> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> T</code></pre>
</div>


Param | Type | Description
---|---|---
 target|<code><a href="#api/core/type"><span class="token">Type</span></a><T> &#124; symbol</code>|The class or symbol registered in InjectorService.





Get a service or factory already constructed from his symbol or class.

#### Example

```typescript
import {InjectorService} from "@tsed/common";
import MyService from "./services";

class OtherService {
     constructor(injectorService: InjectorService) {
         const myService = injectorService.get<MyService>(MyService);
     }
}
```




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> has<span class="token punctuation">:</span> <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> => <span class="token keyword">boolean</span></code></pre>
</div>


Check if the service of factory exists in `InjectorService`.

#### Example

```typescript
import {InjectorService} from "@tsed/common";
import MyService from "./services";

class OtherService {
   constructor(injectorService: InjectorService) {
       const exists = injectorService.has(MyService); // true or false
   }
}
```




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">load</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise<<span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span>></code></pre>
</div>


Initialize injectorService and load all services/factories.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">emit</span><span class="token punctuation">(</span>eventName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> ...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise<<span class="token keyword">any</span>></code></pre>
</div>


Param | Type | Description
---|---|---
 eventName|<code>string</code>|The event name to emit at all services.
 args|<code>any[]</code>|List of the parameters to give to each services.





Emit an event to all service. See service [lifecycle hooks](docs/services/lifecycle-hooks.md).



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang deprecated "><span class="token keyword">static</span> <span class="token function">service</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>
</div>


Param | Type | Description
---|---|---
 target|<code>any</code>|The class to add in registry.





Add a new service in the registry. This service will be constructed when `InjectorService`will loaded.

#### Example

```typescript
import {InjectorService} from "@tsed/common";

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




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang deprecated "><span class="token keyword">static</span> <span class="token function">factory</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> instance<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>
</div>


Add a new factory in `InjectorService` registry.

#### Example with symbol definition


```typescript
import {InjectorService} from "@tsed/common";

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

> Note: When you use the factory method with Symbol definition, you must use the `@Inject()`
decorator to retrieve your factory in another Service. Advice: By convention all factory class name will be prefixed by
`Factory`.

#### Example with class

```typescript
import {InjectorService} from "@tsed/common";

export class MyFooService {
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







