---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Enum decorator
---
# Enum <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Enum }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/jsonschema/decorators/enum.ts#L0-L0">/packages/common/src/jsonschema/decorators/enum.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Enum</span><span class="token punctuation">(</span>enumValue<span class="token punctuation">:</span> JSONSchema6Type | <span class="token keyword">any</span><span class="token punctuation">,</span> ...enumValues<span class="token punctuation">:</span> JSONSchema6Type<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>



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