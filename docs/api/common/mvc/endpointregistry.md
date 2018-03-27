
<header class="symbol-info-header"><h1 id="endpointregistry">EndpointRegistry</h1><label class="symbol-info-type-label class">Class</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { EndpointRegistry }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/mvc/registries/EndpointRegistry.ts#L0-L0">/common/mvc/registries/EndpointRegistry.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> EndpointRegistry <span class="token punctuation">{</span>
    <span class="token keyword">static</span> <span class="token function">inherit</span><span class="token punctuation">(</span>ctrlClass<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">getEndpoints</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/mvc/endpointmetadata"><span class="token">EndpointMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">hasEndpoints</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/mvc/endpointmetadata"><span class="token">EndpointMetadata</span></a><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">has</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">useBefore</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof EndpointRegistry<span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">use</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof EndpointRegistry<span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">useAfter</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof EndpointRegistry<span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">store</span><span class="token punctuation">(</span>targetClass<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> methodClassName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/core/store"><span class="token">Store</span></a><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Registry for all Endpoint collected on a provide.

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">inherit</span><span class="token punctuation">(</span>ctrlClass<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>
</div>


Retrieve all endpoints from inherited class and store it in the registry.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">getEndpoints</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/mvc/endpointmetadata"><span class="token">EndpointMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>


Get endpoints by his target.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">hasEndpoints</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>


Gets a value indicating whether the target object or its prototype chain has endpoints.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/mvc/endpointmetadata"><span class="token">EndpointMetadata</span></a></code></pre>
</div>


Get an endpoint.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">has</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>


Gets a value indicating whether the target object or its prototype chain has already method registered.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">useBefore</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof <a href="#api/common/mvc/endpointregistry"><span class="token">EndpointRegistry</span></a></code></pre>
</div>


Append mvc in the pool (before).



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">use</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof <a href="#api/common/mvc/endpointregistry"><span class="token">EndpointRegistry</span></a></code></pre>
</div>


Add middleware and configuration for the endpoint.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">useAfter</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof <a href="#api/common/mvc/endpointregistry"><span class="token">EndpointRegistry</span></a></code></pre>
</div>


Append mvc in the pool (after).



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">store</span><span class="token punctuation">(</span>targetClass<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> methodClassName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/core/store"><span class="token">Store</span></a></code></pre>
</div>


Store a data on store manager.







