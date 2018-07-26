---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Description decorator
---
# Description <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Description }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//swagger/decorators/description.ts#L0-L0">/swagger/decorators/description.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Description</span><span class="token punctuation">(</span>description<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  return <span class="token punctuation">(</span>...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> type<span class="token punctuation"> = </span><span class="token function">getDecoratorType</span><span class="token punctuation">(</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span>
    switch <span class="token punctuation">(</span>type<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      case "parameter"<span class="token punctuation">:</span>
        return <span class="token function"><a href="/api/swagger/decorators/BaseParameter.html"><span class="token">BaseParameter</span></a></span><span class="token punctuation">(</span><span class="token punctuation">{</span>description<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span>...args<span class="token punctuation">)</span><span class="token punctuation">;</span>
      case "method"<span class="token punctuation">:</span>
        return <span class="token function"><a href="/api/swagger/decorators/Operation.html"><span class="token">Operation</span></a></span><span class="token punctuation">(</span><span class="token punctuation">{</span>description<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span>...args<span class="token punctuation">)</span><span class="token punctuation">;</span>
      case "<span class="token keyword">class</span>"<span class="token punctuation">:</span>
        <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>...args<span class="token punctuation">)</span>.<span class="token function">set</span><span class="token punctuation">(</span>"description"<span class="token punctuation">,</span> description<span class="token punctuation">)</span><span class="token punctuation">;</span>
      default<span class="token punctuation">:</span>
        <span class="token function"><a href="/api/common/jsonschema/decorators/Schema.html"><span class="token">Schema</span></a></span><span class="token punctuation">(</span><span class="token punctuation">{</span>description<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span>...args<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Add a description metadata on the decorated element.

## Examples
### On class

```typescript
@Description("description")
class Model {

}
```

### On method

```typescript
@Controller("/")
class ModelCtrl {
   @Description("description")
   async method() {}
}
```

### On parameter

```typescript
@Controller("/")
class ModelCtrl {
   async method(@Description("description") @PathParam("id") id: string) {}
}
```

### On property

```typescript
class Model {
   @Description("description")
   id: string;
}
```


:::