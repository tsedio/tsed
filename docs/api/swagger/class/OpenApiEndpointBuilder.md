---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation OpenApiEndpointBuilder class
---
# OpenApiEndpointBuilder <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { OpenApiEndpointBuilder }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger/src/class/OpenApiEndpointBuilder"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/swagger/src/class/OpenApiEndpointBuilder.ts#L0-L0">/packages/swagger/src/class/OpenApiEndpointBuilder.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> OpenApiEndpointBuilder <span class="token keyword">extends</span> <a href="/api/swagger/class/OpenApiModelSchemaBuilder.html"><span class="token">OpenApiModelSchemaBuilder</span></a> <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>endpoint<span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">,</span> endpointUrl<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> pathMethod<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        path?<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/PathParamsType.html"><span class="token">PathParamsType</span></a><span class="token punctuation">;</span>
        method?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span> getOperationId<span class="token punctuation">:</span> <span class="token punctuation">(</span>targetName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> methodName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this<span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> paths<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        <span class="token punctuation">[</span>p<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> Path<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
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
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> paths<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     <span class="token punctuation">[</span>p<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> Path<span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">;</span></code></pre>

</div>



:::