---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation registerConverter function
---
# registerConverter <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { registerConverter }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/src/converters/registries/ConverterRegistries"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/converters/registries/ConverterRegistries.ts#L0-L0">/packages/common/src/converters/registries/ConverterRegistries.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">const</span> registerConverter<span class="token punctuation">:</span> <span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> instance?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Add a new converter in the `ProviderRegistry`. This converter will be built when `InjectorService` will be loaded.

#### Example

```typescript
import {registerConverter, InjectorService} from "@tsed/common";

export default class MyConverter {
    constructor(){}
    serialize() {
        return "test";
    }
}

registerConverter({provide: MyConverter});
// or
registerConverter(MyConverter);

const injector = new InjectorService();
injector.load();

const myConverter = injector.get<MyConverter>(MyConverter);
myConverter.serialize(); // test
```


:::