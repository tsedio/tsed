---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Description decorator
---
# Description <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Description }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/swagger/src/decorators/description.ts#L0-L0">/packages/swagger/src/decorators/description.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Description</span><span class="token punctuation">(</span>description<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>



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