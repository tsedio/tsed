---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation HandlerMetadata class
---
# HandlerMetadata <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { HandlerMetadata }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.18.0/packages/common/src/mvc/class/HandlerMetadata.ts#L0-L0">/packages/common/src/mvc/class/HandlerMetadata.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> HandlerMetadata <span class="token punctuation">{</span>
    <span class="token keyword">readonly</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> token<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> methodClassName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> injectable<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> type<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/HandlerType.html"><span class="token">HandlerType</span></a><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> hasErrorParam<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> hasNextFunction<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    handler<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>options<span class="token punctuation">:</span> <a href="/api/common/mvc/class/IHandlerOptions.html"><span class="token">IHandlerOptions</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> services<span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token function">getParams</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token function">hasParamType</span><span class="token punctuation">(</span>paramType<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> token<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> methodClassName<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> method<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

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
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> type<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/HandlerType.html"><span class="token">HandlerType</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> hasErrorParam<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> hasNextFunction<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">handler<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> services<span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">getParams</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">hasParamType</span><span class="token punctuation">(</span>paramType<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::