---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Service decorator
---
# Service <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Service }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/di/decorators/service.ts#L0-L0">/common/di/decorators/service.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Service</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function <span class="token punctuation">{</span>
  return registerService<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

The decorators `@Service()` a new service can be injected in other service or controller on there `constructor`.
All services annotated with `@Service()` are constructed one time.

> `@Service()` use the `reflect-metadata` to collect and inject service on controllers or other services.


:::