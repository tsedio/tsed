---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ControllerProvider class
---
# ControllerProvider <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ControllerProvider }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/mvc/class/ControllerProvider.ts#L0-L0">/common/mvc/class/ControllerProvider.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> ControllerProvider <span class="token keyword">extends</span> <a href="/api/common/di/class/Provider.html"><span class="token">Provider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> <span class="token keyword">implements</span> <a href="/api/common/mvc/interfaces/IControllerOptions.html"><span class="token">IControllerOptions</span></a> <span class="token punctuation">{</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  @<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token keyword">public</span> router<span class="token punctuation">:</span> Express.Router<span class="token punctuation">;</span>
  <span class="token keyword">constructor</span><span class="token punctuation">(</span>provide<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">super</span><span class="token punctuation">(</span>provide<span class="token punctuation">)</span><span class="token punctuation">;</span>
    this.type<span class="token punctuation"> = </span><span class="token string">"controller"</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">path</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> <span class="token punctuation">{</span>
    return this._path<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">path</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._path<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">endpoints</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
    return <a href="/api/common/mvc/registries/EndpointRegistry.html"><span class="token">EndpointRegistry</span></a>.<span class="token function">getEndpoints</span><span class="token punctuation">(</span><span class="token function">getClass</span><span class="token punctuation">(</span>this.provide<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">dependencies</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/mvc/class/IChildrenController.html"><span class="token">IChildrenController</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
    return this._dependencies<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">dependencies</span><span class="token punctuation">(</span>dependencies<span class="token punctuation">:</span> <a href="/api/common/mvc/class/IChildrenController.html"><span class="token">IChildrenController</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this._dependencies<span class="token punctuation"> = </span>dependencies<span class="token punctuation">;</span>
    this._dependencies.<span class="token function">forEach</span><span class="token punctuation">(</span>d =&gt<span class="token punctuation">;</span> <span class="token punctuation">(</span>d.$parentCtrl<span class="token punctuation"> = </span>this<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">routerOptions</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/config/interfaces/IRouterSettings.html"><span class="token">IRouterSettings</span></a> <span class="token punctuation">{</span>
    return this.store.<span class="token function">get</span><span class="token punctuation">(</span>"routerOptions"<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">parent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return this.provide.$parentCtrl<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">routerOptions</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <a href="/api/common/config/interfaces/IRouterSettings.html"><span class="token">IRouterSettings</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    this.store.<span class="token function">set</span><span class="token punctuation">(</span>"routerOptions"<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  get <span class="token function">middlewares</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IControllerMiddlewares.html"><span class="token">IControllerMiddlewares</span></a> <span class="token punctuation">{</span>
    return Object.<span class="token function">assign</span><span class="token punctuation">(</span>
      <span class="token punctuation">{</span>
        use<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        useAfter<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        useBefore<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      this.store.<span class="token function">get</span><span class="token punctuation">(</span>"middlewares"<span class="token punctuation">)</span> || <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  set <span class="token function">middlewares</span><span class="token punctuation">(</span>middlewares<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IControllerMiddlewares.html"><span class="token">IControllerMiddlewares</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> mdlwrs<span class="token punctuation"> = </span>this.middlewares<span class="token punctuation">;</span>
    <span class="token keyword">const</span> concat<span class="token punctuation"> = </span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> a<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> b<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">(</span>a<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation"> = </span>a<span class="token punctuation">[</span>key<span class="token punctuation">]</span>.<span class="token function">concat</span><span class="token punctuation">(</span>b<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    Object.<span class="token function">keys</span><span class="token punctuation">(</span>middlewares<span class="token punctuation">)</span>.<span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      <span class="token function">concat</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> mdlwrs<span class="token punctuation">,</span> middlewares<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    this.store.<span class="token function">set</span><span class="token punctuation">(</span>"middlewares"<span class="token punctuation">,</span> mdlwrs<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">public</span> getEndpointUrl<span class="token punctuation"> = </span><span class="token punctuation">(</span>routerPath<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> =&gt<span class="token punctuation">;</span>
    <span class="token punctuation">(</span>routerPath === this.path ? this.path <span class="token punctuation">:</span> <span class="token punctuation">(</span>routerPath || ""<span class="token punctuation">)</span> + this.path<span class="token punctuation">)</span>.<span class="token function">replace</span><span class="token punctuation">(</span>/\/\//gi<span class="token punctuation">,</span> "/"<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">public</span> <span class="token function">hasEndpointUrl</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    return !!this.path<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">public</span> <span class="token function">hasDependencies</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
    return !!this.dependencies.length<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">public</span> <span class="token function">hasParent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
    return !!this.provide.$parentCtrl<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">clone</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> ControllerProvider <span class="token punctuation">{</span>
    <span class="token keyword">const</span> provider<span class="token punctuation"> = </span>new <span class="token function">ControllerProvider</span><span class="token punctuation">(</span>this._provide<span class="token punctuation">)</span><span class="token punctuation">;</span>
    provider._type<span class="token punctuation"> = </span>this._type<span class="token punctuation">;</span>
    provider.useClass<span class="token punctuation"> = </span>this._useClass<span class="token punctuation">;</span>
    provider._instance<span class="token punctuation"> = </span>this._instance<span class="token punctuation">;</span>
    provider._path<span class="token punctuation"> = </span>this._path<span class="token punctuation">;</span>
    provider._dependencies<span class="token punctuation"> = </span>this._dependencies<span class="token punctuation">;</span>
    return provider<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



The path for the controller



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/core/decorators/NotEnumerable.html"><span class="token">NotEnumerable</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span></code></pre>

</div>



Controllers that depend to this controller.



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
<pre><code class="typescript-lang "><span class="token keyword">public</span> router<span class="token punctuation">:</span> Express.Router</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">path</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> <span class="token punctuation">{</span>
 return this._path<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">path</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._path<span class="token punctuation"> = </span>value<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



set path



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">endpoints</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
 return <a href="/api/common/mvc/registries/EndpointRegistry.html"><span class="token">EndpointRegistry</span></a>.<span class="token function">getEndpoints</span><span class="token punctuation">(</span><span class="token function">getClass</span><span class="token punctuation">(</span>this.provide<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">dependencies</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/mvc/class/IChildrenController.html"><span class="token">IChildrenController</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">{</span>
 return this._dependencies<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">dependencies</span><span class="token punctuation">(</span>dependencies<span class="token punctuation">:</span> <a href="/api/common/mvc/class/IChildrenController.html"><span class="token">IChildrenController</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this._dependencies<span class="token punctuation"> = </span>dependencies<span class="token punctuation">;</span>
 this._dependencies.<span class="token function">forEach</span><span class="token punctuation">(</span>d =&gt<span class="token punctuation">;</span> <span class="token punctuation">(</span>d.$parentCtrl<span class="token punctuation"> = </span>this<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">routerOptions</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/config/interfaces/IRouterSettings.html"><span class="token">IRouterSettings</span></a> <span class="token punctuation">{</span>
 return this.store.<span class="token function">get</span><span class="token punctuation">(</span>"routerOptions"<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">parent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 return this.provide.$parentCtrl<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">routerOptions</span><span class="token punctuation">(</span>value<span class="token punctuation">:</span> <a href="/api/common/config/interfaces/IRouterSettings.html"><span class="token">IRouterSettings</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 this.store.<span class="token function">set</span><span class="token punctuation">(</span>"routerOptions"<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">get <span class="token function">middlewares</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IControllerMiddlewares.html"><span class="token">IControllerMiddlewares</span></a> <span class="token punctuation">{</span>
 return Object.<span class="token function">assign</span><span class="token punctuation">(</span>
   <span class="token punctuation">{</span>
     use<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
     useAfter<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
     useBefore<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
   <span class="token punctuation">}</span><span class="token punctuation">,</span>
   this.store.<span class="token function">get</span><span class="token punctuation">(</span>"middlewares"<span class="token punctuation">)</span> || <span class="token punctuation">{</span><span class="token punctuation">}</span>
 <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">set <span class="token function">middlewares</span><span class="token punctuation">(</span>middlewares<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IControllerMiddlewares.html"><span class="token">IControllerMiddlewares</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> mdlwrs<span class="token punctuation"> = </span>this.middlewares<span class="token punctuation">;</span>
 <span class="token keyword">const</span> concat<span class="token punctuation"> = </span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> a<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> b<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">(</span>a<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation"> = </span>a<span class="token punctuation">[</span>key<span class="token punctuation">]</span>.<span class="token function">concat</span><span class="token punctuation">(</span>b<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 Object.<span class="token function">keys</span><span class="token punctuation">(</span>middlewares<span class="token punctuation">)</span>.<span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
   <span class="token function">concat</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> mdlwrs<span class="token punctuation">,</span> middlewares<span class="token punctuation">)</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
 this.store.<span class="token function">set</span><span class="token punctuation">(</span>"middlewares"<span class="token punctuation">,</span> mdlwrs<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">public</span> getEndpointUrl<span class="token punctuation"> = </span><span class="token punctuation">(</span>routerPath<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span> =&gt<span class="token punctuation">;</span></code></pre>

</div>



Resolve final endpoint url.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token punctuation">(</span>routerPath === this.path ? this.path <span class="token punctuation">:</span> <span class="token punctuation">(</span>routerPath || ""<span class="token punctuation">)</span> + this.path<span class="token punctuation">)</span>.<span class="token function">replace</span><span class="token punctuation">(</span>/\/\//gi<span class="token punctuation">,</span> "/"<span class="token punctuation">)</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">public</span> <span class="token function">hasEndpointUrl</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
 return !!this.path<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">public</span> <span class="token function">hasDependencies</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
 return !!this.dependencies.length<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">public</span> <span class="token function">hasParent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span> <span class="token punctuation">{</span>
 return !!this.provide.$parentCtrl<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">clone</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/mvc/class/ControllerProvider.html"><span class="token">ControllerProvider</span></a> <span class="token punctuation">{</span>
 <span class="token keyword">const</span> provider<span class="token punctuation"> = </span>new <span class="token function"><a href="/api/common/mvc/class/ControllerProvider.html"><span class="token">ControllerProvider</span></a></span><span class="token punctuation">(</span>this._provide<span class="token punctuation">)</span><span class="token punctuation">;</span>
 provider._type<span class="token punctuation"> = </span>this._type<span class="token punctuation">;</span>
 provider.useClass<span class="token punctuation"> = </span>this._useClass<span class="token punctuation">;</span>
 provider._instance<span class="token punctuation"> = </span>this._instance<span class="token punctuation">;</span>
 provider._path<span class="token punctuation"> = </span>this._path<span class="token punctuation">;</span>
 provider._dependencies<span class="token punctuation"> = </span>this._dependencies<span class="token punctuation">;</span>
 return provider<span class="token punctuation">;</span>
  <span class="token punctuation">}</span></code></pre>

</div>



:::