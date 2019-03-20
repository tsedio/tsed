---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ParseExpressionError class
---
# ParseExpressionError <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ParseExpressionError }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/mvc/errors/ParseExpressionError.ts#L0-L0">/packages/common/src/mvc/errors/ParseExpressionError.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> ParseExpressionError <span class="token keyword">extends</span> BadRequest <span class="token keyword">implements</span> <a href="/api/common/mvc/interfaces/IResponseError.html"><span class="token">IResponseError</span></a> <span class="token punctuation">{</span>
    dataPath<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    requestType<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    errorMessage<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    origin<span class="token punctuation">:</span> Error<span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp | undefined<span class="token punctuation">,</span> err?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">buildMessage</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp | undefined<span class="token punctuation">,</span> message?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">dataPath<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">requestType<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">errorMessage<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">origin<span class="token punctuation">:</span> Error</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">buildMessage</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp | undefined<span class="token punctuation">,</span> message?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::