---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Ref decorator
---
# Ref <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Ref }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/mongoose/src/decorators/ref.ts#L0-L0">/packages/mongoose/src/decorators/ref.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">type Ref&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation"> = </span>T | <span class="token keyword">string</span><span class="token punctuation">;</span>
function <span class="token function">Ref</span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Define a property as mongoose reference to other Model (decorated with @Model).

### Example

```typescript

@Model()
class FooModel {

   @Ref(Foo2Model)
   field: Ref<Foo2Model>

   @Ref(Foo2Model)
   list: Ref<Foo2Model>[]
}

@Model()
class Foo2Model {
}
```


:::