
<header class="symbol-info-header"><h1 id="unique">Unique</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label mongoose" title="mongoose">mongoose</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Unique }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//mongoose/decorators/unique.ts#L0-L0">/mongoose/decorators/unique.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">Unique</span><span class="token punctuation">(</span>unique?<span class="token punctuation">:</span> <span class="token keyword">boolean</span> | <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Tells Mongoose to ensure a unique index is created for this path.

### Example

```typescript
@Model()
export class EventModel {
  @Unique()
  index: string;
}
```

<!-- Members -->

