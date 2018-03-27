
<header class="symbol-info-header"><h1 id="openapimodelschemabuilder">OpenApiModelSchemaBuilder</h1><label class="symbol-info-type-label class">Class</label><label class="api-type-label private" title="private">private</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { OpenApiModelSchemaBuilder }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger/lib/class/OpenApiModelSchemaBuilder"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//swagger/class/OpenApiModelSchemaBuilder.ts#L0-L0">/swagger/class/OpenApiModelSchemaBuilder.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> OpenApiModelSchemaBuilder <span class="token punctuation">{</span>
    <span class="token keyword">protected</span> _definitions<span class="token punctuation">:</span> <a href="#api/swagger/openapidefinitions"><span class="token">OpenApiDefinitions</span></a><span class="token punctuation">;</span>
    <span class="token keyword">protected</span> _responses<span class="token punctuation">:</span> <a href="#api/swagger/openapiresponses"><span class="token">OpenApiResponses</span></a><span class="token punctuation">;</span>
    <span class="token keyword">protected</span> _schema<span class="token punctuation">:</span> Schema<span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this<span class="token punctuation">;</span>
    <span class="token keyword">protected</span> <span class="token function">createSchema</span><span class="token punctuation">(</span>model<span class="token punctuation">:</span> <a href="#api/core/storable"><span class="token">Storable</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Schema<span class="token punctuation">;</span>
    <span class="token keyword">protected</span> <span class="token function">getClassSchema</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Schema<span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> schema<span class="token punctuation">:</span> Schema<span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> definitions<span class="token punctuation">:</span> <a href="#api/swagger/openapidefinitions"><span class="token">OpenApiDefinitions</span></a><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> responses<span class="token punctuation">:</span> <a href="#api/swagger/openapiresponses"><span class="token">OpenApiResponses</span></a><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Build a Schema from a given Model.

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _definitions<span class="token punctuation">:</span> <a href="#api/swagger/openapidefinitions"><span class="token">OpenApiDefinitions</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _responses<span class="token punctuation">:</span> <a href="#api/swagger/openapiresponses"><span class="token">OpenApiResponses</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _schema<span class="token punctuation">:</span> Schema</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this</code></pre>
</div>


Build the Schema and his properties.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">createSchema</span><span class="token punctuation">(</span>model<span class="token punctuation">:</span> <a href="#api/core/storable"><span class="token">Storable</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Schema</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">getClassSchema</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Schema</code></pre>
</div>


Return the stored Schema of the class if exists. Otherwise, return an empty Schema.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> schema<span class="token punctuation">:</span> Schema</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> definitions<span class="token punctuation">:</span> <a href="#api/swagger/openapidefinitions"><span class="token">OpenApiDefinitions</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> responses<span class="token punctuation">:</span> <a href="#api/swagger/openapiresponses"><span class="token">OpenApiResponses</span></a></code></pre>
</div>








