
<header class="symbol-info-header"><h1 id="proxyregistry">ProxyRegistry</h1><label class="symbol-info-type-label class">Class</label><label class="api-type-label private" title="private">private</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ProxyRegistry }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/core"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.23.1/src//core/class/ProxyRegistry.ts#L0-L0">/core/class/ProxyRegistry.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">abstract</span> <span class="token keyword">class</span> ProxyRegistry<T<span class="token punctuation">,</span> I> <span class="token keyword">extends</span> <a href="#api/core/proxymap"><span class="token">ProxyMap</span></a><<a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">,</span> T> <span class="token punctuation">{</span>
    <span class="token keyword">protected</span> registry<span class="token punctuation">:</span> <a href="#api/core/registry"><span class="token">Registry</span></a><T<span class="token punctuation">,</span> I><span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>registry<span class="token punctuation">:</span> <a href="#api/core/registry"><span class="token">Registry</span></a><T<span class="token punctuation">,</span> I><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">,</span> value<span class="token punctuation">:</span> T<span class="token punctuation">)</span><span class="token punctuation">:</span> this<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> registry<span class="token punctuation">:</span> <a href="#api/core/registry"><span class="token">Registry</span></a><T<span class="token punctuation">,</span> I></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <a href="#api/core/registrykey"><span class="token">RegistryKey</span></a><span class="token punctuation">,</span> value<span class="token punctuation">:</span> T<span class="token punctuation">)</span><span class="token punctuation">:</span> this</code></pre>
</div>








