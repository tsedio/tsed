---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation MaxProperties decorator
---
# MaxProperties <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MaxProperties }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/jsonschema/decorators/maxProperties.ts#L0-L0">/common/jsonschema/decorators/maxProperties.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">MaxProperties</span><span class="token punctuation">(</span>maxProperties<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  if <span class="token punctuation">(</span>maxProperties &lt<span class="token punctuation">;</span> 0<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    throw new <span class="token function">Error</span><span class="token punctuation">(</span>"The value of maxProperties MUST be a non-negative integer."<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  return <span class="token function">decoratorSchemaFactory</span><span class="token punctuation">(</span><span class="token punctuation">(</span>schema<span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    schema.maxProperties<span class="token punctuation"> = </span>maxProperties<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



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