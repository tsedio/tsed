
<header class="symbol-info-header"><h1 id="registermodel">registerModel</h1><label class="symbol-info-type-label function">Function</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { registerModel }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.0/src//mongoose/registries/MongooseModelRegistry.ts#L0-L0">/mongoose/registries/MongooseModelRegistry.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">const</span> registerModel<span class="token punctuation">:</span> <span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> instance?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> => <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Add a new model in the `ProviderRegistry`. This model will be built when `InjectorService` will be loaded.

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

<!-- Members -->

