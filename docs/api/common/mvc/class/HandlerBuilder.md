---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation HandlerBuilder class
---
# HandlerBuilder <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { HandlerBuilder }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/mvc/class/HandlerBuilder.ts#L0-L0">/packages/common/src/mvc/class/HandlerBuilder.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> HandlerBuilder <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>handlerMetadata<span class="token punctuation">:</span> <a href="/api/common/mvc/class/HandlerMetadata.html"><span class="token">HandlerMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token keyword">from</span><span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span> | <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> HandlerBuilder<span class="token punctuation">;</span>
    <span class="token function">build</span><span class="token punctuation">(</span>injector<span class="token punctuation">:</span> InjectorService<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>err<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> request<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> response<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> next<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> Promise&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token keyword">from</span><span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span> | <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/mvc/class/HandlerBuilder.html"><span class="token">HandlerBuilder</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">build</span><span class="token punctuation">(</span>injector<span class="token punctuation">:</span> InjectorService<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>err<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> request<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> response<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> next<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> Promise&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span></code></pre>

</div>



:::