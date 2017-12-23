<header class="symbol-info-header">    <h1 id="propertytype">PropertyType</h1>    <label class="symbol-info-type-label decorator">Decorator</label>    <label class="api-type-label decorators">decorators</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { PropertyType }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/jsonschema"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/jsonschema/decorators/propertyType.ts#L0-L0">                jsonschema/decorators/propertyType.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">PropertyType</span><span class="token punctuation">(</span>type<span class="token punctuation">:</span> <a href="#api/common/core/type"><span class="token">Type</span></a><<span class="token keyword">any</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

Set the type of the array items.

```typescript
class Model {
   @PropertyType(String)
   property: string[];
}
```
