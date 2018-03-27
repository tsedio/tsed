
<header class="symbol-info-header"><h1 id="createmodel">createModel</h1><label class="symbol-info-type-label function">Function</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { createModel }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//mongoose/utils/createModel.ts#L0-L0">/mongoose/utils/createModel.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function createModel<T><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> schema<span class="token punctuation">:</span> mongoose.Schema<span class="token punctuation">,</span> name?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> collection?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> skipInit?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="#api/mongoose/mongoosemodel"><span class="token">MongooseModel</span></a><T><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->


Param | Type | Description
---|---|---
 target|<code>Type<any></code>|Class attached to the schema and model.
 schema|<code>"mongoose".Schema</code>|Schema that will be attached to the model.
 name|<code>string</code>|Optional. model name
 collection|<code>string</code>|Optional. (, induced from model name)
 skipInit|<code>boolean</code>|Optional. whether to skip initialization (defaults to false)




<!-- Description -->


### Description

Create an instance of mongoose.model from a class.

<!-- Members -->

