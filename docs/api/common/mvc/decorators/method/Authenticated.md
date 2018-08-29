---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Authenticated decorator
---
# Authenticated <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Authenticated }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/mvc/decorators/method/authenticated.ts#L0-L0">/common/mvc/decorators/method/authenticated.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Authenticated</span><span class="token punctuation">(</span>options?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  return <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token function">decorate</span><span class="token punctuation">(</span><span class="token punctuation">(</span>store<span class="token punctuation">:</span> <a href="/api/core/class/Store.html"><span class="token">Store</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    store.<span class="token function">set</span><span class="token punctuation">(</span><a href="/api/common/mvc/components/AuthenticatedMiddleware.html"><span class="token">AuthenticatedMiddleware</span></a><span class="token punctuation">,</span> options<span class="token punctuation">)</span>.<span class="token function">merge</span><span class="token punctuation">(</span>"responses"<span class="token punctuation">,</span> <span class="token punctuation">{</span>"403"<span class="token punctuation">:</span> <span class="token punctuation">{</span>description<span class="token punctuation">:</span> <span class="token string">"Forbidden"</span><span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    return <span class="token function"><a href="/api/common/mvc/decorators/method/UseBefore.html"><span class="token">UseBefore</span></a></span><span class="token punctuation">(</span><a href="/api/common/mvc/components/AuthenticatedMiddleware.html"><span class="token">AuthenticatedMiddleware</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Set authentication strategy on your endpoint.

```typescript
@ControllerProvider('/mypath')
class MyCtrl {

  @Get('/')
  @Authenticated({role: 'admin'})
  public getResource(){}
}
```


:::