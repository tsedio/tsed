---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation IInterceptorContext interface
---
# IInterceptorContext <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IInterceptorContext }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.33.0/packages/common/src/interceptors/interfaces/IInterceptorContext.ts#L0-L0">/packages/common/src/interceptors/interfaces/IInterceptorContext.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IInterceptorContext&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    target<span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    proceed<span class="token punctuation">:</span> &lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>err?<span class="token punctuation">:</span> Error<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> T<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">target<span class="token punctuation">:</span> T</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">method<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">proceed<span class="token punctuation">:</span> &lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>err?<span class="token punctuation">:</span> Error<span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> T</code></pre>

</div>



:::