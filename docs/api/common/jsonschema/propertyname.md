
<header class="symbol-info-header"><h1 id="propertyname">PropertyName</h1><label class="symbol-info-type-label decorator">Decorator</label><label class="api-type-label converters" title="converters">converters</label></header>
<!-- summary -->
<section class="symbol-info"><table class="is-full-width"><tbody><tr><th>Module</th><td><div class="lang-typescript"><span class="token keyword">import</span> { PropertyName }&nbsp;<span class="token keyword">from</span>&nbsp;<span class="token string">"@tsed/common"</span></div></td></tr><tr><th>Source</th><td><a href="https://github.com/Romakita/ts-express-decorators/blob/v4.12.0/src//common/jsonschema/decorators/propertyName.ts#L0-L0">/common/jsonschema/decorators/propertyName.ts</a></td></tr></tbody></table></section>
<!-- overview -->


### Overview


<pre><code class="typescript-lang ">function <span class="token function">PropertyName</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>


<!-- Parameters -->

<!-- Description -->


### Description

Create an alias of the propertyKey that must be used by the converter.

?> This decorator is used by the Converters to deserialize correctly you model.

## Example

```typescript
class Model {
   @PropertyType(String)
   property: string[];
}
```

<!-- Members -->

