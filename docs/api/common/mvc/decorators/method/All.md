---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation All decorator
---
# All <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { All }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/mvc/decorators/method/route.ts#L0-L0">/common/mvc/decorators/method/route.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">All</span><span class="token punctuation">(</span>path<span class="token punctuation">:</span> <span class="token keyword">string</span> | RegExp | <span class="token keyword">any</span><span class="token punctuation">,</span> ...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function <span class="token punctuation">{</span>
  return <span class="token function"><a href="/api/common/mvc/decorators/method/Use.html"><span class="token">Use</span></a></span><span class="token punctuation">(</span>...<span class="token punctuation">[</span>"all"<span class="token punctuation">,</span> path<span class="token punctuation">]</span>.<span class="token function">concat</span><span class="token punctuation">(</span>args<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

/**
 * This method is just like the `router.<span class="token function">METHOD</span><span class="token punctuation">(</span><span class="token punctuation">)</span>` methods<span class="token punctuation">,</span> except that it matches all HTTP methods <span class="token punctuation">(</span>verbs<span class="token punctuation">)</span>.
 *
 * This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches.
 * For example<span class="token punctuation">,</span> if you placed the following route at the top of all other route definitions<span class="token punctuation">,</span> it would require that
 * all routes <span class="token keyword">from</span> that point on would require authentication<span class="token punctuation">,</span> and automatically load a user.
 * Keep in mind that these callbacks do not have to act <span class="token keyword">as</span> end points<span class="token punctuation">;</span> loadUser can perform a task<span class="token punctuation">,</span> then call <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
 * to continue matching subsequent routes.
 * @param path
 * @param args
 * @returns <span class="token punctuation">{</span>Function<span class="token punctuation">}</span>
 * @decorator
 */</code></pre>



<!-- Description -->
## Description

::: v-pre

This method is just like the `router.METHOD()` methods, except that it matches all HTTP methods (verbs).

This method is extremely useful for mapping “global” logic for specific path prefixes or arbitrary matches.
For example, if you placed the following route at the top of all other route definitions, it would require that
all routes from that point on would require authentication, and automatically load a user.
Keep in mind that these callbacks do not have to act as end points; loadUser can perform a task, then call next()
to continue matching subsequent routes.

:::