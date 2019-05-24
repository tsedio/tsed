---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Header decorator
---
# Header <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Header }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.18.0/packages/common/src/mvc/decorators/method/header.ts#L0-L0">/packages/common/src/mvc/decorators/method/header.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Header</span><span class="token punctuation">(</span>headerName<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span> | <a href="/api/common/mvc/interfaces/IHeadersOptions.html"><span class="token">IHeadersOptions</span></a><span class="token punctuation">,</span> headerValue?<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span> | <a href="/api/common/mvc/interfaces/IResponseHeader.html"><span class="token">IResponseHeader</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Sets the response’s HTTP header field to value. To set multiple fields at once, pass an object as the parameter.

```typescript
@Header('Content-Type', 'text/plain');
private myMethod() {}

@Status(204)
@Header({
  "Content-Type": "text/plain",
  "Content-Length": 123,
  "ETag": {
    "value": "12345",
    "description": "header description"
  }
})
private myMethod() {}
```

This example will produce the swagger responses object:

```json
{
  "responses": {
    "204": {
      "description": "Description",
      "headers": {
         "Content-Type": {
            "type": "string"
         },
         "Content-Length": {
            "type": "number"
         },
         "ETag": {
            "type": "string",
            "description": "header description"
         }
      }
    }
  }
}
```


:::