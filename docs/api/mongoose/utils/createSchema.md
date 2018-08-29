---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation createSchema function
---
# createSchema <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { createSchema }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//mongoose/utils/createSchema.ts#L0-L0">/mongoose/utils/createSchema.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">createSchema</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> mongoose.SchemaOptions<span class="token punctuation">)</span><span class="token punctuation">:</span> mongoose.<a href="/api/common/jsonschema/decorators/Schema.html"><span class="token">Schema</span></a> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> store<span class="token punctuation"> = </span><a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>

  if <span class="token punctuation">(</span>!store.<span class="token function">has</span><span class="token punctuation">(</span><a href="/api/mongoose/constants/MONGOOSE_SCHEMA.html"><span class="token">MONGOOSE_SCHEMA</span></a><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> definition<span class="token punctuation">:</span> mongoose.SchemaDefinition<span class="token punctuation"> = </span><span class="token function">buildMongooseSchema</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
    store.<span class="token function">set</span><span class="token punctuation">(</span><a href="/api/mongoose/constants/MONGOOSE_SCHEMA.html"><span class="token">MONGOOSE_SCHEMA</span></a><span class="token punctuation">,</span> new mongoose.<span class="token function"><a href="/api/common/jsonschema/decorators/Schema.html"><span class="token">Schema</span></a></span><span class="token punctuation">(</span>definition<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  return store.<span class="token function">get</span><span class="token punctuation">(</span><a href="/api/mongoose/constants/MONGOOSE_SCHEMA.html"><span class="token">MONGOOSE_SCHEMA</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>