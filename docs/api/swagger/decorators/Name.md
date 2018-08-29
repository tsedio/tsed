---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Name decorator
---
# Name <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Name }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//swagger/decorators/name.ts#L0-L0">/swagger/decorators/name.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Name</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  return <span class="token punctuation">(</span>...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> type<span class="token punctuation"> = </span><span class="token function">getDecoratorType</span><span class="token punctuation">(</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span>
    switch <span class="token punctuation">(</span>type<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      case "parameter"<span class="token punctuation">:</span>
        return <span class="token function"><a href="/api/swagger/decorators/BaseParameter.html"><span class="token">BaseParameter</span></a></span><span class="token punctuation">(</span><span class="token punctuation">{</span>name<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span>...args<span class="token punctuation">)</span><span class="token punctuation">;</span>
      case "<span class="token keyword">class</span>"<span class="token punctuation">:</span>
        <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>...args<span class="token punctuation">)</span>.<span class="token function">set</span><span class="token punctuation">(</span>"name"<span class="token punctuation">,</span> name<span class="token punctuation">)</span><span class="token punctuation">;</span>
        break<span class="token punctuation">;</span>
      default<span class="token punctuation">:</span>
        throw new <span class="token function">Error</span><span class="token punctuation">(</span>"Name is only supported on parameters and <span class="token keyword">class</span>"<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Add a name metadata on the decorated element.

## Examples
### On parameters

```typescript
async myMethod(@Name("nameOf") @PathParams("id") id: string): Promise<Model>  {

}
```

### On parameters

```typescript
@Name("AliasName")
@Controller("/")
class ModelCtrl {

}
```


:::