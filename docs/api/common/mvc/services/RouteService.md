---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation RouteService service
---
# RouteService <Badge text="Service" type="service"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { RouteService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/mvc/services/RouteService.ts#L0-L0">/common/mvc/services/RouteService.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> RouteService <span class="token keyword">implements</span> <a href="/api/common/server/interfaces/AfterRoutesInit.html"><span class="token">AfterRoutesInit</span></a> <span class="token punctuation">{</span>
  @<span class="token function"><a href="/api/common/config/decorators/Constant.html"><span class="token">Constant</span></a></span><span class="token punctuation">(</span>"logger.disableRoutesSummary"<span class="token punctuation">,</span> false<span class="token punctuation">)</span>
  disableRoutesSummary<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>
  <span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token keyword">private</span> injectorService<span class="token punctuation">:</span> <a href="/api/common/di/services/InjectorService.html"><span class="token">InjectorService</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></code></pre>



<!-- Description -->
## Description

::: v-pre

`RouteService` is used to provide all routes collected by annotation `@ControllerProvider`.

:::


<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">@<span class="token function"><a href="/api/common/config/decorators/Constant.html"><span class="token">Constant</span></a></span><span class="token punctuation">(</span>"logger.disableRoutesSummary"<span class="token punctuation">,</span> false<span class="token punctuation">)</span></code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang ">disableRoutesSummary<span class="token punctuation">:</span> <span class="token keyword">boolean</span></code></pre>

</div>



:::