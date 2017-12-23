<header class="symbol-info-header">    <h1 id="uniqueitems">UniqueItems</h1>    <label class="symbol-info-type-label decorator">Decorator</label>    <label class="api-type-label constructor">constructor</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { UniqueItems }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/ajv"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/ajv/decorators/uniqueItems.ts#L0-L0">                ajv/decorators/uniqueItems.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">UniqueItems</span><span class="token punctuation">(</span>uniqueItems?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

If this keyword has boolean value false, the instance validates successfully. If it has boolean value true, the instance validates successfully if all of its elements are unique.

## Example

```typescript
class Model {
   @UniqueItems()  // default true
   property: number[];
}
```
