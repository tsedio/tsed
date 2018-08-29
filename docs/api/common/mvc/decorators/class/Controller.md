---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Controller decorator
---
# Controller <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Controller }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/mvc/decorators/class/controller.ts#L0-L0">/common/mvc/decorators/class/controller.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Controller</span><span class="token punctuation">(</span>path<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/PathParamsType.html"><span class="token">PathParamsType</span></a> | <a href="/api/common/mvc/interfaces/IControllerOptions.html"><span class="token">IControllerOptions</span></a><span class="token punctuation">,</span> ...dependencies<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function <span class="token punctuation">{</span>
  return <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token function">registerController</span><span class="token punctuation">(</span>target<span class="token punctuation">)</span><span class="token punctuation">;</span>

    if <span class="token punctuation">(</span>typeof path === "<span class="token keyword">string</span>" || path instanceof RegExp || <span class="token function">isArrayOrArrayClass</span><span class="token punctuation">(</span>path<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <a href="/api/common/mvc/registries/ControllerRegistry.html"><span class="token">ControllerRegistry</span></a>.<span class="token function">merge</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> <span class="token punctuation">{</span>path<span class="token punctuation">:</span> path <span class="token keyword">as</span> <a href="/api/common/mvc/interfaces/PathParamsType.html"><span class="token">PathParamsType</span></a><span class="token punctuation">,</span> dependencies<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
      <a href="/api/common/mvc/registries/ControllerRegistry.html"><span class="token">ControllerRegistry</span></a>.<span class="token function">merge</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> path <span class="token keyword">as</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Declare a new controller with his Rest path. His methods annotated will be collected to build the routing list.
This routing listing will be built with the `express.Router` object.

```typescript
 @Controller("/calendars")
 export provide CalendarCtrl {

   @Get("/:id")
   public get(
     @Request() request: Express.Request,
     @Response() response: Express.Response,
     @Next() next: Express.NextFunction
   ): void {

   }
 }
```


:::