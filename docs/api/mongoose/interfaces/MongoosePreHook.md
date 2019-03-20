---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation MongoosePreHook interface
---
# MongoosePreHook <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MongoosePreHook }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/mongoose/src/interfaces/MongooseSchemaOptions.ts#L0-L0">/packages/mongoose/src/interfaces/MongooseSchemaOptions.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> MongoosePreHook <span class="token punctuation">{</span>
    method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    fn<span class="token punctuation">:</span> <a href="/api/mongoose/interfaces/MongoosePreHookSyncCB.html"><span class="token">MongoosePreHookSyncCB</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | <a href="/api/mongoose/interfaces/MongoosePreHookAsyncCB.html"><span class="token">MongoosePreHookAsyncCB</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    parallel?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    errorCb?<span class="token punctuation">:</span> HookErrorCallback<span class="token punctuation">;</span>
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
<pre><code class="typescript-lang ">fn<span class="token punctuation">:</span> <a href="/api/mongoose/interfaces/MongoosePreHookSyncCB.html"><span class="token">MongoosePreHookSyncCB</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | <a href="/api/mongoose/interfaces/MongoosePreHookAsyncCB.html"><span class="token">MongoosePreHookAsyncCB</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">parallel?<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">errorCb?<span class="token punctuation">:</span> HookErrorCallback</code></pre>

</div>



:::