---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation SwaggerService service
---
# SwaggerService <Badge text="Service" type="service"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { SwaggerService }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/swagger/src/services/SwaggerService.ts#L0-L0">/packages/swagger/src/services/SwaggerService.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> SwaggerService <span class="token punctuation">{</span>
    <span class="token keyword">constructor</span><span class="token punctuation">(</span>controllerService<span class="token punctuation">:</span> <a href="/api/common/mvc/services/ControllerService.html"><span class="token">ControllerService</span></a><span class="token punctuation">,</span> serverSettingsService<span class="token punctuation">:</span> <a href="/api/common/config/services/ServerSettingsService.html"><span class="token">ServerSettingsService</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">getOpenAPISpec</span><span class="token punctuation">(</span>conf<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/ISwaggerSettings.html"><span class="token">ISwaggerSettings</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Spec<span class="token punctuation">;</span>
    <span class="token function">getDefaultSpec</span><span class="token punctuation">(</span>conf<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/ISwaggerSettings.html"><span class="token">ISwaggerSettings</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Spec<span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">getOpenAPISpec</span><span class="token punctuation">(</span>conf<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/ISwaggerSettings.html"><span class="token">ISwaggerSettings</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Spec</code></pre>

</div>



:::



***



::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">getDefaultSpec</span><span class="token punctuation">(</span>conf<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/ISwaggerSettings.html"><span class="token">ISwaggerSettings</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Spec</code></pre>

</div>



Return the global api information.



:::