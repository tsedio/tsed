---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation AuthenticatedMiddleware class
---
# AuthenticatedMiddleware <Badge text="Class" type="class"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { AuthenticatedMiddleware }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.18.0/packages/common/src/mvc/components/AuthenticatedMiddleware.ts#L0-L0">/packages/common/src/mvc/components/AuthenticatedMiddleware.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang "><span class="token keyword">class</span> AuthenticatedMiddleware <span class="token keyword">implements</span> <a href="/api/common/mvc/interfaces/IMiddleware.html"><span class="token">IMiddleware</span></a> <span class="token punctuation">{</span>
    <span class="token function">use</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> <a href="/api/common/filters/decorators/Req.html"><span class="token">Req</span></a><span class="token punctuation">,</span> endpoint<span class="token punctuation">:</span> <a href="/api/common/filters/decorators/EndpointInfo.html"><span class="token">EndpointInfo</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span></code></pre>



<!-- Description -->
## Description

::: v-pre

This middleware manage the authentication based on passport strategy.


:::


<!-- Members -->




## Members


::: v-pre

<div class="method-overview">
<pre><code class="typescript-lang "><span class="token function">use</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> <a href="/api/common/filters/decorators/Req.html"><span class="token">Req</span></a><span class="token punctuation">,</span> endpoint<span class="token punctuation">:</span> <a href="/api/common/filters/decorators/EndpointInfo.html"><span class="token">EndpointInfo</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span></code></pre>

</div>



:::