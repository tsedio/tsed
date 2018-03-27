
<header class="symbol-info-header"><h1 id="mongooseprehooksynccb">MongoosePreHookSyncCB</h1><label class="symbol-info-type-label interface">Interface</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MongoosePreHookSyncCB }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//mongoose/interfaces/MongooseModelOptions.ts#L0-L0">/mongoose/interfaces/MongooseModelOptions.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> MongoosePreHookSyncCB<T> <span class="token punctuation">{</span>
    <span class="token punctuation">(</span>doc<span class="token punctuation">:</span> <a href="#api/mongoose/mongoosedocument"><span class="token">MongooseDocument</span></a><T><span class="token punctuation">,</span> next<span class="token punctuation">:</span> HookNextFunction<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang "><span class="token punctuation">(</span>doc<span class="token punctuation">:</span> <a href="#api/mongoose/mongoosedocument"><span class="token">MongooseDocument</span></a><T><span class="token punctuation">,</span> next<span class="token punctuation">:</span> HookNextFunction<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>
</div>








