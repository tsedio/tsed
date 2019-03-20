---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Email decorator
---
# Email <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Email }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/common/src/jsonschema/decorators/email.ts#L0-L0">/packages/common/src/jsonschema/decorators/email.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Email</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> =&gt<span class="token punctuation">;</span> <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Apply an email validation on property.

## Example
### With primitive type

```typescript
class Model {
   @Email()
   property: string;
}
```

Will produce:

```json
{
  "type": "object",
  "properties": {
    "property": {
      "type": "string",
      "format": "email"
    }
  }
}
```

### With array type

```typescript
class Model {
   @Email()
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
         "format": "email"
      }
    }
  }
}
```

> See [Format](api/common/jsonschema/schema) decorator.

:::