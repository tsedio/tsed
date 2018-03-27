
<header class="symbol-info-header"><h1 id="openapiendpointbuilder">OpenApiEndpointBuilder</h1><label class="symbol-info-type-label class">Class</label><label class="api-type-label private" title="private">private</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { OpenApiEndpointBuilder }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger/lib/class/OpenApiEndpointBuilder"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//swagger/class/OpenApiEndpointBuilder.ts#L0-L0">/swagger/class/OpenApiEndpointBuilder.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> OpenApiEndpointBuilder <span class="token keyword">extends</span> <a href="#api/swagger/openapimodelschemabuilder"><span class="token">OpenApiModelSchemaBuilder</span></a> <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>endpoint<span class="token punctuation">:</span> <a href="#api/common/mvc/endpointmetadata"><span class="token">EndpointMetadata</span></a><span class="token punctuation">,</span> endpointUrl<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> pathMethod<span class="token punctuation">:</span> <a href="#api/common/mvc/expresspathmethod"><span class="token">ExpressPathMethod</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this<span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> paths<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        <span class="token punctuation">[</span>p<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> Path<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> paths<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     <span class="token punctuation">[</span>p<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> Path<span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>
</div>








