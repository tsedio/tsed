---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation registerModel function
---
# registerModel <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { registerModel }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/mongoose/src/registries/MongooseModelRegistry.ts#L0-L0">/packages/mongoose/src/registries/MongooseModelRegistry.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">const</span> registerModel<span class="token punctuation">:</span> <span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> instance?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Add a new model in the `ProviderRegistry`.
This model will be built when `InjectorService` will be loaded.

#### Example

```typescript
import {registerModel, InjectorService} from "@tsed/common";

export default class MyModel {
    constructor(){}
    getFoo() {
        return "test";
    }
}

registerModel({provide: MyModel});
// or
registerModel(MyModel);

const injector = new InjectorService();
injector.load();

const myModel = injector.get<MyModel>(MyModel);
myModel.getFoo(); // test
```


:::