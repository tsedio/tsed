---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation Select decorator
---
# Select <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Select }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/mongoose/src/decorators/select.ts#L0-L0">/packages/mongoose/src/decorators/select.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">Select</span><span class="token punctuation">(</span>select?<span class="token punctuation">:</span> <span class="token keyword">boolean</span> | <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Tells Mongoose to set default select() behavior for this path.

### Example

```typescript
@Model()
export class EventModel {
  @Select()
  field: string;
}
```


:::