---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation swaggerType function
---
# swaggerType <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { swaggerType }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger/utils/index"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//swagger/utils/index.ts#L0-L0">/swagger/utils/index.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">swaggerType</span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> <span class="token punctuation">{</span>
  return <a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a>.<span class="token function">getJsonType</span><span class="token punctuation">(</span>type<span class="token punctuation">)</span> <span class="token keyword">as</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

/**
 * <a href="/api/common/filters/decorators/Filter.html"><span class="token">Filter</span></a> the null type<span class="token punctuation">,</span> unsupported by swagger and apply the right type on schema.
 * @param schema
 * @param type
 */</code></pre>