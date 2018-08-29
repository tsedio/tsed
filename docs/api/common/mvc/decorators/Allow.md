---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Allow decorator
---
# Allow <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Allow }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/mvc/decorators/allow.ts#L0-L0">/common/mvc/decorators/allow.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Allow</span><span class="token punctuation">(</span>...allowedRequiredValues<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> allowNullInSchema<span class="token punctuation"> = </span><span class="token function">decoratorSchemaFactory</span><span class="token punctuation">(</span><span class="token punctuation">(</span>schema<span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span>schema && schema.mapper<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      if <span class="token punctuation">(</span>schema.mapper.$ref<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        schema.mapper.oneOf<span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">{</span>type<span class="token punctuation">:</span> <span class="token string">"null"</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>$ref<span class="token punctuation">:</span> schema.mapper.$ref<span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
        delete schema.mapper.$ref<span class="token punctuation">;</span>
      <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
        schema.mapper.type<span class="token punctuation"> = </span><span class="token punctuation">[</span><span class="token punctuation">]</span>.<span class="token function">concat</span><span class="token punctuation">(</span>schema.type<span class="token punctuation">,</span> <span class="token punctuation">[</span>"null"<span class="token punctuation">]</span> <span class="token keyword">as</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  return <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> parameterIndex?<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span>typeof parameterIndex === "<span class="token keyword">number</span>"<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> paramMetadata<span class="token punctuation"> = </span><a href="/api/common/filters/registries/ParamRegistry.html"><span class="token">ParamRegistry</span></a>.<span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">,</span> parameterIndex<span class="token punctuation">)</span><span class="token punctuation">;</span>
      paramMetadata.allowedRequiredValues<span class="token punctuation"> = </span>allowedRequiredValues<span class="token punctuation">;</span>

      <a href="/api/common/filters/registries/ParamRegistry.html"><span class="token">ParamRegistry</span></a>.<span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">,</span> parameterIndex<span class="token punctuation">,</span> paramMetadata<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
      <span class="token keyword">const</span> propertyMetadata<span class="token punctuation"> = </span><a href="/api/common/jsonschema/registries/PropertyRegistry.html"><span class="token">PropertyRegistry</span></a>.<span class="token function">get</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
      propertyMetadata.allowedRequiredValues<span class="token punctuation"> = </span>allowedRequiredValues<span class="token punctuation">;</span>

      <a href="/api/common/jsonschema/registries/PropertyRegistry.html"><span class="token">PropertyRegistry</span></a>.<span class="token function">set</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">,</span> propertyMetadata<span class="token punctuation">)</span><span class="token punctuation">;</span>

      if <span class="token punctuation">(</span>allowedRequiredValues.<span class="token function">some</span><span class="token punctuation">(</span>e =&gt<span class="token punctuation">;</span> e == null<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">allowNullInSchema</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Add allowed values when the property or parameters is required.

#### Example on parameter:

```typescript
@Post("/")
async method(@Required() @Allow("") @BodyParams("field") field: string) {}
```
> Required will throw a BadRequest when the given value is `null` or `undefined` but not for an empty string.

#### Example on model:

```typescript
class Model {
  @JsonProperty()
  @Required()
  @Allow("")
  field: string;
}
```


:::