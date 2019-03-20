---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Status decorator
---
# Status <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Status }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/mvc/decorators/method/status.ts#L0-L0">/packages/common/src/mvc/decorators/method/status.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Status</span><span class="token punctuation">(</span>code<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">,</span> options?<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IResponseOptions.html"><span class="token">IResponseOptions</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Set the HTTP status for the response. It is a chainable alias of Node’s `response.statusCode`.

<<< @/docs/docs/snippets/controllers/response-status.ts

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