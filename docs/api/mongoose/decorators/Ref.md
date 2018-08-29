---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Ref decorator
---
# Ref <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Ref }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//mongoose/decorators/ref.ts#L0-L0">/mongoose/decorators/ref.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">type Ref&lt<span class="token punctuation">;</span>T&gt<span class="token punctuation">;</span><span class="token punctuation"> = </span>T | <span class="token keyword">string</span><span class="token punctuation">;</span>
function <span class="token function">Ref</span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">any</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  return <a href="/api/common/jsonschema/registries/PropertyRegistry.html"><span class="token">PropertyRegistry</span></a>.<span class="token function">decorate</span><span class="token punctuation">(</span><span class="token punctuation">(</span>propertyMetadata<span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/PropertyMetadata.html"><span class="token">PropertyMetadata</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span>typeof type !== "<span class="token keyword">string</span>"<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      propertyMetadata.type<span class="token punctuation"> = </span>type<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    propertyMetadata.store.<span class="token function">merge</span><span class="token punctuation">(</span><a href="/api/mongoose/constants/MONGOOSE_SCHEMA.html"><span class="token">MONGOOSE_SCHEMA</span></a><span class="token punctuation">,</span> <span class="token punctuation">{</span>
      type<span class="token punctuation">:</span> <a href="/api/common/jsonschema/decorators/Schema.html"><span class="token">Schema</span></a>.Types.ObjectId<span class="token punctuation">,</span>
      ref<span class="token punctuation">:</span> typeof type === "<span class="token keyword">string</span>" ? type <span class="token punctuation">:</span> <a href="/api/core/class/Store.html"><span class="token">Store</span></a>.<span class="token keyword">from</span><span class="token punctuation">(</span>type<span class="token punctuation">)</span>.<span class="token function">get</span><span class="token punctuation">(</span><a href="/api/mongoose/constants/MONGOOSE_MODEL_NAME.html"><span class="token">MONGOOSE_MODEL_NAME</span></a><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



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