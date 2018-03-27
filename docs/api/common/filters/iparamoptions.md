
<header class="symbol-info-header"><h1 id="iparamoptions">IParamOptions</h1><label class="symbol-info-type-label interface">Interface</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IParamOptions }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/filters/interfaces/IParamOptions.ts#L0-L0">/common/filters/interfaces/IParamOptions.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IParamOptions<T> <span class="token punctuation">{</span>
    required?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    expression?<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">;</span>
    useType?<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><T><span class="token punctuation">;</span>
    baseType?<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><T><span class="token punctuation">;</span>
    useConverter?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    useValidation?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">required?<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">expression?<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">useType?<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><T></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">baseType?<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><T></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">useConverter?<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">useValidation?<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>








