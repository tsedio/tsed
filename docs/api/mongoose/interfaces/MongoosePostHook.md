---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation MongoosePostHook interface
---
# MongoosePostHook <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MongoosePostHook }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/mongoose/src/interfaces/MongooseSchemaOptions.ts#L0-L0">/packages/mongoose/src/interfaces/MongooseSchemaOptions.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> MongoosePostHook <span class="token punctuation">{</span>
    method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    fn<span class="token punctuation">:</span> <a href="/api/mongoose/interfaces/MongoosePostHookCB.html"><span class="token">MongoosePostHookCB</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | <a href="/api/mongoose/interfaces/MongoosePostErrorHookCB.html"><span class="token">MongoosePostErrorHookCB</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">method<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">fn<span class="token punctuation">:</span> <a href="/api/mongoose/interfaces/MongoosePostHookCB.html"><span class="token">MongoosePostHookCB</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | <a href="/api/mongoose/interfaces/MongoosePostErrorHookCB.html"><span class="token">MongoosePostErrorHookCB</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span></code></pre>

</div>



:::