
<header class="symbol-info-header"><h1 id="mapconverter">MapConverter</h1><label class="symbol-info-type-label class">Class</label><label class="api-type-label private" title="private">private</label><label class="api-type-label converters" title="converters">converters</label><label class="api-type-label component" title="component">component</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MapConverter }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/lib/converters/components/MapConverter"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/converters/components/MapConverter.ts#L0-L0">/common/converters/components/MapConverter.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> MapConverter <span class="token keyword">implements</span> <a href="#api/common/converters/iconverter"><span class="token">IConverter</span></a> <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>converterService<span class="token punctuation">:</span> <a href="#api/common/converters/converterservice"><span class="token">ConverterService</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
    deserialize<T><span class="token punctuation">(</span>data<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> baseType<span class="token punctuation">:</span> T<span class="token punctuation">,</span> deserializer<span class="token punctuation">:</span> <a href="#api/common/converters/ideserializer"><span class="token">IDeserializer</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Map<<span class="token keyword">string</span><span class="token punctuation">,</span> T><span class="token punctuation">;</span>
    serialize<T><span class="token punctuation">(</span>data<span class="token punctuation">:</span> Map<<span class="token keyword">string</span><span class="token punctuation">,</span> T><span class="token punctuation">,</span> serializer<span class="token punctuation">:</span> <a href="#api/common/converters/iserializer"><span class="token">ISerializer</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Converter component for the `Map` Type.

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">deserialize<T><span class="token punctuation">(</span>data<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> baseType<span class="token punctuation">:</span> T<span class="token punctuation">,</span> deserializer<span class="token punctuation">:</span> <a href="#api/common/converters/ideserializer"><span class="token">IDeserializer</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Map<<span class="token keyword">string</span><span class="token punctuation">,</span> T></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">serialize<T><span class="token punctuation">(</span>data<span class="token punctuation">:</span> Map<<span class="token keyword">string</span><span class="token punctuation">,</span> T><span class="token punctuation">,</span> serializer<span class="token punctuation">:</span> <a href="#api/common/converters/iserializer"><span class="token">ISerializer</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>








