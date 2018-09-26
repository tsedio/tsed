---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Constant decorator
---
# Constant <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Constant }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.31.9/packages/common/src/config/decorators/constant.ts#L0-L0">/packages/common/src/config/decorators/constant.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Constant</span><span class="token punctuation">(</span>expression<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> defaultValue?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>



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