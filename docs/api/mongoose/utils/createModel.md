---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation createModel function
---
# createModel <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { createModel }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//mongoose/utils/createModel.ts#L0-L0">/mongoose/utils/createModel.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function createModel&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>
  target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span>
  schema<span class="token punctuation">:</span> mongoose.<a href="/api/common/jsonschema/decorators/Schema.html"><span class="token">Schema</span></a><span class="token punctuation">,</span>
  name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation"> = </span><span class="token function">nameOf</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">,</span>
  collection?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span>
  skipInit?<span class="token punctuation">:</span> <span class="token keyword">boolean</span>
<span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/mongoose/interfaces/MongooseModel.html"><span class="token">MongooseModel</span></a>&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
  <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>.<span class="token function">set</span><span class="token punctuation">(</span><a href="/api/mongoose/constants/MONGOOSE_MODEL_NAME.html"><span class="token">MONGOOSE_MODEL_NAME</span></a><span class="token punctuation">,</span> name<span class="token punctuation">)</span><span class="token punctuation">;</span>
  target.prototype.serialize<span class="token punctuation"> = </span><span class="token function">function</span><span class="token punctuation">(</span>options<span class="token punctuation">:</span> <a href="/api/common/converters/interfaces/IConverterOptions.html"><span class="token">IConverterOptions</span></a><span class="token punctuation">,</span> converterService<span class="token punctuation">:</span> <a href="/api/common/converters/services/ConverterService.html"><span class="token">ConverterService</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span>checkRequiredValue<span class="token punctuation">,</span> ignoreCallback<span class="token punctuation">}</span><span class="token punctuation"> = </span>options<span class="token punctuation">;</span>

    return converterService.<span class="token function">serializeClass</span><span class="token punctuation">(</span>this<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      type<span class="token punctuation">:</span> <span class="token function">getClass</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">,</span>
      checkRequiredValue<span class="token punctuation">,</span>
      ignoreCallback
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  schema.<span class="token function">loadClass</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> modelInstance<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span>mongoose.<span class="token function">model</span><span class="token punctuation">(</span>name<span class="token punctuation">,</span> schema<span class="token punctuation">,</span> collection<span class="token punctuation">,</span> skipInit<span class="token punctuation">)</span><span class="token punctuation">;</span>

  return modelInstance<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Create an instance of mongoose.model from a class.


:::