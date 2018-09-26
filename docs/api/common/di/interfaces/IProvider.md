---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation IProvider decorator
---
# IProvider <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IProvider }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/src/di/interfaces/IProvider"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.31.9/packages/common/src/di/interfaces/IProvider.ts#L0-L0">/packages/common/src/di/interfaces/IProvider.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IProvider&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    provide<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    useClass?<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
    instance?<span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    type<span class="token punctuation">:</span> <a href="/api/common/di/interfaces/ProviderType.html"><span class="token">ProviderType</span></a> | <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token punctuation">[</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">provide<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



An injection token. (Typically an instance of `Type` or `InjectionToken`, but can be `any`).



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">useClass?<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span></code></pre>

</div>



Class to instantiate for the `token`.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">instance?<span class="token punctuation">:</span> T</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">type<span class="token punctuation">:</span> <a href="/api/common/di/interfaces/ProviderType.html"><span class="token">ProviderType</span></a> | <span class="token keyword">any</span></code></pre>

</div>



Provider type



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token punctuation">[</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::