---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Storable class
---
# Storable <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Storable }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/core"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/core/src/class/Storable.ts#L0-L0">/packages/core/src/class/Storable.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">abstract</span> <span class="token keyword">class</span> Storable <span class="token keyword">extends</span> <a href="/api/core/class/EntityDescription.html"><span class="token">EntityDescription</span></a> <span class="token punctuation">{</span>
    <span class="token keyword">protected</span> _store<span class="token punctuation">:</span> <a href="/api/core/class/Store.html"><span class="token">Store</span></a><span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>_target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> _propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> _index?<span class="token punctuation">:</span> <span class="token keyword">number</span> | PropertyDescriptor<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> store<span class="token punctuation">:</span> <a href="/api/core/class/Store.html"><span class="token">Store</span></a><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _store<span class="token punctuation">:</span> <a href="/api/core/class/Store.html"><span class="token">Store</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> store<span class="token punctuation">:</span> <a href="/api/core/class/Store.html"><span class="token">Store</span></a></code></pre>

</div>



:::