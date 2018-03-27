
<header class="symbol-info-header"><h1 id="title">Title</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label jsonschema" title="jsonschema">jsonschema</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { Title }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/jsonschema/decorators/title.ts#L0-L0">/common/jsonschema/decorators/title.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">Title</span><span class="token punctuation">(</span>title<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>...parameters<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> => <span class="token keyword">any</span><span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Add title metadata on the decorated element.

## Example

```typescript
class Model {
   @Title("title")
   id: string;
}
```

Will produce:

```json
{
  "type": "object",
  "properties": {
    "id": {
       "type": "string",
       "title": "title"
    }
  }
}
```

<!-- Members -->

