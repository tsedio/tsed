
<header class="symbol-info-header"><h1 id="uniqueitems">UniqueItems</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label ajv" title="ajv">ajv</label><label class="api-type-label jsonschema" title="jsonschema">jsonschema</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { UniqueItems }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/jsonschema/decorators/uniqueItems.ts#L0-L0">/common/jsonschema/decorators/uniqueItems.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">UniqueItems</span><span class="token punctuation">(</span>uniqueItems?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> => <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

If this keyword has boolean value false, the instance validates successfully. If it has boolean value true, the instance validates successfully if all of its elements are unique.

## Example

```typescript
class Model {
   @UniqueItems()  // default true
   property: number[];
}
```

```typescript
class Model {
   @PropertyType(String)
   @UniqueItems()
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
      "uniqueItems": true,
      "items": {
        "type": "string"
      }
    }
  }
}
```

<!-- Members -->

