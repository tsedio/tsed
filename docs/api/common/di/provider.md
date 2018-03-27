
<header class="symbol-info-header"><h1 id="provider">Provider</h1><label class="symbol-info-type-label class">Class</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Provider }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/di/class/Provider.ts#L0-L0">/common/di/class/Provider.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> Provider<T> <span class="token keyword">implements</span> <a href="#api/common/di/iprovider"><span class="token">IProvider</span></a><T> <span class="token punctuation">{</span>
    <span class="token keyword">protected</span> _provide<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">protected</span> _useClass<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><T><span class="token punctuation">;</span>
    <span class="token keyword">protected</span> _instance<span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    <span class="token keyword">protected</span> _type<span class="token punctuation">:</span> <a href="#api/common/di/providertype"><span class="token">ProviderType</span></a> | <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>_provide<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    provide<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    useClass<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><T><span class="token punctuation">;</span>
    instance<span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    type<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> className<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _provide<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _useClass<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><T></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _instance<span class="token punctuation">:</span> T</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _type<span class="token punctuation">:</span> <a href="#api/common/di/providertype"><span class="token">ProviderType</span></a> | <span class="token keyword">any</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">provide<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">useClass<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><T></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">instance<span class="token punctuation">:</span> T</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">type<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> className<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>
</div>








