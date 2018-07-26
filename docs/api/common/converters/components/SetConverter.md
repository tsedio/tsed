---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation SetConverter class
---
# SetConverter <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { SetConverter }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/converters/components/SetConverter"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/converters/components/SetConverter.ts#L0-L0">/common/converters/components/SetConverter.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> SetConverter <span class="token keyword">implements</span> <a href="/api/common/converters/interfaces/IConverter.html"><span class="token">IConverter</span></a> <span class="token punctuation">{</span>
  deserialize&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>data<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> baseType<span class="token punctuation">:</span> T<span class="token punctuation">,</span> deserializer<span class="token punctuation">:</span> <a href="/api/common/converters/interfaces/IDeserializer.html"><span class="token">IDeserializer</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Set&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> obj<span class="token punctuation"> = </span>new Set&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    Object.<span class="token function">keys</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span>.<span class="token function">forEach</span><span class="token punctuation">(</span>key =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      obj.<span class="token function">add</span><span class="token punctuation">(</span><span class="token function">deserializer</span><span class="token punctuation">(</span>data<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">,</span> baseType<span class="token punctuation">)</span> <span class="token keyword">as</span> T<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    return obj<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  serialize&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>data<span class="token punctuation">:</span> Set&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> serializer<span class="token punctuation">:</span> <a href="/api/common/converters/interfaces/ISerializer.html"><span class="token">ISerializer</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> array<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    data.<span class="token function">forEach</span><span class="token punctuation">(</span>value =&gt<span class="token punctuation">;</span> array.<span class="token function">push</span><span class="token punctuation">(</span><span class="token function">serializer</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    return array<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Converter component for the `Set` Type.

:::


<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">deserialize&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>data<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> baseType<span class="token punctuation">:</span> T<span class="token punctuation">,</span> deserializer<span class="token punctuation">:</span> <a href="/api/common/converters/interfaces/IDeserializer.html"><span class="token">IDeserializer</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Set&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> obj<span class="token punctuation"> = </span>new Set&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 Object.<span class="token function">keys</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span>.<span class="token function">forEach</span><span class="token punctuation">(</span>key =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
   obj.<span class="token function">add</span><span class="token punctuation">(</span><span class="token function">deserializer</span><span class="token punctuation">(</span>data<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">,</span> baseType<span class="token punctuation">)</span> <span class="token keyword">as</span> T<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 return obj<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">serialize&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>data<span class="token punctuation">:</span> Set&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> serializer<span class="token punctuation">:</span> <a href="/api/common/converters/interfaces/ISerializer.html"><span class="token">ISerializer</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> array<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
 data.<span class="token function">forEach</span><span class="token punctuation">(</span>value =&gt<span class="token punctuation">;</span> array.<span class="token function">push</span><span class="token punctuation">(</span><span class="token function">serializer</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 return array<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::