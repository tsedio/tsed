---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation RegistrySettings decorator
---
# RegistrySettings <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { RegistrySettings }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/src/di/interfaces/RegistrySettings"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.31.4/packages/common/src/di/interfaces/RegistrySettings.ts#L0-L0">/packages/common/src/di/interfaces/RegistrySettings.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> RegistrySettings <span class="token punctuation">{</span>
    registry<span class="token punctuation">:</span> <a href="/api/core/class/Registry.html"><span class="token">Registry</span></a>&lt<span class="token punctuation">;</span><a href="/api/common/di/class/Provider.html"><span class="token">Provider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> <a href="/api/common/di/interfaces/IProvider.html"><span class="token">IProvider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    injectable<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    buildable<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    onInvoke?<span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/common/di/class/Provider.html"><span class="token">Provider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> locals<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span> | Function<span class="token punctuation">,</span> <span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> designParamTypes<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">registry<span class="token punctuation">:</span> <a href="/api/core/class/Registry.html"><span class="token">Registry</span></a>&lt<span class="token punctuation">;</span><a href="/api/common/di/class/Provider.html"><span class="token">Provider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> <a href="/api/common/di/interfaces/IProvider.html"><span class="token">IProvider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span>&gt<span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">injectable<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">buildable<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">onInvoke?<span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/common/di/class/Provider.html"><span class="token">Provider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> locals<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span><span class="token keyword">string</span> | Function<span class="token punctuation">,</span> <span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> designParamTypes<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>

</div>



:::