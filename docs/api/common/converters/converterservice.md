
<header class="symbol-info-header"><h1 id="converterservice">ConverterService</h1><label class="symbol-info-type-label service">Service</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ConverterService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/converters/services/ConverterService.ts#L0-L0">/common/converters/services/ConverterService.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> ConverterService <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>injectorService<span class="token punctuation">:</span> <a href="#api/common/di/injectorservice"><span class="token">InjectorService</span></a><span class="token punctuation">,</span> serverSettings<span class="token punctuation">:</span> <a href="#api/common/config/serversettingsservice"><span class="token">ServerSettingsService</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">getPropertyMetadata</span><span class="token punctuation">(</span>properties<span class="token punctuation">:</span> Map<<span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> <a href="#api/common/jsonschema/propertymetadata"><span class="token">PropertyMetadata</span></a>><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/jsonschema/propertymetadata"><span class="token">PropertyMetadata</span></a> | undefined<span class="token punctuation">;</span>
    <span class="token function">serialize</span><span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <a href="#api/common/converters/iconverteroptions"><span class="token">IConverterOptions</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token function">serializeClass</span><span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <a href="#api/common/converters/iconverteroptions"><span class="token">IConverterOptions</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token function">deserialize</span><span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> targetType<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> baseType?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <a href="#api/common/converters/iconverteroptions"><span class="token">IConverterOptions</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token function">getConverter</span><span class="token punctuation">(</span>targetType<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/converters/iconverter"><span class="token">IConverter</span></a> | undefined<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">getPropertyMetadata</span><span class="token punctuation">(</span>properties<span class="token punctuation">:</span> Map<<span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> <a href="#api/common/jsonschema/propertymetadata"><span class="token">PropertyMetadata</span></a>><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/jsonschema/propertymetadata"><span class="token">PropertyMetadata</span></a> | undefined</code></pre>
</div>


Return a JsonMetadata for a properties.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">serialize</span><span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <a href="#api/common/converters/iconverteroptions"><span class="token">IConverterOptions</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>


Convert instance to plainObject.

### Options

- `checkRequiredValue`: Disable the required check condition.




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">serializeClass</span><span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <a href="#api/common/converters/iconverteroptions"><span class="token">IConverterOptions</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">deserialize</span><span class="token punctuation">(</span>obj<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> targetType<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> baseType?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <a href="#api/common/converters/iconverteroptions"><span class="token">IConverterOptions</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>


Param | Type | Description
---|---|---
 obj|<code>any</code>|Object source that will be deserialized
 targetType|<code>any</code>|Pattern of the object deserialized





Convert a plainObject to targetType.

### Options

- `ignoreCallback`: callback called for each object which will be deserialized. The callback can return a boolean to avoid the default converter behavior.
- `checkRequiredValue`: Disable the required check condition.




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">getConverter</span><span class="token punctuation">(</span>targetType<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/common/converters/iconverter"><span class="token">IConverter</span></a> | undefined</code></pre>
</div>








