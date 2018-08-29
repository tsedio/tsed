---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation OpenApiEndpointBuilder class
---
# OpenApiEndpointBuilder <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { OpenApiEndpointBuilder }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger/class/OpenApiEndpointBuilder"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//swagger/class/OpenApiEndpointBuilder.ts#L0-L0">/swagger/class/OpenApiEndpointBuilder.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> OpenApiEndpointBuilder <span class="token keyword">extends</span> <a href="/api/swagger/class/OpenApiModelSchemaBuilder.html"><span class="token">OpenApiModelSchemaBuilder</span></a> <span class="token punctuation">{</span>
  <span class="token keyword">constructor</span><span class="token punctuation">(</span>
    <span class="token keyword">private</span> endpoint<span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">,</span>
    <span class="token keyword">private</span> endpointUrl<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span>
    <span class="token keyword">private</span> getOperationId<span class="token punctuation">:</span> <span class="token punctuation">(</span>targetName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> methodName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">string</span>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">super</span><span class="token punctuation">(</span>endpoint.target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this <span class="token punctuation">{</span>
    <span class="token function">parseSwaggerPath</span><span class="token punctuation">(</span>this.endpointUrl<span class="token punctuation">,</span> this.pathMethod.path<span class="token punctuation">)</span>.<span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">{</span>path<span class="token punctuation">:</span> endpointPath<span class="token punctuation">,</span> pathParams<span class="token punctuation">}</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> builder<span class="token punctuation"> = </span>new <span class="token function"><a href="/api/swagger/class/OpenApiParamsBuilder.html"><span class="token">OpenApiParamsBuilder</span></a></span><span class="token punctuation">(</span>this.endpoint.target<span class="token punctuation">,</span> this.endpoint.methodClassName<span class="token punctuation">,</span> pathParams<span class="token punctuation">)</span>.<span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">const</span> path<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span>this._paths<span class="token punctuation">[</span>endpointPath<span class="token punctuation">]</span> || <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
      path<span class="token punctuation">[</span>this.pathMethod.method!<span class="token punctuation">]</span><span class="token punctuation"> = </span>this.<span class="token function">createOperation</span><span class="token punctuation">(</span>builder<span class="token punctuation">)</span><span class="token punctuation">;</span>
      Object.<span class="token function">assign</span><span class="token punctuation">(</span>this._definitions<span class="token punctuation">,</span> builder.definitions<span class="token punctuation">)</span><span class="token punctuation">;</span>
      this._paths<span class="token punctuation">[</span>endpointPath<span class="token punctuation">]</span><span class="token punctuation"> = </span>path<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> endpoint<span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">,</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> endpointUrl<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> getOperationId<span class="token punctuation">:</span> <span class="token punctuation">(</span>targetName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> methodName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">string</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 <span class="token function">super</span><span class="token punctuation">(</span>endpoint.target<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this <span class="token punctuation">{</span>
 <span class="token function">parseSwaggerPath</span><span class="token punctuation">(</span>this.endpointUrl<span class="token punctuation">,</span> this.pathMethod.path<span class="token punctuation">)</span>.<span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">{</span>path<span class="token punctuation">:</span> endpointPath<span class="token punctuation">,</span> pathParams<span class="token punctuation">}</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
   <span class="token keyword">const</span> builder<span class="token punctuation"> = </span>new <span class="token function"><a href="/api/swagger/class/OpenApiParamsBuilder.html"><span class="token">OpenApiParamsBuilder</span></a></span><span class="token punctuation">(</span>this.endpoint.target<span class="token punctuation">,</span> this.endpoint.methodClassName<span class="token punctuation">,</span> pathParams<span class="token punctuation">)</span>.<span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
   <span class="token keyword">const</span> path<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation"> = </span>this._paths<span class="token punctuation">[</span>endpointPath<span class="token punctuation">]</span> || <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
   path<span class="token punctuation">[</span>this.pathMethod.method!<span class="token punctuation">]</span><span class="token punctuation"> = </span>this.<span class="token function">createOperation</span><span class="token punctuation">(</span>builder<span class="token punctuation">)</span><span class="token punctuation">;</span>
   Object.<span class="token function">assign</span><span class="token punctuation">(</span>this._definitions<span class="token punctuation">,</span> builder.definitions<span class="token punctuation">)</span><span class="token punctuation">;</span>
   this._paths<span class="token punctuation">[</span>endpointPath<span class="token punctuation">]</span><span class="token punctuation"> = </span>path<span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">return this</code></pre>

</div>



:::