---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation MongooseModelOptions interface
---
# MongooseModelOptions <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MongooseModelOptions }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.33.0/packages/mongoose/src/interfaces/MongooseModelOptions.ts#L0-L0">/packages/mongoose/src/interfaces/MongooseModelOptions.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> MongooseModelOptions <span class="token punctuation">{</span>
    schemaOptions?<span class="token punctuation">:</span> SchemaOptions<span class="token punctuation">;</span>
    name?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    collection?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    skipInit?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    plugins?<span class="token punctuation">:</span> <a href="/api/mongoose/interfaces/MongoosePluginOptions.html"><span class="token">MongoosePluginOptions</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    indexes?<span class="token punctuation">:</span> <a href="/api/mongoose/interfaces/MongooseIndexOptions.html"><span class="token">MongooseIndexOptions</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    pre?<span class="token punctuation">:</span> <a href="/api/mongoose/interfaces/MongoosePreHook.html"><span class="token">MongoosePreHook</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    post?<span class="token punctuation">:</span> <a href="/api/mongoose/interfaces/MongoosePostHook.html"><span class="token">MongoosePostHook</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">schemaOptions?<span class="token punctuation">:</span> SchemaOptions</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">name?<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">collection?<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">skipInit?<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">plugins?<span class="token punctuation">:</span> <a href="/api/mongoose/interfaces/MongoosePluginOptions.html"><span class="token">MongoosePluginOptions</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">indexes?<span class="token punctuation">:</span> <a href="/api/mongoose/interfaces/MongooseIndexOptions.html"><span class="token">MongooseIndexOptions</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">pre?<span class="token punctuation">:</span> <a href="/api/mongoose/interfaces/MongoosePreHook.html"><span class="token">MongoosePreHook</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">post?<span class="token punctuation">:</span> <a href="/api/mongoose/interfaces/MongoosePostHook.html"><span class="token">MongoosePostHook</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::