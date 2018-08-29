---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation InjectorService service
---
# InjectorService <Badge text="Service" type="service"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { InjectorService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/di/services/InjectorService.ts#L0-L0">/common/di/services/InjectorService.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> InjectorService <span class="token keyword">extends</span> Map&lt<span class="token punctuation">;</span><a href="/api/core/class/RegistryKey.html"><span class="token">RegistryKey</span></a><span class="token punctuation">,</span> <a href="/api/common/di/class/Provider.html"><span class="token">Provider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> settings<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    get&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span> | symbol | <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T | undefined<span class="token punctuation">;</span>
    <span class="token function">has</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="/api/core/class/RegistryKey.html"><span class="token">RegistryKey</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token function">getProvider</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="/api/core/class/RegistryKey.html"><span class="token">RegistryKey</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/di/class/Provider.html"><span class="token">Provider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | undefined<span class="token punctuation">;</span>
    <span class="token function">forkProvider</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="/api/core/class/RegistryKey.html"><span class="token">RegistryKey</span></a><span class="token punctuation">,</span> instance?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/di/class/Provider.html"><span class="token">Provider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    <span class="token function">getProviders</span><span class="token punctuation">(</span>type?<span class="token punctuation">:</span> <a href="/api/common/di/interfaces/ProviderType.html"><span class="token">ProviderType</span></a> | <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/di/class/Provider.html"><span class="token">Provider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    invoke&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> locals?<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span> | Function<span class="token punctuation">,</span> <span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> designParamTypes?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> requiredScope?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    <span class="token function">invokeMethod</span><span class="token punctuation">(</span>handler<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> options<span class="token punctuation">:</span> <a href="/api/common/di/interfaces/IInjectableMethod.html"><span class="token">IInjectableMethod</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token function">load</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    <span class="token function">emit</span><span class="token punctuation">(</span>eventName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> ...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise&lt<span class="token punctuation">;</span><span class="token keyword">void</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> invoke&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> locals?<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span> | Function<span class="token punctuation">,</span> <span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> designParamTypes?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> requiredScope?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    <span class="token keyword">static</span> construct&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">emit</span><span class="token punctuation">(</span>eventName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> ...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> get&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/class/RegistryKey.html"><span class="token">RegistryKey</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">invokeMethod</span><span class="token punctuation">(</span>handler<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> options<span class="token punctuation">:</span> <a href="/api/common/di/interfaces/IInjectableMethod.html"><span class="token">IInjectableMethod</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">set</span><span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <a href="/api/common/di/interfaces/IProvider.html"><span class="token">IProvider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | <span class="token keyword">any</span><span class="token punctuation">,</span> instance?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof InjectorService<span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">has</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">load</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">service</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">factory</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> instance<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Description -->
## Description

::: v-pre

This service contain all services collected by `@Service` or services declared manually with `InjectorService.factory()` or `InjectorService.service()`.

### Example:

```typescript
import {InjectorService} from "@tsed/common";

// Import the services (all services are decorated with @Service()";
import MyService1 from "./services/service1";
import MyService2 from "./services/service2";
import MyService3 from "./services/service3";

// When all services is imported you can load InjectorService.
const injector = new InjectorService()
injector.load();

const myService1 = injector.get<MyService1>(MyServcice1);
```

> Note: `ServerLoader` make this automatically when you use `ServerLoader.mount()` method (or settings attributes) and load services and controllers during the starting server.


:::


<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> settings<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span> | symbol | <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T | undefined</code></pre>

</div>


<!-- Params -->
Param | Type | Description
---|---|---
 target|<code>&lt;a href="/api/core/interfaces/Type.html"&gt;&lt;span class="token"&gt;Type&lt;/span&gt;&lt;/a&gt;&lt;T&gt; &#124; symbol &#124; any</code>|The class or symbol registered in InjectorService. 





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




:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">has</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="/api/core/class/RegistryKey.html"><span class="token">RegistryKey</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



The has() method returns a boolean indicating whether an element with the specified key exists or not.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">getProvider</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="/api/core/class/RegistryKey.html"><span class="token">RegistryKey</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/di/class/Provider.html"><span class="token">Provider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | undefined</code></pre>

</div>


<!-- Params -->
Param | Type | Description
---|---|---
 key|<code>&lt;a href="/api/core/class/RegistryKey.html"&gt;&lt;span class="token"&gt;RegistryKey&lt;/span&gt;&lt;/a&gt;</code>|Required. The key of the element to return from the Map object. 





The getProvider() method returns a specified element from a Map object.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">forkProvider</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="/api/core/class/RegistryKey.html"><span class="token">RegistryKey</span></a><span class="token punctuation">,</span> instance?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/di/class/Provider.html"><span class="token">Provider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">getProviders</span><span class="token punctuation">(</span>type?<span class="token punctuation">:</span> <a href="/api/common/di/interfaces/ProviderType.html"><span class="token">ProviderType</span></a> | <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/di/class/Provider.html"><span class="token">Provider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">invoke&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> locals?<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span> | Function<span class="token punctuation">,</span> <span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> designParamTypes?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> requiredScope?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T</code></pre>

</div>


<!-- Params -->
Param | Type | Description
---|---|---
 target|<code>any</code>|The injectable class to invoke. Class parameters are injected according constructor signature.  locals|<code>Map&lt;string &#124; Function</code>|Optional. object. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.  designParamTypes|<code>any[]</code>|Optional. object. List of injectable types. 





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




:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">invokeMethod</span><span class="token punctuation">(</span>handler<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> options<span class="token punctuation">:</span> <a href="/api/common/di/interfaces/IInjectableMethod.html"><span class="token">IInjectableMethod</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>


<!-- Params -->
Param | Type | Description
---|---|---
 handler|<code>any</code>|The injectable method to invoke. Method parameters are injected according method signature.  options|<code>&lt;a href="/api/common/di/interfaces/IInjectableMethod.html"&gt;&lt;span class="token"&gt;IInjectableMethod&lt;/span&gt;&lt;/a&gt;&lt;any&gt;</code>|Object to configure the invocation. 





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




:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">load</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span></code></pre>

</div>



Initialize injectorService and load all services/factories.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">emit</span><span class="token punctuation">(</span>eventName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> ...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise&lt<span class="token punctuation">;</span><span class="token keyword">void</span>&gt<span class="token punctuation">;</span></code></pre>

</div>


<!-- Params -->
Param | Type | Description
---|---|---
 eventName|<code>string</code>|The event name to emit at all services.  args|<code>any[]</code>|List of the parameters to give to each services. 





Emit an event to all service. See service [lifecycle hooks](/docs/services.md#lifecycle-hooks).



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> invoke&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> locals?<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span> | Function<span class="token punctuation">,</span> <span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> designParamTypes?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> requiredScope?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T</code></pre>

</div>


<!-- Params -->
Param | Type | Description
---|---|---
 target|<code>any</code>|The injectable class to invoke. Class parameters are injected according constructor signature.  locals|<code>Map&lt;string &#124; Function</code>|Optional. object. If preset then any argument Class are read from this object first, before the `InjectorService` is consulted.  designParamTypes|<code>any[]</code>|Optional. object. List of injectable types. 





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




:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang deprecated "><span class="token keyword">static</span> construct&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> T</code></pre>

</div>


<!-- Params -->
Param | Type | Description
---|---|---
 target|<code>&lt;a href="/api/core/interfaces/Type.html"&gt;&lt;span class="token"&gt;Type&lt;/span&gt;&lt;/a&gt;&lt;any&gt; &#124; symbol</code>|The service to be built. 





Construct the service with his dependencies.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">emit</span><span class="token punctuation">(</span>eventName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> ...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span></code></pre>

</div>


<!-- Params -->
Param | Type | Description
---|---|---
 eventName|<code>string</code>|The event name to emit at all services.  args|<code>any[]</code>|List of the parameters to give to each services. 





Emit an event to all service. See service [lifecycle hooks](/docs/services.md#lifecycle-hooks).



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> get&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/class/RegistryKey.html"><span class="token">RegistryKey</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> T</code></pre>

</div>


<!-- Params -->
Param | Type | Description
---|---|---
 target|<code>&lt;a href="/api/core/class/RegistryKey.html"&gt;&lt;span class="token"&gt;RegistryKey&lt;/span&gt;&lt;/a&gt;</code>|The class or symbol registered in InjectorService. 





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




:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">invokeMethod</span><span class="token punctuation">(</span>handler<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> options<span class="token punctuation">:</span> <a href="/api/common/di/interfaces/IInjectableMethod.html"><span class="token">IInjectableMethod</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>


<!-- Params -->
Param | Type | Description
---|---|---
 handler|<code>any</code>|The injectable method to invoke. Method parameters are injected according method signature.  options|<code>&lt;a href="/api/common/di/interfaces/IInjectableMethod.html"&gt;&lt;span class="token"&gt;IInjectableMethod&lt;/span&gt;&lt;/a&gt;&lt;any&gt; &#124; any[]</code>|Object to configure the invocation. 





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
         injectorService.invokeMethod(this.method.bind(this), {
             target: this,
             methodName: 'method'
         });
     }

  method(otherService: OtherService) {}
}
```




:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang deprecated "><span class="token keyword">static</span> <span class="token function">set</span><span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <a href="/api/common/di/interfaces/IProvider.html"><span class="token">IProvider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | <span class="token keyword">any</span><span class="token punctuation">,</span> instance?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof <a href="/api/common/di/services/InjectorService.html"><span class="token">InjectorService</span></a></code></pre>

</div>


<!-- Params -->
Param | Type | Description
---|---|---
 provider|<code>&lt;a href="/api/common/di/interfaces/IProvider.html"&gt;&lt;span class="token"&gt;IProvider&lt;/span&gt;&lt;/a&gt;&lt;any&gt; &#124; any</code>|provide token.  instance|<code>any</code>|Optional. Instance 





Set a new provider from providerSetting.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">has</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>


<!-- Params -->
Param | Type | Description
---|---|---
 target|<code>any</code>|The service class 





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




:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">load</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Promise&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span></code></pre>

</div>



Initialize injectorService and load all services/factories.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang deprecated "><span class="token keyword">static</span> <span class="token function">service</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>

</div>


<!-- Params -->
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
const injector = new InjectorService();
injector.load();

const myFooService = injector.get<MyFooService>(MyFooService);
myFooService.getFoo(); // test
```




:::



***



::: v-pre

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



:::