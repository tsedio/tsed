---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ProxyRegistry class
---
# ProxyRegistry <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ProxyRegistry }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/core"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/core/src/class/ProxyRegistry.ts#L0-L0">/packages/core/src/class/ProxyRegistry.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">abstract</span> <span class="token keyword">class</span> ProxyRegistry&lt<span class="token punctuation">;</span>T<span class="token punctuation">,</span> I&gt<span class="token punctuation">;</span> <span class="token keyword">extends</span> <a href="/api/core/class/ProxyMap.html"><span class="token">ProxyMap</span></a>&lt<span class="token punctuation">;</span><a href="/api/core/class/RegistryKey.html"><span class="token">RegistryKey</span></a><span class="token punctuation">,</span> T&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token keyword">protected</span> registry<span class="token punctuation">:</span> <a href="/api/core/class/Registry.html"><span class="token">Registry</span></a>&lt<span class="token punctuation">;</span>T<span class="token punctuation">,</span> I&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>registry<span class="token punctuation">:</span> <a href="/api/core/class/Registry.html"><span class="token">Registry</span></a>&lt<span class="token punctuation">;</span>T<span class="token punctuation">,</span> I&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="/api/core/class/RegistryKey.html"><span class="token">RegistryKey</span></a><span class="token punctuation">,</span> value<span class="token punctuation">:</span> T<span class="token punctuation">)</span><span class="token punctuation">:</span> this<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> registry<span class="token punctuation">:</span> <a href="/api/core/class/Registry.html"><span class="token">Registry</span></a>&lt<span class="token punctuation">;</span>T<span class="token punctuation">,</span> I&gt<span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="/api/core/class/RegistryKey.html"><span class="token">RegistryKey</span></a><span class="token punctuation">,</span> value<span class="token punctuation">:</span> T<span class="token punctuation">)</span><span class="token punctuation">:</span> this</code></pre>

</div>



:::