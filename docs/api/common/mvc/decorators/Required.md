---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Required decorator
---
# Required <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Required }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/mvc/decorators/required.ts#L0-L0">/common/mvc/decorators/required.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Required</span><span class="token punctuation">(</span>...allowedRequiredValues<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span> <span class="token punctuation">{</span>
  return <span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt<span class="token punctuation">;</span><span class="token keyword">any</span>&gt<span class="token punctuation">;</span><span class="token punctuation">,</span> propertyKey<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">,</span> parameterIndex<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span>typeof parameterIndex === "<span class="token keyword">number</span>"<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <a href="/api/common/filters/registries/ParamRegistry.html"><span class="token">ParamRegistry</span></a>.<span class="token function">required</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">,</span> parameterIndex<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
      <a href="/api/common/jsonschema/registries/PropertyRegistry.html"><span class="token">PropertyRegistry</span></a>.<span class="token function">required</span><span class="token punctuation">(</span>target<span class="token punctuation">,</span> propertyKey<span class="token punctuation">,</span> allowedRequiredValues<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Add required annotation for a function argument.

The @Required decorator can be used on two cases.

To decorate a parameters:

```typescript
@Post("/")
async method(@Required() @BodyParams("field") field: string) {}
```

To decorate a model:

```typescript
class Model {
  @JsonProperty()
  @Required()
  field: string;
}
```

> Required will throw a BadRequest when the given value is `null`, an empty string or `undefined`.

### Allow a values

In some case, you didn't want trigger a BadRequest when the value is an empty string for example.
The decorator `@Allow()`, allow you to configure a value list for which there will be no exception.

```typescript
class Model {
  @JsonProperty()
  @Required()
  @Allow("")
  field: string;
}
```


:::