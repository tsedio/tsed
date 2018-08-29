---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation IInterceptor interface
---
# IInterceptor <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IInterceptor }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/interceptors/interfaces/IInterceptor.ts#L0-L0">/common/interceptors/interfaces/IInterceptor.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IInterceptor <span class="token punctuation">{</span>
  aroundInvoke<span class="token punctuation">:</span> <span class="token punctuation">(</span>ctx<span class="token punctuation">:</span> <a href="/api/common/interceptors/interfaces/IInterceptorContext.html"><span class="token">IInterceptorContext</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">aroundInvoke<span class="token punctuation">:</span> <span class="token punctuation">(</span>ctx<span class="token punctuation">:</span> <a href="/api/common/interceptors/interfaces/IInterceptorContext.html"><span class="token">IInterceptorContext</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">any</span></code></pre>

</div>



:::