---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation CyclicReferenceError class
---
# CyclicReferenceError <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { CyclicReferenceError }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/mvc/errors/CyclicReferenceError.ts#L0-L0">/common/mvc/errors/CyclicReferenceError.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> CyclicReferenceError <span class="token keyword">extends</span> InternalServerError <span class="token punctuation">{</span>
  name<span class="token punctuation"> = </span><span class="token string">"CYCLIC_REFERENCE_ERROR"</span><span class="token punctuation">;</span>
  <span class="token keyword">constructor</span><span class="token punctuation">(</span>c1<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> c2<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">super</span><span class="token punctuation">(</span>CyclicReferenceError.<span class="token function">buildMessage</span><span class="token punctuation">(</span>c1<span class="token punctuation">,</span> c2<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">static</span> <span class="token function">buildMessage</span><span class="token punctuation">(</span>c1<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> c2<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return `Cyclic reference between $<span class="token punctuation">{</span><span class="token function">nameOf</span><span class="token punctuation">(</span>c1<span class="token punctuation">)</span><span class="token punctuation">}</span> and $<span class="token punctuation">{</span><span class="token function">nameOf</span><span class="token punctuation">(</span>c2<span class="token punctuation">)</span><span class="token punctuation">}</span>.`<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">name<span class="token punctuation"> = </span><span class="token string">"CYCLIC_REFERENCE_ERROR"</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">buildMessage</span><span class="token punctuation">(</span>c1<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> c2<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 return `Cyclic reference between $<span class="token punctuation">{</span><span class="token function">nameOf</span><span class="token punctuation">(</span>c1<span class="token punctuation">)</span><span class="token punctuation">}</span> and $<span class="token punctuation">{</span><span class="token function">nameOf</span><span class="token punctuation">(</span>c2<span class="token punctuation">)</span><span class="token punctuation">}</span>.`<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::