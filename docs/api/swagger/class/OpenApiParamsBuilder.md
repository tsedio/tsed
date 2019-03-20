---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation OpenApiParamsBuilder class
---
# OpenApiParamsBuilder <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { OpenApiParamsBuilder }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger/src/class/OpenApiParamsBuilder"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/swagger/src/class/OpenApiParamsBuilder.ts#L0-L0">/packages/swagger/src/class/OpenApiParamsBuilder.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> OpenApiParamsBuilder <span class="token keyword">extends</span> <a href="/api/swagger/class/OpenApiModelSchemaBuilder.html"><span class="token">OpenApiModelSchemaBuilder</span></a> <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> methodClassName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> pathParameters?<span class="token punctuation">:</span> PathParameter<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this<span class="token punctuation">;</span>
    <span class="token keyword">protected</span> <span class="token function">createSchemaFromBodyParam</span><span class="token punctuation">(</span>param<span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a><span class="token punctuation">;</span>
    <span class="token keyword">protected</span> <span class="token function">createSchemaFromQueryParam</span><span class="token punctuation">(</span>model<span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> parameters<span class="token punctuation">:</span> Parameter<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">createSchemaFromBodyParam</span><span class="token punctuation">(</span>param<span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">protected</span> <span class="token function">createSchemaFromQueryParam</span><span class="token punctuation">(</span>model<span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> parameters<span class="token punctuation">:</span> Parameter<span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::