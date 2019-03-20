---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation SymbolConverter class
---
# SymbolConverter <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { SymbolConverter }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/src/converters/components/SymbolConverter"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/converters/components/SymbolConverter.ts#L0-L0">/packages/common/src/converters/components/SymbolConverter.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> SymbolConverter <span class="token keyword">implements</span> <a href="/api/common/converters/interfaces/IConverter.html"><span class="token">IConverter</span></a> <span class="token punctuation">{</span>
    <span class="token function">deserialize</span><span class="token punctuation">(</span>data<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> symbol<span class="token punctuation">;</span>
    <span class="token function">serialize</span><span class="token punctuation">(</span>object<span class="token punctuation">:</span> Symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Converter component for the `Symbol` Type.

:::


<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">deserialize</span><span class="token punctuation">(</span>data<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> symbol</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">serialize</span><span class="token punctuation">(</span>object<span class="token punctuation">:</span> Symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::