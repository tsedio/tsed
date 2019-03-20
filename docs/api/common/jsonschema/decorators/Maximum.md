---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Maximum decorator
---
# Maximum <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Maximum }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/jsonschema/decorators/maximum.ts#L0-L0">/packages/common/src/jsonschema/decorators/maximum.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Maximum</span><span class="token punctuation">(</span>maximum<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">,</span> exclusive?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

The value of `maximum` MUST be a number, representing an inclusive upper limit for a numeric instance.

If the instance is a number, then this keyword validates only if the instance is less than or exactly equal to `maximum`.

## Example
### With primitive type

```typescript
class Model {
   @Maximum(10)
   property: number;
}
```

Will produce:

```json
{
  "type": "object",
  "properties": {
    "property": {
      "type": "number",
      "maximum": 10
    }
  }
}
```

### With array type

```typescript
class Model {
   @Maximum(10)
   @PropertyType(Number)
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
         "maximum": 10
      }
    }
  }
}
```


:::