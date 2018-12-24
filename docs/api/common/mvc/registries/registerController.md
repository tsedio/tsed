---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation registerController function
---
# registerController <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { registerController }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v5.0.2/packages/common/src/mvc/registries/ControllerRegistry.ts#L0-L0">/packages/common/src/mvc/registries/ControllerRegistry.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">const</span> registerController<span class="token punctuation">:</span> <span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> instance?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Add a new controller in the `ProviderRegistry`. This controller will be built when `InjectorService` will be loaded.

#### Example

```typescript
import {registerController, InjectorService} from "@tsed/common";

export default class MyController {
    constructor(){}
    transform() {
        return "test";
    }
}

registerController({provide: MyController});
// or
registerController(MyController);

const injector = new InjectorService();
injector.load();

const myController = injector.get<MyController>(MyController);
myController.getFoo(); // test
```


:::