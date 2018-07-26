---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Any decorator
---
# Any <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Any }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.2/src//common/jsonschema/decorators/any.ts#L0-L0">/common/jsonschema/decorators/any.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Any</span><span class="token punctuation">(</span>...types<span class="token punctuation">:</span> JSONSchema6TypeName<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  return <span class="token function">decoratorSchemaFactory</span><span class="token punctuation">(</span><span class="token punctuation">(</span>schema<span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    schema.mapper.type<span class="token punctuation"> = </span><span class="token punctuation">[</span>"integer"<span class="token punctuation">,</span> "<span class="token keyword">number</span>"<span class="token punctuation">,</span> "<span class="token keyword">string</span>"<span class="token punctuation">,</span> "<span class="token keyword">boolean</span>"<span class="token punctuation">,</span> "array"<span class="token punctuation">,</span> "object"<span class="token punctuation">,</span> "null"<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Set the type of the array items.

## Example

```typescript
class Model {
   @Any()
   property: any;
}
```

Will produce:

```json
{
  "type": "object",
  "properties": {
    "property": {
      "type": ["integer", "number", "string", "boolean", "array", "object", "null"]
    }
  }
}
```


:::