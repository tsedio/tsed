
<header class="symbol-info-header"><h1 id="providerstorable">ProviderStorable</h1><label class="symbol-info-type-label class">Class</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ProviderStorable }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/di/class/ProviderStorable.ts#L0-L0">/common/di/class/ProviderStorable.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> ProviderStorable<T> <span class="token keyword">extends</span> <a href="#api/common/di/provider"><span class="token">Provider</span></a><T> <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>provide<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    useClass<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><T><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> store<span class="token punctuation">:</span> <a href="#api/core/store"><span class="token">Store</span></a><span class="token punctuation">;</span>
    scope<span class="token punctuation">:</span> <a href="#api/common/di/providerscope"><span class="token">ProviderScope</span></a><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">useClass<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><T></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> store<span class="token punctuation">:</span> <a href="#api/core/store"><span class="token">Store</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">scope<span class="token punctuation">:</span> <a href="#api/common/di/providerscope"><span class="token">ProviderScope</span></a></code></pre>
</div>


Change the scope value of the provider.







