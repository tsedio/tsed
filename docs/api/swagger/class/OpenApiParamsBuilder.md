---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation OpenApiParamsBuilder class
---
# OpenApiParamsBuilder <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { OpenApiParamsBuilder }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger/class/OpenApiParamsBuilder"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//swagger/class/OpenApiParamsBuilder.ts#L0-L0">/swagger/class/OpenApiParamsBuilder.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> OpenApiParamsBuilder <span class="token keyword">extends</span> <a href="/api/swagger/class/OpenApiModelSchemaBuilder.html"><span class="token">OpenApiModelSchemaBuilder</span></a> <span class="token punctuation">{</span>
  <span class="token keyword">constructor</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> methodClassName<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> <span class="token keyword">private</span> pathParameters<span class="token punctuation">:</span> PathParameter<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">super</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>
    this.name<span class="token punctuation"> = </span>`$<span class="token punctuation">{</span><span class="token function">nameOf</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">}</span>$<span class="token punctuation">{</span>methodClassName.<span class="token function">charAt</span><span class="token punctuation">(</span>0<span class="token punctuation">)</span>.<span class="token function">toUpperCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span> + methodClassName.<span class="token function">slice</span><span class="token punctuation">(</span>1<span class="token punctuation">)</span><span class="token punctuation">}</span>`<span class="token punctuation">;</span>
    this.injectedParams<span class="token punctuation"> = </span><a href="/api/common/filters/registries/ParamRegistry.html"><span class="token">ParamRegistry</span></a>.<span class="token function">getParams</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> methodClassName<span class="token punctuation">)</span>.<span class="token function">filter</span><span class="token punctuation">(</span>param =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      if <span class="token punctuation">(</span>param.paramType === <a href="/api/common/filters/interfaces/ParamTypes.html"><span class="token">ParamTypes</span></a>.BODY<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        this.hasBody<span class="token punctuation"> = </span>true<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      if <span class="token punctuation">(</span>param.paramType === <a href="/api/common/filters/interfaces/ParamTypes.html"><span class="token">ParamTypes</span></a>.FORM_DATA<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        this.hasFormData<span class="token punctuation"> = </span>true<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      return !param.store.<span class="token function">get</span><span class="token punctuation">(</span>"hidden"<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this <span class="token punctuation">{</span>
    this._parameters<span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    this._parameters<span class="token punctuation"> = </span>this._parameters.<span class="token function">concat</span><span class="token punctuation">(</span>this.<span class="token function">getInHeaders</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> this.<span class="token function">getInPathParams</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> this.<span class="token function">getInQueryParams</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    if <span class="token punctuation">(</span>this.hasFormData<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      this._parameters<span class="token punctuation"> = </span>this._parameters.<span class="token function">concat</span><span class="token punctuation">(</span>this.<span class="token function">getInFormData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> else if <span class="token punctuation">(</span>this.hasBody<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      this._parameters<span class="token punctuation"> = </span>this._parameters.<span class="token function">concat</span><span class="token punctuation">(</span>this.<span class="token function">getInBodyParam</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">private</span> <span class="token function">getInHeaders</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> HeaderParameter<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
    return this.injectedParams.<span class="token function">filter</span><span class="token punctuation">(</span><span class="token punctuation">(</span>param<span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> param.paramType === <a href="/api/common/filters/interfaces/ParamTypes.html"><span class="token">ParamTypes</span></a>.HEADER<span class="token punctuation">)</span>.<span class="token function">map</span><span class="token punctuation">(</span>param =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      return Object.<span class="token function">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> param.store.<span class="token function">get</span><span class="token punctuation">(</span>"baseParameter"<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
        in<span class="token punctuation">:</span> <a href="/api/common/filters/interfaces/ParamTypes.html"><span class="token">ParamTypes</span></a>.HEADER<span class="token punctuation">,</span>
        name<span class="token punctuation">:</span> param.expression<span class="token punctuation">,</span>
        type<span class="token punctuation">:</span> <span class="token function">swaggerType</span><span class="token punctuation">(</span>param.type<span class="token punctuation">)</span><span class="token punctuation">,</span>
        required<span class="token punctuation">:</span> param.required
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this <span class="token punctuation">{</span>
 this._parameters<span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
 this._parameters<span class="token punctuation"> = </span>this._parameters.<span class="token function">concat</span><span class="token punctuation">(</span>this.<span class="token function">getInHeaders</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> this.<span class="token function">getInPathParams</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> this.<span class="token function">getInQueryParams</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 if <span class="token punctuation">(</span>this.hasFormData<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   this._parameters<span class="token punctuation"> = </span>this._parameters.<span class="token function">concat</span><span class="token punctuation">(</span>this.<span class="token function">getInFormData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span> else if <span class="token punctuation">(</span>this.hasBody<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   this._parameters<span class="token punctuation"> = </span>this._parameters.<span class="token function">concat</span><span class="token punctuation">(</span>this.<span class="token function">getInBodyParam</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 return this<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> <span class="token function">getInHeaders</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> HeaderParameter<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
 return this.injectedParams.<span class="token function">filter</span><span class="token punctuation">(</span><span class="token punctuation">(</span>param<span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> param.paramType === <a href="/api/common/filters/interfaces/ParamTypes.html"><span class="token">ParamTypes</span></a>.HEADER<span class="token punctuation">)</span>.<span class="token function">map</span><span class="token punctuation">(</span>param =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
   return Object.<span class="token function">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> param.store.<span class="token function">get</span><span class="token punctuation">(</span>"baseParameter"<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
     in<span class="token punctuation">:</span> <a href="/api/common/filters/interfaces/ParamTypes.html"><span class="token">ParamTypes</span></a>.HEADER<span class="token punctuation">,</span>
     name<span class="token punctuation">:</span> param.expression<span class="token punctuation">,</span>
     type<span class="token punctuation">:</span> <span class="token function">swaggerType</span><span class="token punctuation">(</span>param.type<span class="token punctuation">)</span><span class="token punctuation">,</span>
     required<span class="token punctuation">:</span> param.required
   <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></code></pre>

</div>



:::