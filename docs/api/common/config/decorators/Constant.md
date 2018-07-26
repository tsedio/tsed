---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Constant decorator
---
# Constant <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Constant }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/config/decorators/constant.ts#L0-L0">/common/config/decorators/constant.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Constant</span><span class="token punctuation">(</span>expression<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> defaultValue?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
  return <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>.<span class="token function">merge</span><span class="token punctuation">(</span>"injectableProperties"<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      <span class="token punctuation">[</span>propertyKey<span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
        bindingType<span class="token punctuation">:</span> <span class="token string">"constant"</span><span class="token punctuation">,</span>
        propertyKey<span class="token punctuation">,</span>
        expression<span class="token punctuation">,</span>
        defaultValue
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">as</span> <a href="/api/common/di/interfaces/IInjectableProperties.html"><span class="token">IInjectableProperties</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Return value from ServerSettingsService.

## Example

```typescript
import {Env} from "@tsed/core";
import {Constant, Value} from "@tsed/common";

export class MyClass {

   @Constant("env")
   env: Env;

   @Value("swagger.path")
   swaggerPath: string;

   @Value("swagger.path", "defaultValue")
   swaggerPath: string;

   constructor() {
      console.log(this.swaggerPath) // undefined. Not available on constructor
   }

   $onInit() {
     console.log(this.swaggerPath)  // something
   }
}
```


:::