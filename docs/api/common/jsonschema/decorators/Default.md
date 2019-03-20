---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Default decorator
---
# Default <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Default }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/jsonschema/decorators/default.ts#L0-L0">/packages/common/src/jsonschema/decorators/default.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Default</span><span class="token punctuation">(</span>defaultValue<span class="token punctuation">:</span> <span class="token keyword">string</span> | <span class="token keyword">number</span> | <span class="token keyword">boolean</span> | <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

There are no restrictions placed on the value of this keyword.

This keyword can be used to supply a default JSON value associated with a particular schema.
It is RECOMMENDED that a default value be valid against the associated schema.

## Example

```typescript
class Model {
   @Default("10")
   property: string = "10";
}
```

Will produce:

```json
{
  "type": "object",
  "properties": {
    "property": {
      "type": "string",
      "default": "10"
    }
  }
}
```


:::