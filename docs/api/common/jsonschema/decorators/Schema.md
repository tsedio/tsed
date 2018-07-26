---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Schema decorator
---
# Schema <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Schema }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.30.1/src//common/jsonschema/decorators/schema.ts#L0-L0">/common/jsonschema/decorators/schema.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Schema</span><span class="token punctuation">(</span>partialSchema<span class="token punctuation">:</span> Partial&lt<span class="token punctuation">;</span><a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a>&gt<span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  return <span class="token function">decoratorSchemaFactory</span><span class="token punctuation">(</span><span class="token punctuation">(</span>schema<span class="token punctuation">:</span> <a href="/api/common/jsonschema/class/JsonSchema.html"><span class="token">JsonSchema</span></a><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token punctuation">{</span>
    schema.<span class="token function">merge</span><span class="token punctuation">(</span>partialSchema<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre>



<!-- Description -->
## Description

::: v-pre

Write data formatted to JsonSchema.

## Example

```typescript
@Schema({title: "test"})
class Model {
   @Schema({formatMinimum: "1987-10-24"})
   @Format("date")
   birthDate: Date
}
```

Will produce:

```json
{
  "type": "object",
  "title": "test",
  "properties": {
    "birthdate": {
       "type": "string",
       "format": "date",
       "formatMinimum": "1987-10-24"
    }
  }
}
```


:::