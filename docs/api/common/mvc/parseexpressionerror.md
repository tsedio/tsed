
<header class="symbol-info-header"><h1 id="parseexpressionerror">ParseExpressionError</h1><label class="symbol-info-type-label class">Class</label><label class="api-type-label private" title="private">private</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ParseExpressionError }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"ts-express-decorators/lib/mvc/errors/ParseExpressionError"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v3.7.0/src//mvc/errors/ParseExpressionError.ts#L0-L0">/mvc/errors/ParseExpressionError.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> ParseExpressionError <span class="token keyword">extends</span> BadRequest <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp | undefined<span class="token punctuation">,</span> message?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token function">buildMessage</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp | undefined<span class="token punctuation">,</span> message?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">static</span> <span class="token function">buildMessage</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> expression<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp | undefined<span class="token punctuation">,</span> message?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>
</div>








