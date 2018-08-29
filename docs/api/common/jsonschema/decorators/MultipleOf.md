---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation MultipleOf decorator
---
# MultipleOf <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MultipleOf }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/jsonschema/decorators/multipleOf.ts#L0-L0">/common/jsonschema/decorators/multipleOf.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">MultipleOf</span><span class="token punctuation">(</span>multipleOf<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  if <span class="token punctuation">(</span>multipleOf &lt<span class="token punctuation">;</span>= 0<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    throw new <span class="token function">Error</span><span class="token punctuation">(</span>"The value of multipleOf MUST be a <span class="token keyword">number</span><span class="token punctuation">,</span> strictly greater than 0."<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  return <span class="token function">decoratorSchemaFactory</span><span class="token punctuation">(</span>schema =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    schema.mapper.multipleOf<span class="token punctuation"> = </span>multipleOf<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

A numeric instance is valid only if division by this keyword's value results in an integer.

!> The value of `multipleOf` MUST be a number, strictly greater than 0.

## Example
### With primitive type

```typescript
class Model {
   @MultipleOf(2)
   property: Number;
}
```

```json
{
  "type": "object",
  "properties": {
    "property": {
      "type": "number",
      "multipleOf": 2
    }
  }
}
```

### With array type

```typescript
class Model {
   @PropertyType(number)
   @MultipleOf(2)
   property: number[];
}
```

Will produce:

```json
{
  "type": "object",
  "properties": {
    "property": {
      "type": "array",
      "items": {
         "type": "number",
         "multipleOf": 2
      }
    }
  }
}
```


:::