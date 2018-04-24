
<header class="symbol-info-header"><h1 id="iinterceptorcontext">IInterceptorContext</h1><label class="symbol-info-type-label interface">Interface</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IInterceptorContext }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.14.3/src//common/interceptors/interfaces/IInterceptorContext.ts#L0-L0">/common/interceptors/interfaces/IInterceptorContext.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IInterceptorContext<T> <span class="token punctuation">{</span>
    target<span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    proceed<span class="token punctuation">:</span> <T><span class="token punctuation">(</span>err?<span class="token punctuation">:</span> Error<span class="token punctuation">)</span> => T<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">target<span class="token punctuation">:</span> T</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">method<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">proceed<span class="token punctuation">:</span> <T><span class="token punctuation">(</span>err?<span class="token punctuation">:</span> Error<span class="token punctuation">)</span> => T</code></pre>
</div>








