---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation schemaOptions function
---
# schemaOptions <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { schemaOptions }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose/utils/schemaOptions"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//mongoose/utils/schemaOptions.ts#L0-L0">/mongoose/utils/schemaOptions.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">schemaOptions</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <a href="/api/mongoose/interfaces/MongooseModelOptions.html"><span class="token">MongooseModelOptions</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> store<span class="token punctuation"> = </span><a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  if <span class="token punctuation">(</span>options<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    options<span class="token punctuation"> = </span><span class="token function">deepExtends</span><span class="token punctuation">(</span>store.<span class="token function">get</span><span class="token punctuation">(</span><a href="/api/mongoose/constants/MONGOOSE_SCHEMA_OPTIONS.html"><span class="token">MONGOOSE_SCHEMA_OPTIONS</span></a><span class="token punctuation">)</span> || <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span>
    store.<span class="token function">set</span><span class="token punctuation">(</span><a href="/api/mongoose/constants/MONGOOSE_SCHEMA_OPTIONS.html"><span class="token">MONGOOSE_SCHEMA_OPTIONS</span></a><span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  return store.<span class="token function">get</span><span class="token punctuation">(</span><a href="/api/mongoose/constants/MONGOOSE_SCHEMA_OPTIONS.html"><span class="token">MONGOOSE_SCHEMA_OPTIONS</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

/**
 *
 * @param <span class="token punctuation">{</span>Function<span class="token punctuation">}</span> fn
 * @returns <span class="token punctuation">{</span><span class="token keyword">any</span><span class="token punctuation">}</span>
 */</code></pre>