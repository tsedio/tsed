---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ValidationErrorMiddleware class
---
# ValidationErrorMiddleware <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ValidationErrorMiddleware }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose/middlewares/ValidationErrorMiddleware"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//mongoose/middlewares/ValidationErrorMiddleware.ts#L0-L0">/mongoose/middlewares/ValidationErrorMiddleware.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> ValidationErrorMiddleware <span class="token punctuation">{</span>
  <span class="token function">use</span><span class="token punctuation">(</span>@<span class="token function"><a href="/api/common/filters/decorators/Err.html"><span class="token">Err</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> error<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> @<span class="token function"><a href="/api/common/filters/decorators/Next.html"><span class="token">Next</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> next<span class="token punctuation">:</span> Express.NextFunction<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span>error && <span class="token function">nameOf</span><span class="token punctuation">(</span><span class="token function">getClass</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span> === <span class="token string">"MongooseError"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> err<span class="token punctuation"> = </span>new <span class="token function">BadRequest</span><span class="token punctuation">(</span>error.message<span class="token punctuation">)</span><span class="token punctuation">;</span>
      err.stack<span class="token punctuation"> = </span>error.stack<span class="token punctuation">;</span>
      throw err<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token function">next</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">use</span><span class="token punctuation">(</span>@<span class="token function"><a href="/api/common/filters/decorators/Err.html"><span class="token">Err</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> error<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> @<span class="token function"><a href="/api/common/filters/decorators/Next.html"><span class="token">Next</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> next<span class="token punctuation">:</span> Express.NextFunction<span class="token punctuation">)</span> <span class="token punctuation">{</span>
 if <span class="token punctuation">(</span>error && <span class="token function">nameOf</span><span class="token punctuation">(</span><span class="token function">getClass</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span> === <span class="token string">"MongooseError"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   <span class="token keyword">const</span> err<span class="token punctuation"> = </span>new <span class="token function">BadRequest</span><span class="token punctuation">(</span>error.message<span class="token punctuation">)</span><span class="token punctuation">;</span>
   err.stack<span class="token punctuation"> = </span>error.stack<span class="token punctuation">;</span>
   throw err<span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 <span class="token function">next</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::