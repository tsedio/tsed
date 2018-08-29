---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation MaxItems decorator
---
# MaxItems <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MaxItems }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/jsonschema/decorators/maxItems.ts#L0-L0">/common/jsonschema/decorators/maxItems.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">MaxItems</span><span class="token punctuation">(</span>maxItems<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  if <span class="token punctuation">(</span>maxItems &lt<span class="token punctuation">;</span> 0<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    throw new <span class="token function">Error</span><span class="token punctuation">(</span>"The value of maxItems MUST be a non-negative integer."<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  return <span class="token function">decoratorSchemaFactory</span><span class="token punctuation">(</span><span class="token punctuation">(</span>schema<span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    schema.maxItems<span class="token punctuation"> = </span>maxItems<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

The value `maxItems` MUST be a non-negative integer.

An array instance is valid against `maxItems` if its size is less than, or equal to, the value of this keyword.

## Example

```typescript
class Model {
   @PropertyType(String)
   @MaxItems(10)
   property: string[];
}
```

Will produce:

```json
{
  "type": "object",
  "properties": {
    "property": {
      "type": "number",
      "maxItems": 10
    }
  }
}
```


:::