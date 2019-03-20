---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ControllerProvider class
---
# ControllerProvider <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ControllerProvider }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/mvc/class/ControllerProvider.ts#L0-L0">/packages/common/src/mvc/class/ControllerProvider.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> ControllerProvider <span class="token keyword">extends</span> <a href="/api/di/class/Provider.html"><span class="token">Provider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> <span class="token keyword">implements</span> <a href="/api/common/mvc/interfaces/IControllerOptions.html"><span class="token">IControllerOptions</span></a> <span class="token punctuation">{</span>
    router<span class="token punctuation">:</span> Express.Router<span class="token punctuation">;</span>
    path<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>provide<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> endpoints<span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    children<span class="token punctuation">:</span> <a href="/api/common/mvc/class/IChildrenController.html"><span class="token">IChildrenController</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    routerOptions<span class="token punctuation">:</span> <a href="/api/common/config/interfaces/IRouterSettings.html"><span class="token">IRouterSettings</span></a><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> parent<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    middlewares<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IControllerMiddlewares.html"><span class="token">IControllerMiddlewares</span></a><span class="token punctuation">;</span>
    <span class="token function">getEndpointUrl</span><span class="token punctuation">(</span>routerPath<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
    <span class="token function">hasEndpointUrl</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token function">hasChildren</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token function">hasParent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Constructor


::: v-pre


<pre><code class="typescript-lang "><span class="token keyword">constructor</span><span class="token punctuation">(</span>provide<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span></code></pre>





Controllers that depend to this controller.


:::



## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">router<span class="token punctuation">:</span> Express.Router</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">path<span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



The path for the controller



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> endpoints<span class="token punctuation">:</span> <a href="/api/common/mvc/class/EndpointMetadata.html"><span class="token">EndpointMetadata</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">children<span class="token punctuation">:</span> <a href="/api/common/mvc/class/IChildrenController.html"><span class="token">IChildrenController</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">routerOptions<span class="token punctuation">:</span> <a href="/api/common/config/interfaces/IRouterSettings.html"><span class="token">IRouterSettings</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> parent<span class="token punctuation">:</span> <span class="token keyword">any</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">middlewares<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IControllerMiddlewares.html"><span class="token">IControllerMiddlewares</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">getEndpointUrl</span><span class="token punctuation">(</span>routerPath<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">string</span></code></pre>

</div>



Resolve final endpoint url.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">hasEndpointUrl</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">hasChildren</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">hasParent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::