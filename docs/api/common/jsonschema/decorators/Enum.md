---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Enum decorator
---
# Enum <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Enum }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/jsonschema/decorators/enum.ts#L0-L0">/common/jsonschema/decorators/enum.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Enum</span><span class="token punctuation">(</span>enumValue<span class="token punctuation">:</span> JSONSchema6Type | <span class="token keyword">any</span><span class="token punctuation">,</span> ...enumValues<span class="token punctuation">:</span> JSONSchema6Type<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  return <span class="token function">decoratorSchemaFactory</span><span class="token punctuation">(</span>schema =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    if <span class="token punctuation">(</span>typeof enumValue === <span class="token string">"object"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> info<span class="token punctuation"> = </span>Object.<span class="token function">keys</span><span class="token punctuation">(</span>enumValue<span class="token punctuation">)</span>.<span class="token function">reduce</span><span class="token punctuation">(</span>
        <span class="token punctuation">(</span>acc<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> key<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
          if <span class="token punctuation">(</span><span class="token function">isNaN</span><span class="token punctuation">(</span>+key<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">const</span> value<span class="token punctuation"> = </span>enumValue<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
            <span class="token keyword">const</span> type<span class="token punctuation"> = </span>typeof value<span class="token punctuation">;</span>

            if <span class="token punctuation">(</span>acc.type.<span class="token function">indexOf</span><span class="token punctuation">(</span>type<span class="token punctuation">)</span> === -1<span class="token punctuation">)</span> <span class="token punctuation">{</span>
              acc.type.<span class="token function">push</span><span class="token punctuation">(</span>type<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>

            acc.values.<span class="token function">push</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>

          return acc<span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>type<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> values<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">}</span>
      <span class="token punctuation">)</span><span class="token punctuation">;</span>

      schema.mapper.type<span class="token punctuation"> = </span>info.type.length === 1 ? info.type<span class="token punctuation">[</span>0<span class="token punctuation">]</span> <span class="token punctuation">:</span> info.type<span class="token punctuation">;</span>
      schema.mapper.<span class="token keyword">enum</span><span class="token punctuation"> = </span>info.values<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> else <span class="token punctuation">{</span>
      schema.mapper.<span class="token keyword">enum</span><span class="token punctuation"> = </span><span class="token punctuation">[</span>enumValue<span class="token punctuation">]</span>.<span class="token function">concat</span><span class="token punctuation">(</span>enumValues<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

The enum keyword is used to restrict a value to a fixed set of values.
It must be an array with at least one element, where each element is unique.

Elements in the array might be of any value, including null.

## Example
### With primitive type

```typescript
class Model {
   @Enum("value1", "value2")
   property: "value1" | "value2";
}
```

Will produce:

```json
{
  "type": "object",
  "properties": {
    "property": {
      "type": "string",
      "enum": ["value1", "value2"]
    }
  }
}
```

### With array type

```typescript
class Model {
   @Enum("value1", "value2")
   property: ("value1" | "value2")[];
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
         "type": "string",
         "enum": ["value1", "value2"]
      }
    }
  }
}
```

### With Typescript Enum

```typescript
enum SomeEnum {
   ENUM_1 = "enum1",
   ENUM_2 = "enum2"
}

class Model {
   @Enum(SomeEnum)
   property: SomeEnum;
}
```

Will produce:

```json
{
  "type": "object",
  "properties": {
    "property": {
       "type": "string",
       "enum": ["enum1", "enum2"]
    }
  }
}
```


:::