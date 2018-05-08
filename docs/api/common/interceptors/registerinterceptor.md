
<header class="symbol-info-header"><h1 id="registerinterceptor">registerInterceptor</h1><label class="symbol-info-type-label function">Function</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { registerInterceptor }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.17.5/src//common/interceptors/registries/InterceptorRegistries.ts#L0-L0">/common/interceptors/registries/InterceptorRegistries.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">const</span> registerInterceptor<span class="token punctuation">:</span> <span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> instance?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> => <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Add a new interceptor in the `ProviderRegistry`. This interceptor will be built when `InjectorService` will be loaded.

#### Example

```typescript
import {registerInterceptor, InjectorService} from "@tsed/common";

export default class MyInterceptor {
    constructor(){}
    aroundInvoke() {
        return "test";
    }
}

registerInterceptor({provide: MyInterceptor});
// or
registerInterceptor(MyInterceptor);

InjectorService.load();

const myInterceptor = InjectorService.get<MyInterceptor>(MyInterceptor);
myInterceptor.aroundInvoke(); // test
```

<!-- Members -->

