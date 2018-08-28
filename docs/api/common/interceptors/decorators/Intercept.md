---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Intercept decorator
---
# Intercept <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Intercept }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.0/src//common/interceptors/decorators/Intercept.ts#L0-L0">/common/interceptors/decorators/Intercept.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function Intercept&lt<span class="token punctuation">;</span>T <span class="token keyword">extends</span> <a href="/api/common/interceptors/interfaces/IInterceptor.html"><span class="token">IInterceptor</span></a>&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>interceptor<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Attaches interceptor to method call and executes the before and after methods


:::