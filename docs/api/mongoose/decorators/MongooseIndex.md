---
sidebar: auto
meta:
 - name: keywords
   description: api typescript node.js documentation MongooseIndex decorator
---
# MongooseIndex <Badge text="Decorator" type="decorator"/>
<!-- Summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MongooseIndex }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/TypedProject/ts-express-decorators/blob/v5.4.0/packages/mongoose/src/decorators/mongooseIndex.ts#L0-L0">/packages/mongoose/src/decorators/mongooseIndex.ts</a></td></tr></tbody></table></section>

<!-- Overview -->
## Overview


<pre><code class="typescript-lang ">function <span class="token function">MongooseIndex</span><span class="token punctuation">(</span>fields<span class="token punctuation">:</span> object<span class="token punctuation">,</span> options<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>



<!-- Description -->
## Description

::: v-pre

Calls schema.index() to define an index (most likely compound) for the schema.

### Example

```typescript
@Model()
@MongooseIndex({first: 1, second: 1}, {unique: 1})
export class EventModel {

  @Property()
  first: string;

  @Property()
  second: string;

}
```


:::