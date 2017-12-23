<header class="symbol-info-header">    <h1 id="maxitems">MaxItems</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { MaxItems }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/ajv"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/ajv/decorators/maxItems.ts#L0-L0">                ajv/decorators/maxItems.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">MaxItems</span><span class="token punctuation">(</span>maxItems<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

The value `maxItems` MUST be a non-negative integer.

An array instance is valid against `maxItems` if its size is less than, or equal to, the value of this keyword.

## Example

```typescript
class Model {
   @PropertyType(String)
   @MaxItems(10)
   property: string[];
}
```
