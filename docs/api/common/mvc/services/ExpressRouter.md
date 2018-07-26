---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ExpressRouter service
---
# ExpressRouter <Badge text="Service" type="service"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ExpressRouter }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/mvc/services/ExpressRouter.ts#L0-L0">/common/mvc/services/ExpressRouter.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">type ExpressRouter<span class="token punctuation"> = </span>Express.Router & <span class="token punctuation">{</span>
  <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> descriptor<span class="token punctuation">:</span> TypedPropertyDescriptor&lt<span class="token punctuation">;</span>Function&gt<span class="token punctuation">;</span> | <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
  return <span class="token function"><a href="/api/common/di/decorators/Inject.html"><span class="token">Inject</span></a></span><span class="token punctuation">(</span>ExpressRouter<span class="token punctuation">)</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> targetKey<span class="token punctuation">,</span> descriptor<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> descriptor<span class="token punctuation">:</span> TypedPropertyDescriptor&lt<span class="token punctuation">;</span>Function&gt<span class="token punctuation">;</span> | <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">return <span class="token function"><a href="/api/common/di/decorators/Inject.html"><span class="token">Inject</span></a></span><span class="token punctuation">(</span><a href="/api/common/mvc/services/ExpressRouter.html"><span class="token">ExpressRouter</span></a><span class="token punctuation">)</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> targetKey<span class="token punctuation">,</span> descriptor<span class="token punctuation">)</span></code></pre>

</div>



Inject the ExpressRouter (Express.Router) instance.

### Example

```typescript
import {ExpressRouter, Service} from "@tsed/common";

@Controller("/")
export default class OtherService {
   constructor(@ExpressRouter router: ExpressRouter) {}
}
```




:::