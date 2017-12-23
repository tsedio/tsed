<header class="symbol-info-header">    <h1 id="multipleof">MultipleOf</h1>    <label class="symbol-info-type-label decorator">Decorator</label>      </header>
<section class="symbol-info">      <table class="is-full-width">        <tbody>        <tr>          <th>Module</th>          <td>            <div class="lang-typescript">                <span class="token keyword">import</span> { MultipleOf }                 <span class="token keyword">from</span>                 <span class="token string">"ts-express-decorators/ajv"</span>                            </div>          </td>        </tr>        <tr>          <th>Source</th>          <td>            <a href="https://romakita.github.io/ts-express-decorators/#//blob/v3.0.0/src/ajv/decorators/multipleOf.ts#L0-L0">                ajv/decorators/multipleOf.ts            </a>        </td>        </tr>                </tbody>      </table>    </section>

### Overview

<pre><code class="typescript-lang">function <span class="token function">MultipleOf</span><span class="token punctuation">(</span>multipleOf<span class="token punctuation">:</span> <span class="token keyword">number</span><span class="token punctuation">)</span><span class="token punctuation">:</span> Function<span class="token punctuation">;</span></code></pre>

### Description

A numeric instance is valid only if division by this keyword's value results in an integer.

!> The value of `multipleOf` MUST be a number, strictly greater than 0.

## Example

```typescript
class Model {
   @MultipleOf(10)
   property: number;
}
```
