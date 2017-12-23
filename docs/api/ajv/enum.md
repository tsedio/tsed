<header class="symbol-info-header">    <h1 id="enum">Enum</h1>    <label class="symbol-info-type-label decorator">Decorator</label>    <label class="api-type-label constructor">constructor</label>  </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { Enum }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/ajv"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/ajv/decorators/enum.ts#L0-L0">                ajv/decorators/enum.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">Enum</span><span class="token punctuation">(</span>...enumValue<span class="token punctuation">:</span> Array<<span class="token keyword">string</span> | <span class="token keyword">number</span> | <span class="token keyword">boolean</span> | <span class="token punctuation">{</span><span class="token punctuation">}</span>><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

The enum keyword is used to restrict a value to a fixed set of values.
It must be an array with at least one element, where each element is unique.

Elements in the array might be of any value, including null.

## Example

```typescript
class Model {
   @Enum("value1", "value2")
   property: "value1" | "value2";
}
```
