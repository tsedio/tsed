---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation MongoosePostHookCB interface
---
# MongoosePostHookCB <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MongoosePostHookCB }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/mongoose/src/interfaces/MongooseSchemaOptions.ts#L0-L0">/packages/mongoose/src/interfaces/MongooseSchemaOptions.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> MongoosePostHookCB&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token punctuation">(</span>doc<span class="token punctuation">:</span> <a href="/api/mongoose/interfaces/MongooseDocument.html"><span class="token">MongooseDocument</span></a>&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> next<span class="token punctuation">:</span> <span class="token punctuation">(</span>err?<span class="token punctuation">:</span> NativeError<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token punctuation">(</span>doc<span class="token punctuation">:</span> <a href="/api/mongoose/interfaces/MongooseDocument.html"><span class="token">MongooseDocument</span></a>&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> next<span class="token punctuation">:</span> <span class="token punctuation">(</span>err?<span class="token punctuation">:</span> NativeError<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>

</div>



:::