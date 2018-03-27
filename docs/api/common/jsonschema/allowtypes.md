
<header class="symbol-info-header"><h1 id="allowtypes">AllowTypes</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label jsonschema" title="jsonschema">jsonschema</label><label class="api-type-label auto-map" title="The data will be stored on the right place according to the type and collectionType (primitive or collection).">auto-map</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { AllowTypes }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/jsonschema/decorators/allowTypes.ts#L0-L0">/common/jsonschema/decorators/allowTypes.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">AllowTypes</span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> JSONSchema6TypeName<span class="token punctuation">,</span> ...types<span class="token punctuation">:</span> JSONSchema6TypeName<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> => <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Set the type of the array items.

## Example
### With multiple types

```typescript
class Model {
   @AllowTypes("string", "number", "boolean", "array")
   property: "string" | "number" | "boolean" | "array";
}
```

Will produce:

```json
{
  "type": "object",
  "properties": {
    "property": {
      "type": ["string", "number", "boolean", "array"]
    }
  }
}
```

### With array of multiple types

```typescript
class Model {
   @AllowTypes("string", "number", "boolean", "array")
   property: ("string" | "number" | "boolean" | "array")[];
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
         "type": ["string", "number", "boolean", "array"]
      }
    }
  }
}
```

<!-- Members -->

