
<header class="symbol-info-header"><h1 id="primitiveconverter">PrimitiveConverter</h1><label class="symbol-info-type-label class">Class</label><label class="api-type-label private" title="private">private</label><label class="api-type-label converters" title="converters">converters</label><label class="api-type-label component" title="component">component</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { PrimitiveConverter }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common/lib/converters/components/PrimitiveConverter"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/converters/components/PrimitiveConverter.ts#L0-L0">/common/converters/components/PrimitiveConverter.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> PrimitiveConverter <span class="token keyword">implements</span> <a href="#api/common/converters/iconverter"><span class="token">IConverter</span></a> <span class="token punctuation">{</span>
    <span class="token function">deserialize</span><span class="token punctuation">(</span>data<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> String | Number | Boolean | <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token function">serialize</span><span class="token punctuation">(</span>object<span class="token punctuation">:</span> String | Number | Boolean<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Converter component for the `String`, `Number` and `Boolean` Types.

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">deserialize</span><span class="token punctuation">(</span>data<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> String | Number | Boolean | <span class="token keyword">void</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">serialize</span><span class="token punctuation">(</span>object<span class="token punctuation">:</span> String | Number | Boolean<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>








