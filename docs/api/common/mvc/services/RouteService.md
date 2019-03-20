---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation RouteService service
---
# RouteService <Badge text="Service" type="service"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { RouteService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/mvc/services/RouteService.ts#L0-L0">/packages/common/src/mvc/services/RouteService.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> RouteService <span class="token keyword">implements</span> <a href="/api/common/server/interfaces/AfterRoutesInit.html"><span class="token">AfterRoutesInit</span></a> <span class="token punctuation">{</span>
    disableRoutesSummary<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>injectorService<span class="token punctuation">:</span> InjectorService<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> routes<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        route<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        provider<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    $<span class="token function">afterRoutesInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token function">addRoute</span><span class="token punctuation">(</span>route<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        route<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        provider<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span>
    <span class="token function">getRoutes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IControllerRoute.html"><span class="token">IControllerRoute</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token function">printRoutes</span><span class="token punctuation">(</span>logger?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        info<span class="token punctuation">:</span> <span class="token punctuation">(</span>s<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
    <span class="token function">getAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IControllerRoute.html"><span class="token">IControllerRoute</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Description -->
## Description

::: v-pre

`RouteService` is used to provide all routes collected by annotation `@ControllerProvider`.

:::


<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">disableRoutesSummary<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token keyword">readonly</span> routes<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     route<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     provider<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">$<span class="token function">afterRoutesInit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">addRoute</span><span class="token punctuation">(</span>route<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     route<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     provider<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">;</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">getRoutes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IControllerRoute.html"><span class="token">IControllerRoute</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



Get all routes built by TsExpressDecorators and mounted on Express application.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">printRoutes</span><span class="token punctuation">(</span>logger?<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     info<span class="token punctuation">:</span> <span class="token punctuation">(</span>s<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>

</div>



Print all route mounted in express via Annotation.



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">getAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IControllerRoute.html"><span class="token">IControllerRoute</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span></code></pre>

</div>



Return all Routes stored in ControllerProvider manager.



:::