
<header class="symbol-info-header"><h1 id="iinterceptor">IInterceptor</h1><label class="symbol-info-type-label interface">Interface</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IInterceptor }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.13.0/src//common/interceptors/interfaces/IInterceptor.ts#L0-L0">/common/interceptors/interfaces/IInterceptor.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IInterceptor <span class="token punctuation">{</span>
    aroundInvoke<span class="token punctuation">:</span> <span class="token punctuation">(</span>ctx<span class="token punctuation">:</span> <a href="#api/common/interceptors/iinterceptorcontext"><span class="token">IInterceptorContext</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> => <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">aroundInvoke<span class="token punctuation">:</span> <span class="token punctuation">(</span>ctx<span class="token punctuation">:</span> <a href="#api/common/interceptors/iinterceptorcontext"><span class="token">IInterceptorContext</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> => <span class="token keyword">any</span></code></pre>
</div>








