---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Header decorator
---
# Header <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Header }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/mvc/decorators/method/header.ts#L0-L0">/common/mvc/decorators/method/header.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Header</span><span class="token punctuation">(</span>headerName<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span> | <a href="/api/common/mvc/interfaces/IHeadersOptions.html"><span class="token">IHeadersOptions</span></a><span class="token punctuation">,</span> headerValue?<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span> | <a href="/api/common/mvc/interfaces/IResponseHeader.html"><span class="token">IResponseHeader</span></a><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  return &lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> descriptor<span class="token punctuation">:</span> TypedPropertyDescriptor&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span>headerValue !== undefined<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      headerName<span class="token punctuation"> = </span><span class="token punctuation">{</span><span class="token punctuation">[</span>headerName <span class="token keyword">as</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> headerValue<span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    // metadata
    <span class="token keyword">const</span> store<span class="token punctuation"> = </span><a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">,</span> descriptor<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> headers<span class="token punctuation">:</span> <a href="/api/common/mvc/interfaces/IResponseHeaders.html"><span class="token">IResponseHeaders</span></a><span class="token punctuation"> = </span><span class="token function">mapHeaders</span><span class="token punctuation">(</span>headerName <span class="token keyword">as</span> <a href="/api/common/mvc/interfaces/IHeadersOptions.html"><span class="token">IHeadersOptions</span></a><span class="token punctuation">)</span><span class="token punctuation">;</span>

    store.<span class="token function">merge</span><span class="token punctuation">(</span>"response"<span class="token punctuation">,</span> <span class="token punctuation">{</span>headers<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    return <span class="token function"><a href="/api/common/mvc/decorators/method/UseAfter.html"><span class="token">UseAfter</span></a></span><span class="token punctuation">(</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> response<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> next<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      Object.<span class="token function">keys</span><span class="token punctuation">(</span>headers<span class="token punctuation">)</span>.<span class="token function">forEach</span><span class="token punctuation">(</span>key =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
        response.<span class="token function">set</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> headers<span class="token punctuation">[</span>key<span class="token punctuation">]</span>.value<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">,</span> descriptor<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



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