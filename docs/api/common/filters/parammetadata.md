
<header class="symbol-info-header"><h1 id="parammetadata">ParamMetadata</h1><label class="symbol-info-type-label class">Class</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ParamMetadata }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/filters/class/ParamMetadata.ts#L0-L0">/common/filters/class/ParamMetadata.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> ParamMetadata <span class="token keyword">extends</span> <a href="#api/core/storable"><span class="token">Storable</span></a> <span class="token keyword">implements</span> <a href="#api/common/filters/iparamoptions"><span class="token">IParamOptions</span></a><<span class="token keyword">any</span>> <span class="token punctuation">{</span>
    <span class="token keyword">protected</span> _expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">;</span>
    <span class="token keyword">protected</span> _useConverter<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">protected</span> _service<span class="token punctuation">:</span> <span class="token keyword">string</span> | <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>> | symbol<span class="token punctuation">;</span>
    <span class="token keyword">protected</span> _required<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">;</span>
    service<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>> | symbol<span class="token punctuation">;</span>
    useConverter<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    useValidation<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    required<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    allowedRequiredValues<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token function">isValidRequiredValue</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token function">toJSON</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
        service<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">;</span>
        required<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
        use<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        baseType<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _useConverter<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _service<span class="token punctuation">:</span> <span class="token keyword">string</span> | <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>> | symbol</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> _required<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>


Required entity.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">service<span class="token punctuation">:</span> <a href="#api/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>> | symbol</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">useConverter<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">useValidation<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">required<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>


Change the state of the required data.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">allowedRequiredValues<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>


Set the allowed values when the value is required.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">isValidRequiredValue</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>


This method use `EntityDescription.required` and `allowedRequiredValues` to validate the value.



<hr/>



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">toJSON</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>
     service<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp<span class="token punctuation">;</span>
     required<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
     use<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     baseType<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>
</div>








