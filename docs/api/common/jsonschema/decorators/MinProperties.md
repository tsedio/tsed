---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation MinProperties decorator
---
# MinProperties <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MinProperties }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/jsonschema/decorators/minProperties.ts#L0-L0">/packages/common/src/jsonschema/decorators/minProperties.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">MinProperties</span><span class="token punctuation">(</span>minProperties<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

An object instance is valid against `minProperties` if its number of properties is greater than, or equal to, the value of this keyword.

::: warning
The value of this keyword MUST be a non-negative integer.
:::

::: tip
Omitting this keyword has the same behavior as a value of 0.
:::

## Example

```typescript
class Model {
   @Any()
   @MinProperties(10)
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
      "minProperties": 10
    }
  }
}
```


:::