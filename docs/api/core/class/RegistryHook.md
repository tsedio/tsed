---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation RegistryHook interface
---
# RegistryHook <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { RegistryHook }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/core"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/core/src/class/Registry.ts#L0-L0">/packages/core/src/class/Registry.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> RegistryHook&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    onCreate?<span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="/api/core/class/RegistryKey.html"><span class="token">RegistryKey</span></a><span class="token punctuation">,</span> item<span class="token punctuation">:</span> T<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">onCreate?<span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="/api/core/class/RegistryKey.html"><span class="token">RegistryKey</span></a><span class="token punctuation">,</span> item<span class="token punctuation">:</span> T<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>

</div>



:::