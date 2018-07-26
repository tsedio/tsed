---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ConverterDeserializationError class
---
# ConverterDeserializationError <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ConverterDeserializationError }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/converters/errors/ConverterDeserializationError"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/converters/errors/ConverterDeserializationError.ts#L0-L0">/common/converters/errors/ConverterDeserializationError.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> ConverterDeserializationError <span class="token keyword">extends</span> InternalServerError <span class="token punctuation">{</span>
  name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation"> = </span><span class="token string">"CONVERTER_DESERIALIZATION_ERROR"</span><span class="token punctuation">;</span>
  stack<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
  <span class="token keyword">constructor</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> err<span class="token punctuation">:</span> Error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">super</span><span class="token punctuation">(</span>ConverterDeserializationError.<span class="token function">buildMessage</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> obj<span class="token punctuation">,</span> err<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    this.stack<span class="token punctuation"> = </span>err.stack<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">static</span> <span class="token function">buildMessage</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> err<span class="token punctuation">:</span> Error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return `Conversion failed for <span class="token keyword">class</span> "$<span class="token punctuation">{</span><span class="token function">nameOf</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">}</span>" with object =&gt<span class="token punctuation">;</span> $<span class="token punctuation">{</span>JSON.<span class="token function">stringify</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">}</span>.\n$<span class="token punctuation">{</span>err.message<span class="token punctuation">}</span>`.<span class="token function">trim</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation"> = </span><span class="token string">"CONVERTER_DESERIALIZATION_ERROR"</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">stack<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">buildMessage</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> err<span class="token punctuation">:</span> Error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
 return `Conversion failed for <span class="token keyword">class</span> "$<span class="token punctuation">{</span><span class="token function">nameOf</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">}</span>" with object =&gt<span class="token punctuation">;</span> $<span class="token punctuation">{</span>JSON.<span class="token function">stringify</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">}</span>.\n$<span class="token punctuation">{</span>err.message<span class="token punctuation">}</span>`.<span class="token function">trim</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::