---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation MaxLength decorator
---
# MaxLength <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MaxLength }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/jsonschema/decorators/maxLength.ts#L0-L0">/packages/common/src/jsonschema/decorators/maxLength.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">MaxLength</span><span class="token punctuation">(</span>maxLength<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

A string instance is valid against this keyword if its length is less than, or equal to, the value of this keyword.

The length of a string instance is defined as the number of its characters as defined by [RFC 7159](http://json-schema.org/latest/json-schema-validation.html#RFC7159).

!> The value of `maxLength` MUST be a non-negative integer.

## Example
### With primitive type

```typescript
class Model {
   @MaxLength(10)
   property: number;
}
```

Will produce:

```json
{
  "type": "object",
  "properties": {
    "property": {
      "type": "string",
      "maxLength": 10
    }
  }
}
```

### With array type

```typescript
class Model {
   @MaxLength(10)
   @PropertyType(String)
   property: string[];
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
         "maxLength": 10
      }
    }
  }
}
```


:::