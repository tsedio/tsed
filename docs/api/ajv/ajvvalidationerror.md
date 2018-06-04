
<header class="symbol-info-header"><h1 id="ajvvalidationerror">AjvValidationError</h1><label class="symbol-info-type-label class">Class</label><label class="api-type-label private" title="private">private</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { AjvValidationError }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/ajv/lib/errors/AjvValidationError"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.20.0/src//ajv/errors/AjvValidationError.ts#L0-L0">/ajv/errors/AjvValidationError.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> AjvValidationError <span class="token keyword">extends</span> Error <span class="token keyword">implements</span> <a href="#api/common/mvc/iresponseerror"><span class="token">IResponseError</span></a> <span class="token punctuation">{</span>
    name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    errors<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>message<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> errors<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">name<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">errors<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>








