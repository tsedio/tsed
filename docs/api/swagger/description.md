
<header class="symbol-info-header"><h1 id="description">Description</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label swagger" title="swagger">swagger</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Description }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/swagger"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//swagger/decorators/description.ts#L0-L0">/swagger/decorators/description.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">Description</span><span class="token punctuation">(</span>description<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...args<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> => <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Add a description metadata on the decorated element.

## Examples
### On class

```typescript
@Description("description")
class Model {

}
```

### On method

```typescript
@Controller("/")
class ModelCtrl {
   @Description("description")
   async method() {}
}
```

### On parameter

```typescript
@Controller("/")
class ModelCtrl {
   async method(@Description("description") @PathParam("id") id: string) {}
}
```

### On property

```typescript
class Model {
   @Description("description")
   id: string;
}
```

<!-- Members -->

