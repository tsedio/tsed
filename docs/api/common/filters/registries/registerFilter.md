---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation registerFilter function
---
# registerFilter <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { registerFilter }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/filters/registries/FilterRegistry.ts#L0-L0">/packages/common/src/filters/registries/FilterRegistry.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">const</span> registerFilter<span class="token punctuation">:</span> <span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> instance?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Add a new filter in the `ProviderRegistry`. This filter will be built when `InjectorService` will be loaded.

#### Example

```typescript
import {registerFilter, InjectorService} from "@tsed/common";

export default class MyFooFilter {
    constructor(){}
    transform() {
        return "test";
    }
}

registerFilter({provide: MyFooService});
// or
registerFilter(MyFooService);

const injector = new InjectorService();

const myFooService = injector.get<MyFooFilter>(MyFooFilter);
myFooFilter.getFoo(); // test
```


:::