---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation createModel function
---
# createModel <Badge text="Function" type="function"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { createModel }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/mongoose/src/utils/createModel.ts#L0-L0">/packages/mongoose/src/utils/createModel.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function createModel&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> schema<span class="token punctuation">:</span> mongoose.<a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a><span class="token punctuation">,</span> name?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> collection?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> skipInit?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/mongoose/interfaces/MongooseModel.html"><span class="token">MongooseModel</span></a>&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">;</span></code></pre>




<!-- Params -->
Param | Type | Description
---|---|---
 target|<code>Type&lt;any&gt;</code>|Class attached to the schema and model.  schema|<code>"mongoose".Schema</code>|Schema that will be attached to the model.  name|<code>string</code>|Optional. model name  collection|<code>string</code>|Optional. (, induced from model name)  skipInit|<code>boolean</code>|Optional. whether to skip initialization (defaults to false) 



<!-- Description -->
## Description

::: v-pre

Create an instance of mongoose.model from a class.


:::