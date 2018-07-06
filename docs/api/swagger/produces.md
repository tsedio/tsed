
<header class="symbol-info-header"><h1 id="produces">Produces</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label swagger" title="swagger">swagger</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Produces }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.26.2/src//swagger/decorators/produces.ts#L0-L0">/swagger/decorators/produces.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">Produces</span><span class="token punctuation">(</span>...produces<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> => <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Add produces metadata on the decorated element.

## Examples
### On method

```typescript
class Model {
   @Produces("text/html")
   id: string;
}
```

<!-- Members -->

