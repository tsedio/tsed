
<header class="symbol-info-header"><h1 id="any">Any</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label auto-map" title="The data will be stored on the right place according to the type and collectionType (primitive or collection).">auto-map</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Any }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/jsonschema/decorators/any.ts#L0-L0">/common/jsonschema/decorators/any.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">Any</span><span class="token punctuation">(</span>...types<span class="token punctuation">:</span> JSONSchema6TypeName<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> => <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Set the type of the array items.

## Example

```typescript
class Model {
   @Any()
   property: any;
}
```

Will produce:

```json
{
  "type": "object",
  "properties": {
    "property": {
      "type": ["integer", "number", "string", "boolean", "array", "object", "null"]
    }
  }
}
```

<!-- Members -->

