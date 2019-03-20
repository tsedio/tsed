---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation IConverter interface
---
# IConverter <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IConverter }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/converters/interfaces/IConverter.ts#L0-L0">/packages/common/src/converters/interfaces/IConverter.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IConverter <span class="token punctuation">{</span>
    deserialize?<span class="token punctuation">(</span>data<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> targetType<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> baseType?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> deserializer?<span class="token punctuation">:</span> <a href="/api/common/converters/interfaces/IDeserializer.html"><span class="token">IDeserializer</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    serialize?<span class="token punctuation">(</span>object<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> serializer<span class="token punctuation">:</span> <a href="/api/common/converters/interfaces/ISerializer.html"><span class="token">ISerializer</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">deserialize?<span class="token punctuation">(</span>data<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> targetType<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> baseType?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> deserializer?<span class="token punctuation">:</span> <a href="/api/common/converters/interfaces/IDeserializer.html"><span class="token">IDeserializer</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">serialize?<span class="token punctuation">(</span>object<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> serializer<span class="token punctuation">:</span> <a href="/api/common/converters/interfaces/ISerializer.html"><span class="token">ISerializer</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::