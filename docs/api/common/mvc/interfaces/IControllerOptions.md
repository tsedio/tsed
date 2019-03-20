---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation IControllerOptions interface
---
# IControllerOptions <Badge text="Interface" type="interface"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { IControllerOptions }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/mvc/interfaces/IControllerOptions.ts#L0-L0">/packages/common/src/mvc/interfaces/IControllerOptions.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">interface</span> IControllerOptions <span class="token keyword">extends</span> Partial&lt<span class="token punctuation">;</span><a href="/api/di/interfaces/IProvider.html"><span class="token">IProvider</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    path?<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/PathParamsType.html"><span class="token">PathParamsType</span></a><span class="token punctuation">;</span>
    children?<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    routerOptions?<span class="token punctuation">:</span> <a href="/api/common/config/interfaces/IRouterSettings.html"><span class="token">IRouterSettings</span></a><span class="token punctuation">;</span>
    middlewares?<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IControllerMiddlewares.html"><span class="token">IControllerMiddlewares</span></a><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">path?<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/PathParamsType.html"><span class="token">PathParamsType</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">children?<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">routerOptions?<span class="token punctuation">:</span> <a href="/api/common/config/interfaces/IRouterSettings.html"><span class="token">IRouterSettings</span></a></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">middlewares?<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IControllerMiddlewares.html"><span class="token">IControllerMiddlewares</span></a></code></pre>

</div>



:::