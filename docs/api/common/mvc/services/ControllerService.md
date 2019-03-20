---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ControllerService service
---
# ControllerService <Badge text="Service" type="service"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ControllerService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/mvc/services/ControllerService.ts#L0-L0">/packages/common/src/mvc/services/ControllerService.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> ControllerService <span class="token keyword">extends</span> <a href="/api/core/class/ProxyMap.html"><span class="token">ProxyMap</span></a>&lt<span class="token punctuation">;</span><a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span> | <span class="token keyword">any</span><span class="token punctuation">,</span> <a href="/api/common/mvc/class/ControllerProvider.html"><span class="token">ControllerProvider</span></a>&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>injectorService<span class="token punctuation">:</span> InjectorService<span class="token punctuation">,</span> expressApplication<span class="token punctuation">:</span> Express.Application<span class="token punctuation">,</span> settings<span class="token punctuation">:</span> <a href="/api/common/config/services/ServerSettingsService.html"><span class="token">ServerSettingsService</span></a><span class="token punctuation">,</span> routeService<span class="token punctuation">:</span> <a href="/api/common/mvc/services/RouteService.html"><span class="token">RouteService</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">readonly</span> routes<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        route<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        provider<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    $<span class="token function">onRoutesInit</span><span class="token punctuation">(</span>components<span class="token punctuation">:</span> <span class="token punctuation">{</span>
        file<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        endpoint<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
        classes<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


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
<pre><code class="typescript-lang ">$<span class="token function">onRoutesInit</span><span class="token punctuation">(</span>components<span class="token punctuation">:</span> <span class="token punctuation">{</span>
     file<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     endpoint<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>
     classes<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
 <span class="token punctuation">}</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>

</div>



:::