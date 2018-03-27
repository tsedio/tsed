
<header class="symbol-info-header"><h1 id="mongooseposthook">MongoosePostHook</h1><label class="symbol-info-type-label interface">Interface</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MongoosePostHook }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//mongoose/interfaces/MongooseModelOptions.ts#L0-L0">/mongoose/interfaces/MongooseModelOptions.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> MongoosePostHook <span class="token punctuation">{</span>
    method<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    fn<span class="token punctuation">:</span> <a href="#api/mongoose/mongooseposthookcb"><span class="token">MongoosePostHookCB</span></a><<span class="token keyword">any</span>> | <a href="#api/mongoose/mongooseposterrorhookcb"><span class="token">MongoosePostErrorHookCB</span></a><<span class="token keyword">any</span>><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">method<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">fn<span class="token punctuation">:</span> <a href="#api/mongoose/mongooseposthookcb"><span class="token">MongoosePostHookCB</span></a><<span class="token keyword">any</span>> | <a href="#api/mongoose/mongooseposterrorhookcb"><span class="token">MongoosePostErrorHookCB</span></a><<span class="token keyword">any</span>></code></pre>
</div>








