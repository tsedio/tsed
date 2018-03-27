
<header class="symbol-info-header"><h1 id="indexed">Indexed</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label mongoose" title="mongoose">mongoose</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Indexed }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//mongoose/decorators/indexed.ts#L0-L0">/mongoose/decorators/indexed.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">Indexed</span><span class="token punctuation">(</span>index?<span class="token punctuation">:</span> SchemaTypeOpts.IndexOpts | <span class="token keyword">boolean</span> | <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Tells Mongoose whether to define an index for the property.
### Example

```typescript
@Model()
export class EventModel {
  @Indexed()
  field: string;
}
```

<!-- Members -->

