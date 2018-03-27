
<header class="symbol-info-header"><h1 id="minitems">MinItems</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label ajv" title="ajv">ajv</label><label class="api-type-label jsonschema" title="jsonschema">jsonschema</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MinItems }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/jsonschema/decorators/minItems.ts#L0-L0">/common/jsonschema/decorators/minItems.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">MinItems</span><span class="token punctuation">(</span>minItems<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> => <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

An array instance is valid against `minItems` if its size is greater than, or equal to, the value of this keyword.

!> The value `minItems` MUST be a non-negative integer.

?> Omitting this keyword has the same behavior as a value of 0.

## Example

```typescript
class Model {
   @PropertyType(String)
   @MinItems(10)
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
      "minItems": 10
    }
  }
}
```

<!-- Members -->

