---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation registerMiddleware function
---
# registerMiddleware <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { registerMiddleware }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.18.0/packages/common/src/mvc/registries/MiddlewareRegistry.ts#L0-L0">/packages/common/src/mvc/registries/MiddlewareRegistry.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">const</span> registerMiddleware<span class="token punctuation">:</span> <span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> instance?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

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