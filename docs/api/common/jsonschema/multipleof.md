
<header class="symbol-info-header"><h1 id="multipleof">MultipleOf</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label ajv" title="ajv">ajv</label><label class="api-type-label jsonschema" title="jsonschema">jsonschema</label><label class="api-type-label auto-map" title="The data will be stored on the right place according to the type and collectionType (primitive or collection).">auto-map</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { MultipleOf }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/jsonschema/decorators/multipleOf.ts#L0-L0">/common/jsonschema/decorators/multipleOf.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">MultipleOf</span><span class="token punctuation">(</span>multipleOf<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> => <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

A numeric instance is valid only if division by this keyword's value results in an integer.

!> The value of `multipleOf` MUST be a number, strictly greater than 0.

## Example
### With primitive type

```typescript
class Model {
   @MultipleOf(2)
   property: Number;
}
```

```json
{
  "type": "object",
  "properties": {
    "property": {
      "type": "number",
      "multipleOf": 2
    }
  }
}
```

### With array type

```typescript
class Model {
   @PropertyType(number)
   @MultipleOf(2)
   property: number[];
}
```

Will produce:

```json
{
  "type": "object",
  "properties": {
    "property": {
      "type": "array",
      "items": {
         "type": "number",
         "multipleOf": 2
      }
    }
  }
}
```

<!-- Members -->

