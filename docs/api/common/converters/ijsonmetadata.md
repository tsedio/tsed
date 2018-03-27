
<header class="symbol-info-header"><h1 id="ijsonmetadata">IJsonMetadata</h1><label class="symbol-info-type-label interface">Interface</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IJsonMetadata }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/converters/interfaces/IJsonMetadata.ts#L0-L0">/common/converters/interfaces/IJsonMetadata.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IJsonMetadata<T> <span class="token punctuation">{</span>
    name?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    use?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        new <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    isCollection?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    baseType?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">name?<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">propertyKey?<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">use?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     new <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">isCollection?<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">baseType?<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>








