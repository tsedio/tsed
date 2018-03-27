
<header class="symbol-info-header"><h1 id="maxitems">MaxItems</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label ajv" title="ajv">ajv</label><label class="api-type-label jsonschema" title="jsonschema">jsonschema</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MaxItems }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/jsonschema/decorators/maxItems.ts#L0-L0">/common/jsonschema/decorators/maxItems.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">MaxItems</span><span class="token punctuation">(</span>maxItems<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> => <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

The value `maxItems` MUST be a non-negative integer.

An array instance is valid against `maxItems` if its size is less than, or equal to, the value of this keyword.

## Example

```typescript
class Model {
   @PropertyType(String)
   @MaxItems(10)
   property: string[];
}
```

Will produce:

```json
{
  "type": "object",
  "properties": {
    "property": {
      "type": "number",
      "maxItems": 10
    }
  }
}
```

<!-- Members -->

