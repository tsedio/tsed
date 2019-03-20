---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation HandlerMetadata class
---
# HandlerMetadata <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { HandlerMetadata }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/mvc/class/HandlerMetadata.ts#L0-L0">/packages/common/src/mvc/class/HandlerMetadata.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> HandlerMetadata <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>_target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> _methodClassName?<span class="token punctuation">:</span> <span class="token keyword">string</span> | undefined<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> type<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/HandlerType.html"><span class="token">HandlerType</span></a><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> errorParam<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> injectable<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> nextFunction<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> methodClassName<span class="token punctuation">:</span> <span class="token keyword">string</span> | undefined<span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> services<span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> type<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/HandlerType.html"><span class="token">HandlerType</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> errorParam<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> injectable<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> nextFunction<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> methodClassName<span class="token punctuation">:</span> <span class="token keyword">string</span> | undefined</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> services<span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::