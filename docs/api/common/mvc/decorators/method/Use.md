---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Use decorator
---
# Use <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Use }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/mvc/decorators/method/use.ts#L0-L0">/common/mvc/decorators/method/use.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Use</span><span class="token punctuation">(</span>...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function <span class="token punctuation">{</span>
  return &lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> targetKey?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> descriptor?<span class="token punctuation">:</span> TypedPropertyDescriptor&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> TypedPropertyDescriptor&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span> | <span class="token keyword">void</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span><span class="token function">getDecoratorType</span><span class="token punctuation">(</span><span class="token punctuation">[</span>target<span class="token punctuation">,</span> targetKey<span class="token punctuation">,</span> descriptor<span class="token punctuation">]</span><span class="token punctuation">)</span> === <span class="token string">"method"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <a href="/api/common/mvc/registries/EndpointRegistry.html"><span class="token">EndpointRegistry</span></a>.<span class="token function">use</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> targetKey!<span class="token punctuation">,</span> args<span class="token punctuation">)</span><span class="token punctuation">;</span>

      return descriptor<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span>.<span class="token function">merge</span><span class="token punctuation">(</span>"middlewares"<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      use<span class="token punctuation">:</span> args
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Mounts the specified middleware function or functions at the specified path: the middleware function is executed when
the base of the requested path matches `path.

```typescript
@Controller('/')
@Use(Middleware1)
export class Ctrl {

   @Get('/')
   @Use(Middleware2)
   get() { }
}

```


:::