---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation VirtualRef decorator
---
# Ref <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { VirtualRef }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v5.0.2/packages/mongoose/src/decorators/virtualref.ts#L0-L0">/packages/mongoose/src/decorators/VirtualRef.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">type VirtualRef&lt;T&gt;<span class="token punctuation"> = </span>T | <span class="token keyword">null</span><span class="token punctuation">;</span>
<pre><code class="typescript-lang ">type VirtualRefs&lt;T&gt;<span class="token punctuation"> = </span>T[]<span class="token punctuation">;</span>

function <span class="token function">VirtualRef</span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Define a property as mongoose virtual reference to other Model (decorated with @Model).

### Example

```typescript

@Model()
class FooModel {

   @VirtualRef("Foo2Model")
   field: VirtualRef<Foo2Model>

   @VirtualRef("Foo2Model")
   list: VirtualRefs<Foo2Model>
}

@Model()
class Foo2Model {
}
```


:::