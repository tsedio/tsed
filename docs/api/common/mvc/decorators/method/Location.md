---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Location decorator
---
# Location <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Location }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/mvc/decorators/method/location.ts#L0-L0">/common/mvc/decorators/method/location.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Location</span><span class="token punctuation">(</span>location<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function <span class="token punctuation">{</span>
  return &lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> Function<span class="token punctuation">,</span> targetKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> descriptor<span class="token punctuation">:</span> TypedPropertyDescriptor&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation">)</span><span class="token punctuation">:</span> TypedPropertyDescriptor&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    return <span class="token function"><a href="/api/common/mvc/decorators/method/UseAfter.html"><span class="token">UseAfter</span></a></span><span class="token punctuation">(</span><span class="token punctuation">(</span>request<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> response<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> next<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
      response.<span class="token function">location</span><span class="token punctuation">(</span>location<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> targetKey<span class="token punctuation">,</span> descriptor<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Sets the response Location HTTP header to the specified path parameter.

```typescript
 @Location('/foo/bar')
 @Location('http://example.com')
 @Location('back')
 private myMethod() {

 }
```

A path value of “back” has a special meaning, it refers to the URL specified in the `Referer` header of the request. If the `Referer` header was not specified, it refers to “/”.


:::