---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Interceptor decorator
---
# Interceptor <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Interceptor }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/interceptors/decorators/Interceptor.ts#L0-L0">/common/interceptors/decorators/Interceptor.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Interceptor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function <span class="token punctuation">{</span>
  return registerInterceptor<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

The decorators `@Service()` a new service can be injected in other service or controller on there `constructor`.
All services annotated with `@Service()` are constructed one time.

> `@Service()` use the `reflect-metadata` to collect and inject service on controllers or other services.


:::