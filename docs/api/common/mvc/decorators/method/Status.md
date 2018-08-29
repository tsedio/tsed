---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Status decorator
---
# Status <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Status }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/mvc/decorators/method/status.ts#L0-L0">/common/mvc/decorators/method/status.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Status</span><span class="token punctuation">(</span>code<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">,</span> options<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IResponseOptions.html"><span class="token">IResponseOptions</span></a><span class="token punctuation"> = </span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  return <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token function">decorate</span><span class="token punctuation">(</span><span class="token punctuation">(</span>store<span class="token punctuation">:</span> <a href="/api/core/class/Store.html"><span class="token">Store</span></a><span class="token punctuation">,</span> parameters<span class="token punctuation">:</span> <a href="/api/core/interfaces/DecoratorParameters.html"><span class="token">DecoratorParameters</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    store.<span class="token function">set</span><span class="token punctuation">(</span>"statusCode"<span class="token punctuation">,</span> code<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">const</span> response<span class="token punctuation"> = </span><span class="token function">mapReturnedResponse</span><span class="token punctuation">(</span>options<span class="token punctuation">)</span><span class="token punctuation">;</span>
    store.<span class="token function">merge</span><span class="token punctuation">(</span>"response"<span class="token punctuation">,</span> response<span class="token punctuation">)</span><span class="token punctuation">;</span>
    store.<span class="token function">merge</span><span class="token punctuation">(</span>"responses"<span class="token punctuation">,</span> <span class="token punctuation">{</span><span class="token punctuation">[</span>code<span class="token punctuation">]</span><span class="token punctuation">:</span> response<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    return <span class="token function"><a href="/api/common/mvc/decorators/method/UseAfter.html"><span class="token">UseAfter</span></a></span><span class="token punctuation">(</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> response<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> next<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      response.<span class="token function">status</span><span class="token punctuation">(</span>code<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Set the HTTP status for the response. It is a chainable alias of Node’s `response.statusCode`.

```typescript
@Status(204)
async myMethod() {}
```

With swagger description:

```typescript
@Status(204, {
  type: Model
  description: "Description"
})
@Header('Content-Type', 'application-json')
async myMethod() {
}
```

This example will produce the swagger responses object:

```json
{
  "responses": {
    "404": {
      "description": "Description",
      "headers": {
         "Content-Type": {
            "type": "string"
         }
      }
    }
  }
}
```


:::