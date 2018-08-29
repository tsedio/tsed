---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation MiddlewareRegistry const
---
# MiddlewareRegistry <Badge text="Constant" type="const"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MiddlewareRegistry }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/mvc/registries/MiddlewareRegistry.ts#L0-L0">/common/mvc/registries/MiddlewareRegistry.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">const</span> MiddlewareRegistry<span class="token punctuation">:</span> <a href="/api/common/di/interfaces/TypedProvidersRegistry.html"><span class="token">TypedProvidersRegistry</span></a><span class="token punctuation"> = </span><a href="/api/common/di/registries/GlobalProviders.html"><span class="token">GlobalProviders</span></a>.<span class="token function">createRegistry</span><span class="token punctuation">(</span><a href="/api/common/di/interfaces/ProviderType.html"><span class="token">ProviderType</span></a>.MIDDLEWARE<span class="token punctuation">,</span> <a href="/api/common/di/class/Provider.html"><span class="token">Provider</span></a><span class="token punctuation">,</span> <span class="token punctuation">{</span>
  injectable<span class="token punctuation">:</span> true<span class="token punctuation">,</span>
  buildable<span class="token punctuation">:</span> true
  <span class="token function">middlewareRegisterFn</span><span class="token punctuation">(</span>provider<span class="token punctuation">,</span> instance<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <a href="/api/common/di/registries/GlobalProviders.html"><span class="token">GlobalProviders</span></a>.<span class="token function">getRegistry</span><span class="token punctuation">(</span><a href="/api/common/di/interfaces/ProviderType.html"><span class="token">ProviderType</span></a>.MIDDLEWARE<span class="token punctuation">)</span>!
    .<span class="token function">get</span><span class="token punctuation">(</span><span class="token function">getClassOrSymbol</span><span class="token punctuation">(</span>provider.provide || provider<span class="token punctuation">)</span><span class="token punctuation">)</span>!
    .store.<span class="token function">set</span><span class="token punctuation">(</span>"middlewareType"<span class="token punctuation">,</span> <a href="/api/common/mvc/interfaces/MiddlewareType.html"><span class="token">MiddlewareType</span></a>.MIDDLEWARE<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">injectable<span class="token punctuation">:</span> true<span class="token punctuation">,</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">buildable<span class="token punctuation">:</span> true</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">middlewareRegisterFn</span><span class="token punctuation">(</span>provider<span class="token punctuation">,</span> instance<span class="token punctuation">)</span></code></pre>

</div>



Add a new middleware in the `ProviderRegistry`. This middleware will be built when `InjectorService` will be loaded.

#### Example

```typescript
import {registerMiddleware, InjectorService} from "@tsed/common";

export default class FooMiddleware {
    constructor(){}
    use() {
        return "test";
    }
}

registerMiddleware({provide: FooMiddleware});
// or
registerMiddleware(FooMiddleware);

const injector = new InjectorService()
injector.load();

const myFooService = injector.get<FooMiddleware>(FooMiddleware);
fooMiddleware.use(); // test
```




:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><a href="/api/common/di/registries/GlobalProviders.html"><span class="token">GlobalProviders</span></a>.<span class="token function">getRegistry</span><span class="token punctuation">(</span><a href="/api/common/di/interfaces/ProviderType.html"><span class="token">ProviderType</span></a>.MIDDLEWARE<span class="token punctuation">)</span>!</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">.<span class="token function">get</span><span class="token punctuation">(</span><span class="token function">getClassOrSymbol</span><span class="token punctuation">(</span>provider.provide || provider<span class="token punctuation">)</span><span class="token punctuation">)</span>!</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">.store.<span class="token function">set</span><span class="token punctuation">(</span>"middlewareType"<span class="token punctuation">,</span> <a href="/api/common/mvc/interfaces/MiddlewareType.html"><span class="token">MiddlewareType</span></a>.MIDDLEWARE<span class="token punctuation">)</span></code></pre>

</div>



:::