
<header class="symbol-info-header"><h1 id="registerservice">registerService</h1><label class="symbol-info-type-label function">Function</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { registerService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/di/registries/ProviderRegistry.ts#L0-L0">/common/di/registries/ProviderRegistry.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">registerService</span><span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <span class="token keyword">any</span> | <a href="#api/common/di/iprovider"><span class="token">IProvider</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->


Param | Type | Description
---|---|---
 provider|<code>any &#124; <a href="#api/common/di/iprovider"><span class="token">IProvider</span></a><any></code>|Provider configuration.




<!-- Description -->


### Description

Add a new service in the `ProviderRegistry`. This service will be built when `InjectorService` will be loaded.

#### Example

```typescript
import {registerService, InjectorService} from "@tsed/common";

export default class MyFooService {
    constructor(){}
    getFoo() {
        return "test";
    }
}

registerService({provide: MyFooService});
// or
registerService(MyFooService);

InjectorService.load();

const myFooService = InjectorService.get<MyFooService>(MyFooService);
myFooService.getFoo(); // test
```

<!-- Members -->

