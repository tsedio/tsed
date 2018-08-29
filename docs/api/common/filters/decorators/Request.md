---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Request decorator
---
# Request <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Request }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/filters/decorators/request.ts#L0-L0">/common/filters/decorators/request.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Request</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function <span class="token punctuation">{</span>
  return <span class="token function"><a href="/api/common/filters/decorators/Req.html"><span class="token">Req</span></a></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

/**
 * Request service.
 * @returns <span class="token punctuation">{</span><span class="token function">function</span><span class="token punctuation">(</span>Function<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token keyword">string</span>|symbol<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">}</span>
 * @decorator
 * @alias Request
 */</code></pre>



<!-- Description -->
## Description

::: v-pre

Request service.

:::