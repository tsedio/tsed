---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation MongoosePluginOptions interface
---
# MongoosePluginOptions <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MongoosePluginOptions }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/mongoose/src/interfaces/MongooseSchemaOptions.ts#L0-L0">/packages/mongoose/src/interfaces/MongooseSchemaOptions.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> MongoosePluginOptions <span class="token punctuation">{</span>
    plugin<span class="token punctuation">:</span> <span class="token punctuation">(</span>schema<span class="token punctuation">:</span> <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    options?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">plugin<span class="token punctuation">:</span> <span class="token punctuation">(</span>schema<span class="token punctuation">:</span> <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">options?<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::