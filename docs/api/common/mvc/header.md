
<header class="symbol-info-header"><h1 id="header">Header</h1><label class="symbol-info-type-label decorator">Decorator</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Header }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/mvc/decorators/method/header.ts#L0-L0">/common/mvc/decorators/method/header.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">Header</span><span class="token punctuation">(</span>headerName<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span> | <a href="#api/common/mvc/iheadersoptions"><span class="token">IHeadersOptions</span></a><span class="token punctuation">,</span> headerValue?<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span> | <a href="#api/common/mvc/iresponseheader"><span class="token">IResponseHeader</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <T><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span> | symbol<span class="token punctuation">,</span> descriptor<span class="token punctuation">:</span> TypedPropertyDescriptor<T><span class="token punctuation">)</span> => <span class="token keyword">void</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

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

<!-- Members -->

