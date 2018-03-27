
<header class="symbol-info-header"><h1 id="exclusiveminimum">ExclusiveMinimum</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label ajv" title="ajv">ajv</label><label class="api-type-label jsonschema" title="jsonschema">jsonschema</label><label class="api-type-label auto-map" title="The data will be stored on the right place according to the type and collectionType (primitive or collection).">auto-map</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { ExclusiveMinimum }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/jsonschema/decorators/exclusiveMinimum.ts#L0-L0">/common/jsonschema/decorators/exclusiveMinimum.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">ExclusiveMinimum</span><span class="token punctuation">(</span>minimum<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">,</span> exclusiveMinimum?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> => <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

The value of `exclusiveMinimum` MUST be number, representing an exclusive upper limit for a numeric instance.

If the instance is a number, then the instance is valid only if it has a value strictly greater than (not equal to) `exclusiveMinimum`.

## Example
### With primitive type

```typescript
class Model {
   @ExclusiveMinimum(10)
   property: number;
}
```

Will produce:

```json
{
  "type": "object",
  "properties": {
    "property": {
      "type": "number",
      "exclusiveMinimum": 10
    }
  }
}
```

### With array type

```typescript
class Model {
   @ExclusiveMinimum(10)
   @PropertyType(Number)
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
         "exclusiveMinimum": 10
      }
    }
  }
}
```

<!-- Members -->

