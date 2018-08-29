---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation applySchemaOptions function
---
# applySchemaOptions <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { applySchemaOptions }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose/utils/schemaOptions"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//mongoose/utils/schemaOptions.ts#L0-L0">/mongoose/utils/schemaOptions.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">applySchemaOptions</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> options<span class="token punctuation">:</span> <a href="/api/mongoose/interfaces/MongooseModelOptions.html"><span class="token">MongooseModelOptions</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> store<span class="token punctuation"> = </span><a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>

  options<span class="token punctuation"> = </span><span class="token function">schemaOptions</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span>

  if <span class="token punctuation">(</span>store.<span class="token function">has</span><span class="token punctuation">(</span><a href="/api/mongoose/constants/MONGOOSE_SCHEMA.html"><span class="token">MONGOOSE_SCHEMA</span></a><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> schema<span class="token punctuation">:</span> <a href="/api/common/jsonschema/decorators/Schema.html"><span class="token">Schema</span></a><span class="token punctuation"> = </span>store.<span class="token function">get</span><span class="token punctuation">(</span><a href="/api/mongoose/constants/MONGOOSE_SCHEMA.html"><span class="token">MONGOOSE_SCHEMA</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>

    if <span class="token punctuation">(</span>options.plugins<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      if <span class="token punctuation">(</span>options.plugins<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        options.plugins.<span class="token function">forEach</span><span class="token punctuation">(</span>item =&gt<span class="token punctuation">;</span> schema.<span class="token function">plugin</span><span class="token punctuation">(</span>item.plugin<span class="token punctuation">,</span> item.options<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    if <span class="token punctuation">(</span>options.indexes<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      options.indexes.<span class="token function">forEach</span><span class="token punctuation">(</span>item =&gt<span class="token punctuation">;</span> schema.<span class="token function">index</span><span class="token punctuation">(</span>item.fields<span class="token punctuation">,</span> item.options<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    if <span class="token punctuation">(</span>options.pre<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      options.pre.<span class="token function">forEach</span><span class="token punctuation">(</span>item =&gt<span class="token punctuation">;</span> schema.<span class="token function">pre</span><span class="token punctuation">(</span>item.method<span class="token punctuation">,</span> !!item.parallel<span class="token punctuation">,</span> <span class="token function">buildPreHook</span><span class="token punctuation">(</span>item.fn<span class="token punctuation">)</span><span class="token punctuation">,</span> item.errorCb<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    if <span class="token punctuation">(</span>options.post<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      options.post.<span class="token function">forEach</span><span class="token punctuation">(</span>item =&gt<span class="token punctuation">;</span> schema.<span class="token function">post</span><span class="token punctuation">(</span>item.method<span class="token punctuation">,</span> item.fn <span class="token keyword">as</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre>