
<header class="symbol-info-header"><h1 id="handlerbuilder">HandlerBuilder</h1><label class="symbol-info-type-label class">Class</label><label class="api-type-label stable" title="stable">stable</label><label class="api-type-label private" title="private">private</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { HandlerBuilder }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/lib/mvc/class/HandlerBuilder"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/mvc/class/HandlerBuilder.ts#L0-L0">/common/mvc/class/HandlerBuilder.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> HandlerBuilder <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>handlerMetadata<span class="token punctuation">:</span> <a href="#api/common/mvc/handlermetadata"><span class="token">HandlerMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token keyword">from</span><span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span> | <a href="#api/common/mvc/endpointmetadata"><span class="token">EndpointMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> HandlerBuilder<span class="token punctuation">;</span>
    <span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>err<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> request<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> response<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> next<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> => Promise<<span class="token keyword">any</span>><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token keyword">from</span><span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span> | <a href="#api/common/mvc/endpointmetadata"><span class="token">EndpointMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/mvc/handlerbuilder"><span class="token">HandlerBuilder</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>err<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> request<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> response<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> next<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> => Promise<<span class="token keyword">any</span>></code></pre>
</div>








