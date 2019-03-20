---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation MaxProperties decorator
---
# MaxProperties <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MaxProperties }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/jsonschema/decorators/maxProperties.ts#L0-L0">/packages/common/src/jsonschema/decorators/maxProperties.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">MaxProperties</span><span class="token punctuation">(</span>maxProperties<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

An object instance is valid against `maxProperties` if its number of properties is less than, or equal to, the value of this keyword.

!> The value of this keyword MUST be a non-negative integer.

## Example

```typescript
class Model {
   @Any()
   @MaxProperties(10)
   property: any;
}
```

Will produce:

```json
{
  "type": "object",
  "properties": {
    "property": {
      "type": "any",
      "maxProperties": 10
    }
  }
}
```


:::