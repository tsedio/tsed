---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation IInjectableMethod interface
---
# IInjectableMethod <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IInjectableMethod }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/di/interfaces/IInjectableMethod.ts#L0-L0">/common/di/interfaces/IInjectableMethod.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IInjectableMethod&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
  target?<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
  methodName?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
  designParamTypes?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  locals?<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span>Function<span class="token punctuation">,</span> <span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">target?<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">methodName?<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">designParamTypes?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">locals?<span class="token punctuation">:</span> Map&lt<span class="token punctuation">;</span>Function<span class="token punctuation">,</span> <span class="token keyword">any</span>&gt<span class="token punctuation">;</span></code></pre>

</div>



:::