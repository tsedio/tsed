
<header class="symbol-info-header"><h1 id="schema">Schema</h1><label class="symbol-info-type-label function">Function</label><label class="api-type-label jsonschema" title="jsonschema">jsonschema</label><label class="api-type-label ajv" title="ajv">ajv</label><label class="api-type-label swagger" title="swagger">swagger</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Schema }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/jsonschema/decorators/schema.ts#L0-L0">/common/jsonschema/decorators/schema.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">Schema</span><span class="token punctuation">(</span>partialSchema<span class="token punctuation">:</span> Partial<<a href="#api/common/jsonschema/jsonschema"><span class="token">JsonSchema</span></a>><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> => <span class="token keyword">any</span><span class="token punctuation">;</span>
function <span class="token function">Schema</span><span class="token punctuation">(</span>definition<span class="token punctuation">:</span> SchemaTypeOpts<<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Write data formatted to JsonSchema.

## Example

```typescript
@Schema({title: "test"})
class Model {
   @Schema({formatMinimum: "1987-10-24"})
   @Format("date")
   birthDate: Date
}
```

Will produce:

```json
{
  "type": "object",
  "title": "test",
  "properties": {
    "birthdate": {
       "type": "string",
       "format": "date",
       "formatMinimum": "1987-10-24"
    }
  }
}
```

<!-- Members -->

