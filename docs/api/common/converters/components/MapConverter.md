---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation MapConverter class
---
# MapConverter <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MapConverter }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/src/converters/components/MapConverter"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/converters/components/MapConverter.ts#L0-L0">/packages/common/src/converters/components/MapConverter.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> MapConverter <span class="token keyword">implements</span> <a href="/api/common/converters/interfaces/IConverter.html"><span class="token">IConverter</span></a> <span class="token punctuation">{</span>
    deserialize&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>data<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> baseType<span class="token punctuation">:</span> T<span class="token punctuation">,</span> deserializer<span class="token punctuation">:</span> <a href="/api/common/converters/interfaces/IDeserializer.html"><span class="token">IDeserializer</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span><span class="token punctuation">,</span> T&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    serialize&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>data<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span><span class="token punctuation">,</span> T&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> serializer<span class="token punctuation">:</span> <a href="/api/common/converters/interfaces/ISerializer.html"><span class="token">ISerializer</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Converter component for the `Map` Type.

:::


<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">deserialize&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>data<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> baseType<span class="token punctuation">:</span> T<span class="token punctuation">,</span> deserializer<span class="token punctuation">:</span> <a href="/api/common/converters/interfaces/IDeserializer.html"><span class="token">IDeserializer</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span><span class="token punctuation">,</span> T&gt<span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">serialize&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>data<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span><span class="token punctuation">,</span> T&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> serializer<span class="token punctuation">:</span> <a href="/api/common/converters/interfaces/ISerializer.html"><span class="token">ISerializer</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::