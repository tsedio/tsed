
<header class="symbol-info-header"><h1 id="filterservice">FilterService</h1><label class="symbol-info-type-label service">Service</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { FilterService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/filters/services/FilterService.ts#L0-L0">/common/filters/services/FilterService.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> FilterService <span class="token keyword">extends</span> <a href="#api/core/proxyregistry"><span class="token">ProxyRegistry</span></a><<a href="#api/common/filters/filterprovider"><span class="token">FilterProvider</span></a><span class="token punctuation">,</span> <a href="#api/common/di/iprovider"><span class="token">IProvider</span></a><<span class="token keyword">any</span>>> <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>injectorService<span class="token punctuation">:</span> <a href="#api/common/di/injectorservice"><span class="token">InjectorService</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
    $<span class="token function">onInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> get<span class="token punctuation">:</span> <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span> => <a href="#api/common/filters/filterprovider"><span class="token">FilterProvider</span></a> | undefined<span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> provider<span class="token punctuation">:</span> <a href="#api/common/filters/filterprovider"><span class="token">FilterProvider</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof FilterService<span class="token punctuation">;</span>
    <span class="token keyword">static</span> has<span class="token punctuation">:</span> <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span> => <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    invoke<T <span class="token keyword">extends</span> <a href="#api/common/filters/ifilter"><span class="token">IFilter</span></a>><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><T><span class="token punctuation">,</span> locals?<span class="token punctuation">:</span> Map<Function<span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">,</span> designParamTypes?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    invokeMethod<T <span class="token keyword">extends</span> <a href="#api/common/filters/ifilter"><span class="token">IFilter</span></a>><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><T><span class="token punctuation">,</span> ...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">$<span class="token function">onInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> get<span class="token punctuation">:</span> <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span> => <a href="#api/common/filters/filterprovider"><span class="token">FilterProvider</span></a> | undefined</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> provider<span class="token punctuation">:</span> <a href="#api/common/filters/filterprovider"><span class="token">FilterProvider</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof <a href="#api/common/filters/filterservice"><span class="token">FilterService</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> has<span class="token punctuation">:</span> <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span> => <span class="token keyword">boolean</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">invoke<T <span class="token keyword">extends</span> <a href="#api/common/filters/ifilter"><span class="token">IFilter</span></a>><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><T><span class="token punctuation">,</span> locals?<span class="token punctuation">:</span> Map<Function<span class="token punctuation">,</span> <span class="token keyword">any</span>><span class="token punctuation">,</span> designParamTypes?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">invokeMethod<T <span class="token keyword">extends</span> <a href="#api/common/filters/ifilter"><span class="token">IFilter</span></a>><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><T><span class="token punctuation">,</span> ...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>








