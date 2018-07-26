---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation ContentType decorator
---
# ContentType <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ContentType }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/mvc/decorators/method/contentType.ts#L0-L0">/common/mvc/decorators/method/contentType.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">ContentType</span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  return <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token function">decorate</span><span class="token punctuation">(</span><span class="token punctuation">(</span>store<span class="token punctuation">:</span> <a href="/api/core/class/Store.html"><span class="token">Store</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    store.<span class="token function">merge</span><span class="token punctuation">(</span>"produces"<span class="token punctuation">,</span> type<span class="token punctuation">)</span><span class="token punctuation">;</span>

    return <span class="token function"><a href="/api/common/mvc/decorators/method/UseAfter.html"><span class="token">UseAfter</span></a></span><span class="token punctuation">(</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> response<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> next<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      response.<span class="token function">type</span><span class="token punctuation">(</span>type<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Sets the Content-Type HTTP header to the MIME type as determined by mime.lookup() for the specified type.
If type contains the “/” character, then it sets the `Content-Type` to type.

```typescript
 @ContentType('.html');              // => 'text/html'
 @ContentType('html');               // => 'text/html'
 @ContentType('json');               // => 'application/json'
 @ContentType('application/json');   // => 'application/json'
 @ContentType('png');                // => image/png
 private myMethod() {}
```


:::