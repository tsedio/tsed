
<header class="symbol-info-header"><h1 id="openapiparamsbuilder">OpenApiParamsBuilder</h1><label class="symbol-info-type-label class">Class</label><label class="api-type-label private" title="private">private</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { OpenApiParamsBuilder }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger/lib/class/OpenApiParamsBuilder"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//swagger/class/OpenApiParamsBuilder.ts#L0-L0">/swagger/class/OpenApiParamsBuilder.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> OpenApiParamsBuilder <span class="token keyword">extends</span> <a href="#api/swagger/openapimodelschemabuilder"><span class="token">OpenApiModelSchemaBuilder</span></a> <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> methodClassName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this<span class="token punctuation">;</span>
    <span class="token keyword">protected</span> <span class="token function">createSchemaFromBodyParam</span><span class="token punctuation">(</span>model<span class="token punctuation">:</span> <a href="#api/common/filters/parammetadata"><span class="token">ParamMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Schema<span class="token punctuation">;</span>
    <span class="token keyword">protected</span> <span class="token function">createSchemaFromQueryParam</span><span class="token punctuation">(</span>model<span class="token punctuation">:</span> <a href="#api/common/filters/parammetadata"><span class="token">ParamMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Schema<span class="token punctuation">;</span>
    <span class="token function">completeMissingPathParams</span><span class="token punctuation">(</span>openAPIPath<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Parameter<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> parameters<span class="token punctuation">:</span> Parameter<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
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
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">createSchemaFromBodyParam</span><span class="token punctuation">(</span>model<span class="token punctuation">:</span> <a href="#api/common/filters/parammetadata"><span class="token">ParamMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Schema</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">createSchemaFromQueryParam</span><span class="token punctuation">(</span>model<span class="token punctuation">:</span> <a href="#api/common/filters/parammetadata"><span class="token">ParamMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Schema</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">completeMissingPathParams</span><span class="token punctuation">(</span>openAPIPath<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Parameter<span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> parameters<span class="token punctuation">:</span> Parameter<span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>








