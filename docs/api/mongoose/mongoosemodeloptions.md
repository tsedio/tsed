
<header class="symbol-info-header"><h1 id="mongoosemodeloptions">MongooseModelOptions</h1><label class="symbol-info-type-label interface">Interface</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MongooseModelOptions }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//mongoose/interfaces/MongooseModelOptions.ts#L0-L0">/mongoose/interfaces/MongooseModelOptions.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> MongooseModelOptions <span class="token punctuation">{</span>
    schemaOptions?<span class="token punctuation">:</span> SchemaOptions<span class="token punctuation">;</span>
    name?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    collection?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    skipInit?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    plugins?<span class="token punctuation">:</span> <a href="#api/mongoose/mongoosepluginoptions"><span class="token">MongoosePluginOptions</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    pre?<span class="token punctuation">:</span> <a href="#api/mongoose/mongooseprehook"><span class="token">MongoosePreHook</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    post?<span class="token punctuation">:</span> <a href="#api/mongoose/mongooseposthook"><span class="token">MongoosePostHook</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>


<!-- Parameters -->

<!-- Description -->

<!-- Members -->







### Members



<div class="method-overview">
<pre><code class="typescript-lang ">schemaOptions?<span class="token punctuation">:</span> SchemaOptions</code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">name?<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">collection?<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">skipInit?<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">plugins?<span class="token punctuation">:</span> <a href="#api/mongoose/mongoosepluginoptions"><span class="token">MongoosePluginOptions</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">pre?<span class="token punctuation">:</span> <a href="#api/mongoose/mongooseprehook"><span class="token">MongoosePreHook</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>




<hr/>



<div class="method-overview">
<pre><code class="typescript-lang ">post?<span class="token punctuation">:</span> <a href="#api/mongoose/mongooseposthook"><span class="token">MongoosePostHook</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>
</div>








