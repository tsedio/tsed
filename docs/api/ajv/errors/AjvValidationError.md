---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation AjvValidationError class
---
# AjvValidationError <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { AjvValidationError }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/ajv/src/errors/AjvValidationError"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/ajv/src/errors/AjvValidationError.ts#L0-L0">/packages/ajv/src/errors/AjvValidationError.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> AjvValidationError <span class="token keyword">extends</span> Error <span class="token keyword">implements</span> <a href="/api/common/mvc/interfaces/IResponseError.html"><span class="token">IResponseError</span></a> <span class="token punctuation">{</span>
    name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    errors<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>message<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> errors<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">name<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">errors<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::