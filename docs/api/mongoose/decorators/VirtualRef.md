---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation VirtualRef decorator
---
# VirtualRef <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { VirtualRef }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/mongoose/src/decorators/virtualRef.ts#L0-L0">/packages/mongoose/src/decorators/virtualRef.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">type VirtualRef&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation"> = </span>T | null<span class="token punctuation">;</span>
function <span class="token function">VirtualRef</span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> foreignField<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Define a property as mongoose virtual reference to other Model (decorated with @Model).

Warning: To avoid circular dependencies, do not use the virtual reference model in
anything except a type declaration. Using the virtual reference model will prevent
typescript transpiler from stripping away the import statement and cause a circular
import in node.

### Example

```typescript

@Model()
class FooModel {

   @VirtualRef("Foo2Model", "foo")
   field: VirtualRef<Foo2Model>

   @VirtualRef("Foo2Model", "foo")
   list: VirtualRefs<Foo2Model>
}

@Model()
class Foo2Model {
   @Ref(FooModel)
   foo: Ref<FooModel>;
}
```


:::