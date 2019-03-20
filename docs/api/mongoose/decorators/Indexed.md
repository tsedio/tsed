---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Indexed decorator
---
# Indexed <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Indexed }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/mongoose/src/decorators/indexed.ts#L0-L0">/packages/mongoose/src/decorators/indexed.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Indexed</span><span class="token punctuation">(</span>index?<span class="token punctuation">:</span> SchemaTypeOpts.IndexOpts | <span class="token keyword">boolean</span> | <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Tells Mongoose whether to define an index for the property.
### Example

```typescript
@Model()
export class EventModel {
  @Indexed()
  field: string;
}
```


:::