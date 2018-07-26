---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation HandlerMetadata class
---
# HandlerMetadata <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { HandlerMetadata }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/mvc/class/HandlerMetadata.ts#L0-L0">/common/mvc/class/HandlerMetadata.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> HandlerMetadata <span class="token punctuation">{</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> 
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> 
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> 
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> 
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span> 
  <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token keyword">private</span> _target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> <span class="token keyword">private</span> _methodClassName?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this.<span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">private</span> <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._useClass<span class="token punctuation"> = </span>this._target<span class="token punctuation">;</span>
    <span class="token keyword">let</span> handler<span class="token punctuation"> = </span>this._target<span class="token punctuation">;</span>
    <span class="token keyword">let</span> target<span class="token punctuation"> = </span>this._target<span class="token punctuation">;</span>
    if <span class="token punctuation">(</span><a href="/api/common/di/registries/ProviderRegistry.html"><span class="token">ProviderRegistry</span></a>.<span class="token function">has</span><span class="token punctuation">(</span>this._target<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> provider<span class="token punctuation"> = </span><a href="/api/common/di/registries/ProviderRegistry.html"><span class="token">ProviderRegistry</span></a>.<span class="token function">get</span><span class="token punctuation">(</span>this._target<span class="token punctuation">)</span>!<span class="token punctuation">;</span>
      this._type<span class="token punctuation"> = </span>provider.type<span class="token punctuation">;</span>
      if <span class="token punctuation">(</span>provider.type === <a href="/api/common/di/interfaces/ProviderType.html"><span class="token">ProviderType</span></a>.MIDDLEWARE<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        this._type<span class="token punctuation"> = </span><span class="token string">"middleware"</span><span class="token punctuation">;</span>
        this._errorParam<span class="token punctuation"> = </span><a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>provider.provide<span class="token punctuation">)</span>.<span class="token function">get</span><span class="token punctuation">(</span>"middlewareType"<span class="token punctuation">)</span> === <a href="/api/common/mvc/interfaces/MiddlewareType.html"><span class="token">MiddlewareType</span></a>.ERROR<span class="token punctuation">;</span>
        this._methodClassName<span class="token punctuation"> = </span><span class="token string">"use"</span><span class="token punctuation">;</span>
        this._useClass<span class="token punctuation"> = </span>target<span class="token punctuation"> = </span>provider.useClass<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    if <span class="token punctuation">(</span>this._methodClassName<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      this._injectable<span class="token punctuation"> = </span><a href="/api/common/filters/registries/ParamRegistry.html"><span class="token">ParamRegistry</span></a>.<span class="token function">isInjectable</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> this._methodClassName<span class="token punctuation">)</span><span class="token punctuation">;</span>
      this._nextFunction<span class="token punctuation"> = </span><a href="/api/common/filters/registries/ParamRegistry.html"><span class="token">ParamRegistry</span></a>.<span class="token function">hasNextFunction</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> this._methodClassName<span class="token punctuation">)</span><span class="token punctuation">;</span>
      handler<span class="token punctuation"> = </span>target.prototype<span class="token punctuation">[</span>this._methodClassName<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    if <span class="token punctuation">(</span>!this._injectable<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      this._errorParam<span class="token punctuation"> = </span>handler.length === 4<span class="token punctuation">;</span>
      this._nextFunction<span class="token punctuation"> = </span>handler.length &gt<span class="token punctuation">;</span>= 3<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  get <span class="token function">type</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return this._type<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">errorParam</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
    return this._errorParam<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">injectable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
    return this._injectable<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">nextFunction</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
    return this._nextFunction<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">methodClassName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> | undefined <span class="token punctuation">{</span>
    return this._methodClassName<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">target</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
    return this._target<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">services</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span>this.injectable<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      return <a href="/api/common/filters/registries/ParamRegistry.html"><span class="token">ParamRegistry</span></a>.<span class="token function">getParams</span><span class="token punctuation">(</span>this._useClass<span class="token punctuation">,</span> this.methodClassName<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">const</span> parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">{</span>service<span class="token punctuation">:</span> <a href="/api/common/filters/constants/EXPRESS_REQUEST.html"><span class="token">EXPRESS_REQUEST</span></a><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>service<span class="token punctuation">:</span> <a href="/api/common/filters/constants/EXPRESS_RESPONSE.html"><span class="token">EXPRESS_RESPONSE</span></a><span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    if <span class="token punctuation">(</span>this.errorParam<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      parameters.<span class="token function">unshift</span><span class="token punctuation">(</span><span class="token punctuation">{</span>service<span class="token punctuation">:</span> <a href="/api/common/filters/constants/EXPRESS_ERR.html"><span class="token">EXPRESS_ERR</span></a><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    if <span class="token punctuation">(</span>this.nextFunction<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      parameters.<span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>service<span class="token punctuation">:</span> <a href="/api/common/filters/constants/EXPRESS_NEXT_FN.html"><span class="token">EXPRESS_NEXT_FN</span></a><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    return parameters<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">private</span> <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._useClass<span class="token punctuation"> = </span>this._target<span class="token punctuation">;</span>
 <span class="token keyword">let</span> handler<span class="token punctuation"> = </span>this._target<span class="token punctuation">;</span>
 <span class="token keyword">let</span> target<span class="token punctuation"> = </span>this._target<span class="token punctuation">;</span>
 if <span class="token punctuation">(</span><a href="/api/common/di/registries/ProviderRegistry.html"><span class="token">ProviderRegistry</span></a>.<span class="token function">has</span><span class="token punctuation">(</span>this._target<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   <span class="token keyword">const</span> provider<span class="token punctuation"> = </span><a href="/api/common/di/registries/ProviderRegistry.html"><span class="token">ProviderRegistry</span></a>.<span class="token function">get</span><span class="token punctuation">(</span>this._target<span class="token punctuation">)</span>!<span class="token punctuation">;</span>
   this._type<span class="token punctuation"> = </span>provider.type<span class="token punctuation">;</span>
   if <span class="token punctuation">(</span>provider.type === <a href="/api/common/di/interfaces/ProviderType.html"><span class="token">ProviderType</span></a>.MIDDLEWARE<span class="token punctuation">)</span> <span class="token punctuation">{</span>
     this._type<span class="token punctuation"> = </span><span class="token string">"middleware"</span><span class="token punctuation">;</span>
     this._errorParam<span class="token punctuation"> = </span><a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>provider.provide<span class="token punctuation">)</span>.<span class="token function">get</span><span class="token punctuation">(</span>"middlewareType"<span class="token punctuation">)</span> === <a href="/api/common/mvc/interfaces/MiddlewareType.html"><span class="token">MiddlewareType</span></a>.ERROR<span class="token punctuation">;</span>
     this._methodClassName<span class="token punctuation"> = </span><span class="token string">"use"</span><span class="token punctuation">;</span>
     this._useClass<span class="token punctuation"> = </span>target<span class="token punctuation"> = </span>provider.useClass<span class="token punctuation">;</span>
   <span class="token punctuation">}</span>
 <span class="token punctuation">}</span>
 if <span class="token punctuation">(</span>this._methodClassName<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   this._injectable<span class="token punctuation"> = </span><a href="/api/common/filters/registries/ParamRegistry.html"><span class="token">ParamRegistry</span></a>.<span class="token function">isInjectable</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> this._methodClassName<span class="token punctuation">)</span><span class="token punctuation">;</span>
   this._nextFunction<span class="token punctuation"> = </span><a href="/api/common/filters/registries/ParamRegistry.html"><span class="token">ParamRegistry</span></a>.<span class="token function">hasNextFunction</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> this._methodClassName<span class="token punctuation">)</span><span class="token punctuation">;</span>
   handler<span class="token punctuation"> = </span>target.prototype<span class="token punctuation">[</span>this._methodClassName<span class="token punctuation">]</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 if <span class="token punctuation">(</span>!this._injectable<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   this._errorParam<span class="token punctuation"> = </span>handler.length === 4<span class="token punctuation">;</span>
   this._nextFunction<span class="token punctuation"> = </span>handler.length &gt<span class="token punctuation">;</span>= 3<span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">type</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 return this._type<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">errorParam</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
 return this._errorParam<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">injectable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
 return this._injectable<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">nextFunction</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
 return this._nextFunction<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">methodClassName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> | undefined <span class="token punctuation">{</span>
 return this._methodClassName<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">target</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
 return this._target<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">services</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/filters/class/ParamMetadata.html"><span class="token">ParamMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
 if <span class="token punctuation">(</span>this.injectable<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   return <a href="/api/common/filters/registries/ParamRegistry.html"><span class="token">ParamRegistry</span></a>.<span class="token function">getParams</span><span class="token punctuation">(</span>this._useClass<span class="token punctuation">,</span> this.methodClassName<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 <span class="token keyword">const</span> parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">{</span>service<span class="token punctuation">:</span> <a href="/api/common/filters/constants/EXPRESS_REQUEST.html"><span class="token">EXPRESS_REQUEST</span></a><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>service<span class="token punctuation">:</span> <a href="/api/common/filters/constants/EXPRESS_RESPONSE.html"><span class="token">EXPRESS_RESPONSE</span></a><span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
 if <span class="token punctuation">(</span>this.errorParam<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   parameters.<span class="token function">unshift</span><span class="token punctuation">(</span><span class="token punctuation">{</span>service<span class="token punctuation">:</span> <a href="/api/common/filters/constants/EXPRESS_ERR.html"><span class="token">EXPRESS_ERR</span></a><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 if <span class="token punctuation">(</span>this.nextFunction<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   parameters.<span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>service<span class="token punctuation">:</span> <a href="/api/common/filters/constants/EXPRESS_NEXT_FN.html"><span class="token">EXPRESS_NEXT_FN</span></a><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span>
 return parameters<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::