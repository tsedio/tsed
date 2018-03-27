
<header class="symbol-info-header"><h1 id="propertyregistry">PropertyRegistry</h1><label class="symbol-info-type-label class">Class</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { PropertyRegistry }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/jsonschema/registries/PropertyRegistry.ts#L0-L0">/common/jsonschema/registries/PropertyRegistry.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> PropertyRegistry <span class="token punctuation">{</span>
    <span class="token keyword">static</span> <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/jsonschema/propertymetadata"><span class="token">PropertyMetadata</span></a><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">getProperties</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> Map<<span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> <a href="#api/common/jsonschema/propertymetadata"><span class="token">PropertyMetadata</span></a>><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">getOwnProperties</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> Map<<span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> <a href="#api/common/jsonschema/propertymetadata"><span class="token">PropertyMetadata</span></a>><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> property<span class="token punctuation">:</span> <a href="#api/common/jsonschema/propertymetadata"><span class="token">PropertyMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">required</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> allowedRequiredValues?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof PropertyRegistry<span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">decorate</span><span class="token punctuation">(</span>fn<span class="token punctuation">:</span> <span class="token punctuation">(</span>propertyMetadata<span class="token punctuation">:</span> <a href="#api/common/jsonschema/propertymetadata"><span class="token">PropertyMetadata</span></a><span class="token punctuation">,</span> parameters<span class="token punctuation">:</span> <a href="#api/core/decoratorparameters"><span class="token">DecoratorParameters</span></a><span class="token punctuation">)</span> => <span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/jsonschema/propertymetadata"><span class="token">PropertyMetadata</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">getProperties</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> Map<<span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> <a href="#api/common/jsonschema/propertymetadata"><span class="token">PropertyMetadata</span></a>></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">getOwnProperties</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> Map<<span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> <a href="#api/common/jsonschema/propertymetadata"><span class="token">PropertyMetadata</span></a>></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> property<span class="token punctuation">:</span> <a href="#api/common/jsonschema/propertymetadata"><span class="token">PropertyMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">required</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> allowedRequiredValues?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> typeof <a href="#api/common/jsonschema/propertyregistry"><span class="token">PropertyRegistry</span></a></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">decorate</span><span class="token punctuation">(</span>fn<span class="token punctuation">:</span> <span class="token punctuation">(</span>propertyMetadata<span class="token punctuation">:</span> <a href="#api/common/jsonschema/propertymetadata"><span class="token">PropertyMetadata</span></a><span class="token punctuation">,</span> parameters<span class="token punctuation">:</span> <a href="#api/core/decoratorparameters"><span class="token">DecoratorParameters</span></a><span class="token punctuation">)</span> => <span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function</code></pre>
</div>








