
<header class="symbol-info-header"><h1 id="ref">Ref</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label mongoose" title="mongoose">mongoose</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Ref }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/mongoose"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//mongoose/decorators/ref.ts#L0-L0">/mongoose/decorators/ref.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">type Ref<T> = T | <span class="token keyword">string</span><span class="token punctuation">;</span>
function <span class="token function">Ref</span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Define a property as mongoose reference to other Model (decorated with @Model).

### Example

```typescript

@Model()
class FooModel {

   @Ref(Foo2Model)
   field: Ref<Foo2Model>

   @Ref(Foo2Model)
   list: Ref<Foo2Model>[]
}

@Model()
class Foo2Model {
}
```

<!-- Members -->

