---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation registerMiddlewareError function
---
# registerMiddlewareError <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { registerMiddlewareError }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/mvc/registries/MiddlewareRegistry.ts#L0-L0">/common/mvc/registries/MiddlewareRegistry.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">registerMiddlewareError</span><span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <span class="token keyword">any</span> | <a href="/api/common/di/interfaces/IProvider.html"><span class="token">IProvider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> instance?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">middlewareRegisterFn</span><span class="token punctuation">(</span>provider<span class="token punctuation">,</span> instance<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <a href="/api/common/di/registries/GlobalProviders.html"><span class="token">GlobalProviders</span></a>.<span class="token function">getRegistry</span><span class="token punctuation">(</span><a href="/api/common/di/interfaces/ProviderType.html"><span class="token">ProviderType</span></a>.MIDDLEWARE<span class="token punctuation">)</span>!
    .<span class="token function">get</span><span class="token punctuation">(</span><span class="token function">getClassOrSymbol</span><span class="token punctuation">(</span>provider.provide || provider<span class="token punctuation">)</span><span class="token punctuation">)</span>!
    .store.<span class="token function">set</span><span class="token punctuation">(</span>"middlewareType"<span class="token punctuation">,</span> <a href="/api/common/mvc/interfaces/MiddlewareType.html"><span class="token">MiddlewareType</span></a>.ERROR<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Add a new middleware in the `ProviderRegistry`. This middleware will be built when `InjectorService` will be loaded.

#### Example

```typescript
import {registerMiddlewareError, InjectorService} from "@tsed/common";

export default class FooMiddleware {
    constructor(){}
    use() {
        return "test";
    }
}

registerMiddlewareError({provide: MyFooService});
// or
registerMiddlewareError(MyFooService);

const injector = new InjectorService();
injector.load();

const fooMiddleware = injector.get<FooMiddleware>(FooMiddleware);
fooMiddleware.use(); // test
```


:::