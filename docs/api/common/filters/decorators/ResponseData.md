---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ResponseData decorator
---
# ResponseData <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ResponseData }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/filters/decorators/responseData.ts#L0-L0">/common/filters/decorators/responseData.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">ResponseData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function <span class="token punctuation">{</span>
  return <a href="/api/common/filters/registries/ParamRegistry.html"><span class="token">ParamRegistry</span></a>.<span class="token function">decorate</span><span class="token punctuation">(</span><a href="/api/common/filters/constants/RESPONSE_DATA.html"><span class="token">RESPONSE_DATA</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>