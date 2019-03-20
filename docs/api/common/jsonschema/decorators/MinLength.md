---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation MinLength decorator
---
# MinLength <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MinLength }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/jsonschema/decorators/minLength.ts#L0-L0">/packages/common/src/jsonschema/decorators/minLength.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">MinLength</span><span class="token punctuation">(</span>minLength<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre


A string instance is valid against this keyword if its length is greater than, or equal to, the value of this keyword.

The length of a string instance is defined as the number of its characters as defined by [RFC 7159](http://json-schema.org/latest/json-schema-validation.html#RFC7159).

::: warning
The value of minLength MUST be a non-negative integer.
:::

::: tip
Omitting this keyword has the same behavior as a value of 0.
:::

## Example
### With primitive type

```typescript
class Model {
   @MinLength(10)
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
   @MinLength(10)
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
         "minLength": 10
      }
    }
  }
}
```


:::